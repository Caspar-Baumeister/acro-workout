import 'server-only';

import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai';
import { trainingPlanSchema, type TrainingPlanOutput } from '@/lib/validation/training-plan';
import type { QuestionnaireInput, SetupPreset, AcroStyleOption } from '@/lib/validation/questionnaire';
import { formatPhilosophyForPrompt } from '@/content/training-philosophy';
import { getPreferredExercisesTextBlock } from '@/lib/exercises';

/**
 * Gemini API service module
 * Server-only - never import this from client components
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('[Gemini] GEMINI_API_KEY not set - API calls will fail');
}

// Initialize Gemini client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// JSON schema for structured output (Gemini's native JSON mode)
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING, description: 'Title of the training plan - should reflect the role, style, and focus' },
    summary: { type: SchemaType.STRING, description: 'Brief summary explaining how this plan supports acro practice (2-3 sentences)' },
    profile: {
      type: SchemaType.OBJECT,
      properties: {
        role: { type: SchemaType.STRING },
        acrobaticsType: { type: SchemaType.STRING },
        acroStyleFocus: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: 'Array of style focuses: static, dynamic, asymmetric' },
        level: { type: SchemaType.STRING },
        trainingDays: { type: SchemaType.NUMBER },
        setup: { type: SchemaType.STRING, description: 'Equipment/environment description' },
        limitations: { type: SchemaType.STRING, nullable: true },
      },
      required: ['role', 'acrobaticsType', 'acroStyleFocus', 'level', 'trainingDays', 'setup'],
    },
    weeklyPlan: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          week: { type: SchemaType.NUMBER, description: 'Always 1 for evergreen plan' },
          theme: { type: SchemaType.STRING, description: 'Overall weekly theme (e.g., "Balanced Acro Support", "Strength & Mobility for Acro")' },
          sessions: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING, description: 'Session name (e.g., "Strength & Stability A", "Power & Mobility B")' },
                focus: { type: SchemaType.STRING, description: 'Primary focus and how it supports acro' },
                warmup: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      name: { type: SchemaType.STRING },
                      sets: { type: SchemaType.STRING, nullable: true },
                      reps: { type: SchemaType.STRING, nullable: true },
                      duration: { type: SchemaType.STRING, nullable: true },
                      notes: { type: SchemaType.STRING, nullable: true, description: 'Include tempo, rest, or why this matters for acro' },
                    },
                    required: ['name'],
                  },
                },
                main: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      name: { type: SchemaType.STRING },
                      sets: { type: SchemaType.STRING, nullable: true },
                      reps: { type: SchemaType.STRING, nullable: true },
                      duration: { type: SchemaType.STRING, nullable: true },
                      notes: { type: SchemaType.STRING, nullable: true, description: 'Include tempo (e.g., 3-1-2), rest periods, and acro application' },
                    },
                    required: ['name'],
                  },
                },
                accessory: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      name: { type: SchemaType.STRING },
                      sets: { type: SchemaType.STRING, nullable: true },
                      reps: { type: SchemaType.STRING, nullable: true },
                      duration: { type: SchemaType.STRING, nullable: true },
                      notes: { type: SchemaType.STRING, nullable: true },
                    },
                    required: ['name'],
                  },
                },
                cooldown: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      name: { type: SchemaType.STRING },
                      sets: { type: SchemaType.STRING, nullable: true },
                      reps: { type: SchemaType.STRING, nullable: true },
                      duration: { type: SchemaType.STRING, nullable: true },
                      notes: { type: SchemaType.STRING, nullable: true },
                    },
                    required: ['name'],
                  },
                },
              },
              required: ['name', 'focus', 'warmup', 'main', 'accessory', 'cooldown'],
            },
          },
        },
        required: ['week', 'theme', 'sessions'],
      },
    },
    safetyNotes: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: 'Role-specific safety and prehab guidance'
    },
    progressionRules: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: 'Clear progression guidelines for weeks 1-4 and beyond'
    },
  },
  required: ['title', 'summary', 'profile', 'weeklyPlan', 'safetyNotes', 'progressionRules'],
};

/**
 * Get human-readable setup description
 */
function getSetupDescription(preset: SetupPreset, notes?: string): string {
  const presetDescriptions: Record<SetupPreset, string> = {
    'no-equipment': 'Bodyweight only (no equipment, home environment)',
    'basic-home': 'Basic home setup (dumbbells, kettlebell, or adjustable weights)',
    'calisthenics-park': 'Calisthenics park (pull-up bars, dip bars, possibly rings)',
    'weighted-calisthenics': 'Weighted calisthenics setup (dip belt with plates, pull-up bar)',
    'gym-access': 'Gym access (machines and free weights, no barbell)',
    'barbell-available': 'Barbell available (squat rack, bench, Olympic bar)',
    'fully-stacked': 'Fully stacked gym (barbells, machines, cables, rings, everything)',
  };

  let description = presetDescriptions[preset] || preset;
  
  if (notes && notes.trim()) {
    description += `. Additional notes: ${notes.trim()}`;
  }

  return description;
}

/**
 * Get equipment constraints for prompt
 */
function getEquipmentConstraints(preset: SetupPreset, notes?: string): string {
  const constraints: Record<SetupPreset, string[]> = {
    'no-equipment': [
      'Use ONLY bodyweight exercises',
      'No equipment-based exercises (no dumbbells, barbells, machines)',
      'Include progressions using furniture if needed (chair dips, elevated push-ups)',
      'Focus on calisthenics progressions',
    ],
    'basic-home': [
      'Use dumbbells and/or kettlebells for resistance',
      'No barbell exercises (no squats with bar, no bench press with bar)',
      'Can include resistance band work if mentioned',
      'Focus on dumbbell variations of compound lifts',
    ],
    'calisthenics-park': [
      'Include pull-up and dip variations',
      'Can use rings if available',
      'No heavy barbell or machine work',
      'Focus on bodyweight progressions with equipment assistance',
    ],
    'weighted-calisthenics': [
      'Include weighted pull-ups, dips, and bodyweight movements',
      'Use dip belt for loading',
      'No barbell squats or bench press (unless noted)',
      'Focus on progressive overload through added weight to bodyweight moves',
    ],
    'gym-access': [
      'Can use machines and cable stations',
      'Can use dumbbells and free weights',
      'Avoid barbell-specific exercises unless the user has noted barbell access',
      'Include machine alternatives for compound movements',
    ],
    'barbell-available': [
      'Include barbell exercises (squats, deadlifts, bench, rows)',
      'Full compound lift access',
      'Can mix barbell and dumbbell work',
      'Include power-focused barbell movements',
    ],
    'fully-stacked': [
      'Full exercise selection available',
      'Include optimal exercise choices regardless of equipment',
      'Can use barbells, dumbbells, machines, cables, and rings',
      'Choose the best exercise for each goal',
    ],
  };

  let constraintList = constraints[preset] || [];
  
  // Add notes-based constraints
  if (notes && notes.trim()) {
    constraintList = [
      ...constraintList,
      `User-specific notes: "${notes.trim()}" — respect these constraints`,
    ];
  }

  return constraintList.map(c => `- ${c}`).join('\n');
}

/**
 * Get explosive work constraint based on selected styles
 */
function getExplosiveWorkConstraint(styles: AcroStyleOption[]): string {
  const hasDynamic = styles.includes('dynamic');
  const hasStatic = styles.includes('static');
  
  if (hasDynamic) {
    return '5. ✅ INCLUDE explosive/plyometric work - user trains dynamic moves';
  }
  if (hasStatic && !hasDynamic) {
    return '5. ❌ MINIMIZE explosive/plyometric work - user focuses on static poses';
  }
  return '5. ⚖️ Include moderate power work appropriate to their style';
}

/**
 * Format style focus array for display
 */
function formatStyleFocus(styles: AcroStyleOption[]): string {
  const labels: Record<AcroStyleOption, string> = {
    static: 'STATIC POSES (balances, shapes, controlled transitions)',
    dynamic: 'DYNAMIC MOVES (pops, throws, catches, explosive transitions)',
    asymmetric: 'ASYMMETRIC / MONOS (one-arm, one-leg, unilateral skills)',
  };
  return styles.map(s => labels[s]).join(' + ');
}

/**
 * Get acro style focus instructions for multiple selected styles
 */
function getStyleFocusInstructions(styles: AcroStyleOption[], role: string): string {
  const sections: string[] = [];
  
  const hasStatic = styles.includes('static');
  const hasDynamic = styles.includes('dynamic');
  const hasAsymmetric = styles.includes('asymmetric');

  // Determine overall balance
  const styleLabels = styles.map(s => {
    if (s === 'static') return 'Static Poses';
    if (s === 'dynamic') return 'Dynamic Moves';
    if (s === 'asymmetric') return 'Asymmetric/Mono Skills';
    return s;
  });
  
  sections.push(`### ACRO STYLE FOCUS: ${styleLabels.join(' + ').toUpperCase()}`);
  sections.push(`The user trains: **${styleLabels.join(', ')}**. The program must address all selected focuses.\n`);

  if (hasStatic) {
    sections.push(`**STATIC POSES REQUIREMENTS:**
- Include isometric strength and holds (hollow, arch, plank variations)
- Slow, controlled eccentric work (tempo: 4-1-2 or slower)
- Stability and balance training
- End-range strength (especially shoulders for ${role === 'flyer' ? 'overhead shapes' : 'holding positions'})
- Time-under-tension work
- ${role === 'base' ? 'Static pressing strength and stability under load' : 'Shape-holding and body tension drills'}`);
  }

  if (hasDynamic) {
    sections.push(`**DYNAMIC MOVES REQUIREMENTS:**
- Include explosive power training (jump variations, throws)
- Plyometric progressions
- Rate of force development work
- ${role === 'base' ? 'Explosive pressing and hip extension' : 'Explosive jumps and landing mechanics'}
- Reactive strength training
- ${role === 'flyer' ? 'Box-down jumps and falling/landing drills' : 'Catching readiness and quick reflexes'}
- Use contrast training (heavy lift → explosive movement)`);
  }

  if (hasAsymmetric) {
    sections.push(`**ASYMMETRIC / MONO SKILLS REQUIREMENTS:**
- Include significant unilateral (single-limb) strength work
- Single-arm pressing and pulling (one-arm push-ups progressions, archer pull-ups)
- Single-leg strength (pistol squats, shrimp squats, Bulgarian split squats)
- Anti-rotation core work (Pallof press, single-arm carries, bird dogs)
- Lateral stability and balance
- ${role === 'base' ? 'One-arm catching drills, asymmetric load holding' : 'One-arm handstand prep, single-limb balance shapes'}
- Address left/right imbalances explicitly`);
  }

  // Add balance guidance if multiple styles selected
  if (styles.length > 1) {
    sections.push(`**BALANCING MULTIPLE FOCUSES:**
- Each session should touch on ${styles.length === 2 ? 'both' : 'all'} selected style${styles.length > 1 ? 's' : ''} where possible
- Alternate primary focus between sessions (e.g., Session A = static emphasis, Session B = ${hasDynamic ? 'dynamic' : 'asymmetric'} emphasis)
- Don't sacrifice one style for another — the user wants all of them`);
  }

  // Special case: static only (minimize explosiveness)
  if (hasStatic && !hasDynamic) {
    sections.push(`**NOTE: MINIMIZE EXPLOSIVE WORK**
Since the user does NOT focus on dynamic moves:
- Reduce or remove pure plyometric exercises
- Keep power work minimal and controlled
- Focus on strength and stability over speed`);
  }

  return sections.join('\n\n');
}

/**
 * Build the prompt for training plan generation
 * Injects the training philosophy and creates a highly structured prompt
 */
function buildPrompt(data: QuestionnaireInput): string {
  const roleDescriptions: Record<string, string> = {
    base: 'BASE (the person who supports, lifts, and catches)',
    flyer: 'FLYER (the person who is lifted, balances, and performs shapes)',
    both: 'BOTH base and flyer roles (versatile training)',
  };

  const typeDescriptions: Record<string, string> = {
    'l-base': 'L-Base (lying down) partner acrobatics',
    standing: 'Standing partner acrobatics',
    both: 'both L-Base and Standing partner acrobatics',
  };

  const levelDescriptions: Record<string, string> = {
    beginner: 'BEGINNER (0-1 years experience) - focus on foundations and body awareness',
    intermediate: 'INTERMEDIATE (1-3 years experience) - building strength and refining technique',
    advanced: 'ADVANCED (3+ years experience) - optimizing performance and addressing specific weaknesses',
  };

  // Get role-specific training emphasis
  const roleEmphasis = getRoleEmphasis(data.role);
  
  // Get style-specific instructions (static vs dynamic)
  const styleInstructions = getStyleFocusInstructions(data.acroStyleFocus, data.role);
  
  // Get equipment constraints
  const setupDescription = getSetupDescription(data.setupPreset, data.setupNotes);
  const equipmentConstraints = getEquipmentConstraints(data.setupPreset, data.setupNotes);
  
  // Inject the training philosophy
  const philosophy = formatPhilosophyForPrompt();
  
  // Get preferred exercises from library
  const preferredExercises = getPreferredExercisesTextBlock({
    role: data.role,
    discipline: data.acrobaticsType,
    acroStyleFocus: data.acroStyleFocus,
    level: data.level,
    setupPreset: data.setupPreset,
  });

  return `You are an expert partner acrobatics strength & conditioning coach creating a SUPPLEMENTAL training program.

${philosophy}

---

${preferredExercises}

---

## USER PROFILE

- **Role**: ${roleDescriptions[data.role] || data.role}
- **Acrobatics Type**: ${typeDescriptions[data.acrobaticsType] || data.acrobaticsType}
- **Acro Style Focus**: ${formatStyleFocus(data.acroStyleFocus)}
- **Experience Level**: ${levelDescriptions[data.level] || data.level}
- **Training Days Per Week**: ${data.trainingDays} days
- **Setup/Equipment**: ${setupDescription}
${data.limitations ? `- **Limitations/Notes**: ${data.limitations}` : ''}

---

## EQUIPMENT CONSTRAINTS (STRICTLY FOLLOW)

${equipmentConstraints}

---

${styleInstructions}

---

## ROLE-SPECIFIC REQUIREMENTS

${roleEmphasis}

---

## OUTPUT REQUIREMENTS

Create an **EVERGREEN weekly training template** that the user can repeat indefinitely:

### Structure
- ${data.trainingDays} distinct sessions per week (labeled Session A, B, C, etc.)
- Each session: 45-60 minutes total
- Sessions should be **repeatable weekly** — no week-to-week periodization
- Design for long-term use until the user's goals or situation changes

### Session Components (REQUIRED in every session)
1. **Warmup** (8-12 min): Joint prep, activation, movement prep specific to session focus
2. **Main Work** (20-25 min): Primary strength${data.acroStyleFocus.includes('dynamic') ? '/power' : ''} exercises with clear prescription
3. **Accessory** (10-15 min): Supporting exercises + PREHAB work (wrists, shoulders, core)
4. **Cooldown** (5-8 min): Targeted mobility for the session's focus areas

### Exercise Prescription Format
For EVERY exercise, include:
- Sets and reps (e.g., "3 sets", "8-10 reps")
- Tempo when relevant (e.g., "3-1-2 tempo" = 3 sec down, 1 sec pause, 2 sec up)
- Rest periods for main lifts (e.g., "90s rest")
- **WHY IT MATTERS**: Brief note connecting to acro performance
- **PROGRESSION CUE**: How to know when to increase difficulty (e.g., "add weight when you can complete all reps with good form")

### Session Distribution
Design sessions to cover different focuses across the week:
- Balance strength, mobility, and prehab across all sessions
- Each session should have a primary focus but touch on all elements
- Avoid redundancy — sessions should complement each other

### MUST INCLUDE for ${data.role.toUpperCase()}
${data.role === 'base' ? `
- ${data.acroStyleFocus.includes('dynamic') ? 'Explosive power work (jumps, explosive hip extension)' : 'Isometric strength and stability under load'}
- Heavy compound lifts appropriate for their setup
- Grip and wrist conditioning
- Rotator cuff prehab every session
- Core anti-rotation and bracing work
- Lower back strengthening
${data.acroStyleFocus.includes('asymmetric') ? '- Unilateral strength work (single-arm, single-leg exercises)\n- Anti-rotation core for mono skills' : ''}` : ''}
${data.role === 'flyer' ? `
- Shoulder mobility drills with end-range strength
- Core stability in multiple planes (hollow body, arch, rotation)
- ${data.acroStyleFocus.includes('dynamic') ? 'Explosive jump training and landing mechanics' : 'Isometric shape holds and body tension drills'}
- Wrist conditioning for handstands
- Hip flexor and hamstring mobility
- NO excessive upper body hypertrophy work
${data.acroStyleFocus.includes('asymmetric') ? '- Single-arm handstand prep and progressions\n- Unilateral balance and stability work' : ''}` : ''}
${data.role === 'both' ? `
- Balanced strength work for both roles
- Shoulder mobility AND pressing strength
- Core stability AND anti-rotation strength
- ${data.acroStyleFocus.includes('dynamic') ? 'Explosive power AND landing mechanics' : 'Isometric control AND stability under load'}
- Full-body prehab coverage (wrists, shoulders, hips, ankles)
${data.acroStyleFocus.includes('asymmetric') ? '- Unilateral strength and stability for mono skills' : ''}` : ''}

### Safety Notes Requirements
Include 5-8 specific safety notes covering:
- Prehab priorities for their role
- Warning signs to watch for
- When to reduce intensity or take a deload week
- How to balance this plan with acro practice
- Recovery recommendations

### Progression Rules Requirements
Include 4-6 clear guidelines for SELF-DIRECTED PROGRESSION:
- How to know when to increase weight/difficulty for each exercise type
- Signs that you're ready to progress (e.g., "when all reps feel controlled")
- When to take a deload week (e.g., every 4-6 weeks or when feeling fatigued)
- How to adjust if acro training is particularly intense that week
- When to request a new plan (e.g., "if your role/equipment/goals change significantly")

---

## CONSTRAINTS (STRICTLY FOLLOW)

1. ❌ NO exercises that require equipment the user doesn't have
2. ❌ NO bodybuilding/hypertrophy focus (especially for flyers)
3. ❌ NO generic motivational fluff - be practical and specific
4. ❌ NO exercises without clear acro application
${getExplosiveWorkConstraint(data.acroStyleFocus)}
6. ✅ EVERY session must include prehab work
7. ✅ EVERY exercise must have sets/reps/notes
8. ✅ Focus on FUNCTIONAL strength that transfers to acro
9. ✅ Make the plan immediately actionable with their setup

Generate a complete, highly specific training plan now.`;
}

/**
 * Get role-specific training emphasis
 */
function getRoleEmphasis(role: string): string {
  if (role === 'base') {
    return `### BASE-SPECIFIC FOCUS
You are creating a plan for a BASE. Priorities:

**Strength (Critical)**
- Heavy compound movements appropriate to their equipment
- Overhead pressing strength for throwing/catching
- Horizontal pushing for stability

**Stability & Control**
- Single-leg strength and balance
- Anti-rotation core work
- Proprioception training

**Prehab Focus**
- Wrist strength and mobility
- Rotator cuff external rotation
- Lower back conditioning
- Hip stability in deep ranges`;
  }
  
  if (role === 'flyer') {
    return `### FLYER-SPECIFIC FOCUS
You are creating a plan for a FLYER. Priorities:

**Core Strength (Critical)**
- Hollow body progressions
- Arch holds and back extension
- Anti-rotation and rotation control
- Deep stabilizer activation

**Shoulder Mobility & Strength (Critical)**
- Full overhead range with control
- End-range shoulder strength
- Scapular stability and control

**Movement Quality**
- Body tension drills
- Line work and shape holding
- Proprioception and air awareness

**Prehab Focus**
- Wrist conditioning for handstands
- Shoulder stability (NOT just mobility)
- Ankle stability for landings
- Landing mechanics drills

**IMPORTANT: Keep them lean**
- Focus on relative strength, not size
- Avoid high-volume hypertrophy work
- Prioritize power-to-weight ratio`;
  }
  
  // Both roles
  return `### VERSATILE TRAINING FOCUS
You are creating a plan for someone who trains BOTH base and flyer. Priorities:

**Balanced Strength**
- Compound lifts appropriate to their equipment
- Both pushing AND overhead stability
- Full-body strength development

**Core (Critical)**
- Complete core training (hollow, arch, anti-rotation)
- Must support both lifting and flying

**Mobility**
- Shoulder mobility for overhead shapes
- Hip mobility for base positions
- Full-body flexibility

**Comprehensive Prehab**
- Wrist conditioning (both roles need it)
- Shoulder health (mobility + stability)
- Hip stability
- Ankle stability`;
}

/**
 * Generate a training plan using Gemini
 */
export async function generateTrainingPlan(
  data: QuestionnaireInput
): Promise<TrainingPlanOutput> {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  console.log('[Gemini] Generating plan for:', data.email);
  const startTime = Date.now();

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
        maxOutputTokens: 32768,
      },
    });

    const prompt = buildPrompt(data);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('[Gemini] Response received in', Date.now() - startTime, 'ms');

    // Parse JSON response
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error('[Gemini] Failed to parse JSON response:', text.substring(0, 500));
      throw new Error('Invalid JSON response from AI');
    }

    // Validate with Zod
    const validated = trainingPlanSchema.safeParse(parsed);
    if (!validated.success) {
      console.error('[Gemini] Validation failed:', validated.error.flatten());
      throw new Error('AI response did not match expected format');
    }

    console.log('[Gemini] Plan generated successfully:', validated.data.title);
    return validated.data;
  } catch (error) {
    console.error('[Gemini] Generation failed:', error);
    throw error;
  }
}
