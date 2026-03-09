import 'server-only';

import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai';
import { trainingPlanSchema, type TrainingPlanOutput } from '@/lib/validation/training-plan';
import type { QuestionnaireInput } from '@/lib/validation/questionnaire';
import { formatPhilosophyForPrompt } from '@/content/training-philosophy';

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
    title: { type: SchemaType.STRING, description: 'Title of the training plan - should reflect the role and focus' },
    summary: { type: SchemaType.STRING, description: 'Brief summary explaining how this plan supports acro practice (2-3 sentences)' },
    profile: {
      type: SchemaType.OBJECT,
      properties: {
        role: { type: SchemaType.STRING },
        acrobaticsType: { type: SchemaType.STRING },
        level: { type: SchemaType.STRING },
        goals: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        trainingDays: { type: SchemaType.NUMBER },
        equipment: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        limitations: { type: SchemaType.STRING, nullable: true },
      },
      required: ['role', 'acrobaticsType', 'level', 'goals', 'trainingDays', 'equipment'],
    },
    weeklyPlan: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          week: { type: SchemaType.NUMBER },
          theme: { type: SchemaType.STRING, description: 'Weekly focus theme (e.g., "Foundation & Prehab", "Building Strength", "Power Development", "Integration & Testing")' },
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
  
  // Inject the training philosophy
  const philosophy = formatPhilosophyForPrompt();

  return `You are an expert partner acrobatics strength & conditioning coach creating a SUPPLEMENTAL training program.

${philosophy}

---

## USER PROFILE

- **Role**: ${roleDescriptions[data.role] || data.role}
- **Acrobatics Type**: ${typeDescriptions[data.acrobaticsType] || data.acrobaticsType}
- **Experience Level**: ${levelDescriptions[data.level] || data.level}
- **Training Days Per Week**: ${data.trainingDays} days
- **Goals**: ${data.goals.join(', ')}
- **Available Equipment**: ${data.equipment.length > 0 ? data.equipment.join(', ') : 'Bodyweight only (no equipment)'}
${data.limitations ? `- **Limitations/Notes**: ${data.limitations}` : ''}

---

## ROLE-SPECIFIC REQUIREMENTS

${roleEmphasis}

---

## OUTPUT REQUIREMENTS

Create a **4-week supplemental training program** with these specifications:

### Structure
- ${data.trainingDays} sessions per week
- Each session: 45-60 minutes total
- Clear progression from Week 1 → Week 4

### Session Components (REQUIRED in every session)
1. **Warmup** (8-12 min): Joint prep, activation, movement prep specific to session focus
2. **Main Work** (20-25 min): Primary strength/power exercises with clear prescription
3. **Accessory** (10-15 min): Supporting exercises + PREHAB work (wrists, shoulders, core)
4. **Cooldown** (5-8 min): Targeted mobility for the session's focus areas

### Exercise Prescription Format
For EVERY exercise, include:
- Sets and reps (e.g., "3 sets", "8-10 reps")
- Tempo when relevant (e.g., "3-1-2 tempo" = 3 sec down, 1 sec pause, 2 sec up)
- Rest periods for main lifts (e.g., "90s rest")
- **WHY IT MATTERS**: Brief note connecting to acro performance

### Weekly Progression Themes
- Week 1: Foundation & Movement Quality (lighter loads, perfect form)
- Week 2: Building Volume (moderate intensity, technique reinforcement)
- Week 3: Intensity Phase (heavier loads, power development)
- Week 4: Integration & Testing (peak performance, skill transfer)

### MUST INCLUDE for ${data.role.toUpperCase()}
${data.role === 'base' ? `
- Heavy compound lifts (squats, deadlifts, presses) with low rep ranges (3-6)
- Explosive power work (jumps, throws, explosive hip extension)
- Grip and wrist conditioning
- Rotator cuff prehab every session
- Core anti-rotation and bracing work
- Lower back strengthening` : ''}
${data.role === 'flyer' ? `
- Shoulder mobility drills with end-range strength
- Core stability in multiple planes (hollow body, arch, rotation)
- Explosive jump training (box jumps, broad jumps, depth jumps)
- Landing mechanics and box-down jump progressions
- Wrist conditioning for handstands
- Hip flexor and hamstring mobility
- NO excessive upper body hypertrophy work` : ''}
${data.role === 'both' ? `
- Balanced strength work for both roles
- Shoulder mobility AND pressing strength
- Core stability AND anti-rotation strength
- Explosive power AND landing mechanics
- Full-body prehab coverage (wrists, shoulders, hips, ankles)` : ''}

### Safety Notes Requirements
Include 5-8 specific safety notes covering:
- Prehab priorities for their role
- Warning signs to watch for
- When to reduce intensity
- Recovery recommendations

### Progression Rules Requirements
Include 4-6 clear progression guidelines covering:
- How to progress week-to-week
- When to increase load/difficulty
- How to integrate with acro practice schedule
- Long-term progression beyond 4 weeks

---

## CONSTRAINTS (STRICTLY FOLLOW)

1. ❌ NO bodybuilding/hypertrophy focus (especially for flyers)
2. ❌ NO generic motivational fluff - be practical and specific
3. ❌ NO exercises without clear acro application
4. ✅ EVERY session must include prehab work
5. ✅ EVERY exercise must have sets/reps/notes
6. ✅ Focus on FUNCTIONAL strength that transfers to acro
7. ✅ Make the plan immediately actionable

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
- Heavy squats, deadlifts, lunges (3-6 rep range)
- Overhead pressing strength for throwing/catching
- Horizontal pushing for stability

**Power (High Priority)**
- Explosive triple extension (jump variations)
- Explosive pressing and pulling
- Reactive strength for catching

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

**Explosive Power (High Priority)**
- Vertical jump development
- Broad jump for distance entries
- Box-down jumps for landing prep
- Reactive jump training

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
- Moderate-heavy compound lifts
- Both pushing AND overhead stability
- Full-body strength development

**Core (Critical)**
- Complete core training (hollow, arch, anti-rotation)
- Must support both lifting and flying

**Power & Control**
- Explosive power for both roles
- Landing mechanics for flyer work
- Stability for base work

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
