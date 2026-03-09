/**
 * Training Philosophy Content
 * 
 * This file contains the core training philosophy that:
 * 1. Gets injected into the Gemini prompt for plan generation
 * 2. Gets displayed on the landing page
 * 
 * The philosophy emphasizes that acro reveals weaknesses but doesn't build
 * the strength/mobility needed - supplemental training does.
 */

export const trainingPhilosophy = {
  /**
   * Short summary for landing page hero/intro
   */
  summary: `You don't build the muscles you need for acro by only doing acro. Acro reveals your weaknesses and gives you the motivation to improve—but it's supplemental training that builds the strength, mobility, and resilience you need to progress safely.`,

  /**
   * Core philosophy explanation
   */
  corePhilosophy: `Partner acrobatics is beautiful, playful, and deeply rewarding—but training acro alone is often one-sided and can lead to overuse injuries. The truth is: acro shows you where you're weak. It doesn't fix those weaknesses.

A tailored strength, mobility, and prehab program designed around your acro practice is the healthiest, most sustainable approach. It's how you build the foundation to progress faster, stay injury-free, and keep playing for years to come.

This isn't about becoming a gym rat or bodybuilder. It's about targeted work that directly supports your acro goals—whether you're a base building the strength to lift with control, or a flyer developing the core stability and mobility to hit shapes with confidence.`,

  /**
   * Base-specific training priorities
   */
  basePriorities: {
    title: 'Base Training Priorities',
    description: 'Bases need raw strength, stability, and the body-mind connection to lift, catch, and protect their flyer.',
    priorities: [
      {
        name: 'Strength (Low Reps, High Intensity)',
        description: 'Build the raw power to lift and throw—especially quads, glutes, and shoulders. Think heavy squats, deadlifts, and pressing movements.',
        importance: 'critical',
      },
      {
        name: 'Explosive Power',
        description: 'Develop fast-twitch muscle for dynamic moves. Explosive leg and shoulder work translates directly to pops, throws, and catches.',
        importance: 'high',
      },
      {
        name: 'Core & Lower Body Fortress',
        description: 'An incredibly strong core and lower body is non-negotiable for both L-base and standing acro. This is your foundation.',
        importance: 'critical',
      },
      {
        name: 'Balance & Body-Mind Connection',
        description: 'Train reflexes and proprioception. Quick reactions prevent injuries and make you a more reliable partner.',
        importance: 'high',
      },
      {
        name: 'Upper Body & Hip Flexibility',
        description: 'Shoulder mobility for comfortable hand-to-hand and overhead positions. Hip mobility for deep stances and L-base.',
        importance: 'medium',
      },
    ],
  },

  /**
   * Flyer-specific training priorities
   */
  flyerPriorities: {
    title: 'Flyer Training Priorities',
    description: 'Flyers need mobility, core control, and explosive power—without unnecessary bulk that makes you harder to lift.',
    priorities: [
      {
        name: 'Shoulder Mobility & Strength in Flexion',
        description: 'Full overhead range with control. Essential for handstands, shoulder stands, and all overhead shapes.',
        importance: 'critical',
      },
      {
        name: 'Extreme Core Strength',
        description: 'Not just abs—deep stabilizers, obliques, and the entire trunk. This is what holds shapes and creates beautiful lines.',
        importance: 'critical',
      },
      {
        name: 'Explosive Jumping Power',
        description: 'Train explosive jumps for dynamic entries and exits. Power comes from technique and neuromuscular efficiency, not size.',
        importance: 'high',
      },
      {
        name: 'Stay Lean & Functional',
        description: 'Avoid bodybuilding-style hypertrophy, especially upper body. Build effective strength through quality movement, not bulk.',
        importance: 'high',
      },
      {
        name: 'Lower Body Explosiveness',
        description: 'Glutes and quads should be strong and explosive. Focus on power output, not muscle size.',
        importance: 'medium',
      },
    ],
  },

  /**
   * Safety & prehab priorities for both roles
   */
  safetyPriorities: {
    title: 'Safety & Injury Prevention',
    description: 'Prehab work keeps you training consistently. These areas break down first if neglected.',
    base: [
      {
        area: 'Lower Back & Core Integration',
        description: 'A strong, stable lower back that works seamlessly with your core. Essential for all lifting.',
      },
      {
        area: 'Wrist Strength & Mobility',
        description: 'Wrists take constant load in acro. Build strength in all ranges to prevent strain.',
      },
      {
        area: 'Rotator Cuff Health',
        description: 'Strong, stable shoulders prevent the most common acro injuries. Train external rotation and scapular control.',
      },
      {
        area: 'Hip Stability & Mobility',
        description: 'Stable hips in deep ranges. Clean squat patterns protect knees and lower back.',
      },
    ],
    flyer: [
      {
        area: 'Core & Lower Back Integration',
        description: 'Deep core stability protects your spine during shapes and transitions.',
      },
      {
        area: 'Wrist Conditioning',
        description: 'Prepare wrists for handstands and hand-to-hand work with progressive loading.',
      },
      {
        area: 'Rotator Cuff & Shoulder Stability',
        description: 'Bulletproof shoulders for overhead positions and catching yourself.',
      },
      {
        area: 'Landing Mechanics & Ankle Stability',
        description: 'Box-down jumps, falling drills, and ankle stability work. Protect your knees, feet, and ankles.',
      },
    ],
  },

  /**
   * Key principles for prompt injection
   */
  promptPrinciples: [
    'This is SUPPLEMENTAL training to support acro practice, not a replacement for it.',
    'Focus on functional strength, not bodybuilding aesthetics.',
    'Prioritize injury prevention and longevity over short-term gains.',
    'Include specific prehab work for wrists, shoulders, and core every session.',
    'Bases need raw strength; flyers need mobility and control.',
    'Avoid generic motivational content—be specific and practical.',
    'Every exercise should have a clear "why this matters for acro" connection.',
    'Progress should be measurable and sustainable.',
  ],
} as const;

/**
 * Format philosophy for prompt injection
 * This creates a structured text block for the Gemini prompt
 */
export function formatPhilosophyForPrompt(): string {
  const p = trainingPhilosophy;
  
  return `
## TRAINING PHILOSOPHY — MUST FOLLOW

### Core Philosophy
${p.corePhilosophy}

### Key Principles (STRICTLY FOLLOW)
${p.promptPrinciples.map((principle, i) => `${i + 1}. ${principle}`).join('\n')}

### Base Training Priorities
${p.basePriorities.priorities.map(pr => `- **${pr.name}** (${pr.importance}): ${pr.description}`).join('\n')}

### Flyer Training Priorities
${p.flyerPriorities.priorities.map(pr => `- **${pr.name}** (${pr.importance}): ${pr.description}`).join('\n')}

### Safety & Prehab Requirements (INCLUDE IN EVERY PLAN)

For Bases:
${p.safetyPriorities.base.map(s => `- ${s.area}: ${s.description}`).join('\n')}

For Flyers:
${p.safetyPriorities.flyer.map(s => `- ${s.area}: ${s.description}`).join('\n')}

### IMPORTANT CONSTRAINTS
- This is SUPPLEMENTAL training designed to support acro practice
- Do NOT create a bodybuilding or hypertrophy-focused program
- Flyers should NOT bulk up, especially upper body
- Include explicit prehab/injury prevention exercises in EVERY session
- Be specific with sets, reps, tempo, and rest periods
- Explain WHY each exercise matters for acro performance
- Structure progressions clearly across the 4 weeks
`.trim();
}

export type TrainingPhilosophy = typeof trainingPhilosophy;
