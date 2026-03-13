import 'server-only';

import {
  EXERCISE_LIBRARY,
  type Exercise,
  type Difficulty,
  type EquipmentOption,
} from '@/content/exercise-library';
import type { SetupPreset, AcroStyleOption } from '@/lib/validation/questionnaire';

/**
 * Exercise filtering and prompt generation utilities
 * Server-only - used in plan generation
 */

/**
 * Filter options for exercise selection
 */
export interface ExerciseFilterOptions {
  role?: 'base' | 'flyer' | 'both';
  discipline?: 'l-base' | 'standing' | 'both';
  acroStyleFocus?: AcroStyleOption[];
  level?: Difficulty;
  setupPreset?: SetupPreset;
  purposeTags?: string[];
}

/**
 * Map setup preset to available equipment
 */
function getEquipmentFromSetup(preset: SetupPreset): EquipmentOption[] {
  const presetEquipment: Record<SetupPreset, EquipmentOption[]> = {
    'no-equipment': ['none'],
    'basic-home': ['none', 'dumbbells', 'kettlebell', 'resistance-bands'],
    'calisthenics-park': ['none', 'pull-up-bar', 'parallettes', 'resistance-bands'],
    'weighted-calisthenics': ['none', 'pull-up-bar', 'dip-belt', 'resistance-bands'],
    'gym-access': [
      'none',
      'dumbbells',
      'kettlebell',
      'pull-up-bar',
      'cable-machine',
      'resistance-bands',
      'bench',
      'box',
    ],
    'barbell-available': [
      'none',
      'dumbbells',
      'kettlebell',
      'barbell',
      'squat-rack',
      'bench',
      'pull-up-bar',
      'resistance-bands',
      'box',
    ],
    'fully-stacked': [
      'none',
      'dumbbells',
      'kettlebell',
      'barbell',
      'squat-rack',
      'bench',
      'pull-up-bar',
      'rings',
      'dip-belt',
      'cable-machine',
      'resistance-bands',
      'parallettes',
      'box',
    ],
  };
  return presetEquipment[preset] || ['none'];
}

/**
 * Map difficulty level to allowed difficulties
 */
function getAllowedDifficulties(level: Difficulty): Difficulty[] {
  switch (level) {
    case 'beginner':
      return ['beginner'];
    case 'intermediate':
      return ['beginner', 'intermediate'];
    case 'advanced':
      return ['beginner', 'intermediate', 'advanced'];
    default:
      return ['beginner', 'intermediate'];
  }
}

/**
 * Filter exercises based on user profile
 */
export function filterExercises(options: ExerciseFilterOptions): Exercise[] {
  let exercises = [...EXERCISE_LIBRARY];

  // Filter by role
  if (options.role && options.role !== 'both') {
    exercises = exercises.filter((ex) => ex.roles[options.role as 'base' | 'flyer']);
  }

  // Filter by discipline
  if (options.discipline && options.discipline !== 'both') {
    const discipline = options.discipline === 'l-base' ? 'lBase' : 'standing';
    exercises = exercises.filter((ex) => ex.disciplines[discipline]);
  }

  // Filter by acro style focus
  if (options.acroStyleFocus && options.acroStyleFocus.length > 0) {
    const hasStatic = options.acroStyleFocus.includes('static');
    const hasDynamic = options.acroStyleFocus.includes('dynamic');

    // Include exercises that match at least one selected style
    // or are appropriate for both (versatile exercises)
    exercises = exercises.filter((ex) => {
      if (hasStatic && hasDynamic) {
        // User trains both - include all exercises
        return true;
      }
      if (hasStatic && !hasDynamic) {
        // Static only - prefer static exercises, allow versatile ones
        return ex.acroStyleFocus.static;
      }
      if (hasDynamic && !hasStatic) {
        // Dynamic only - prefer dynamic exercises, allow versatile ones
        return ex.acroStyleFocus.dynamic;
      }
      return true;
    });
  }

  // Filter by difficulty
  if (options.level) {
    const allowedLevels = getAllowedDifficulties(options.level);
    exercises = exercises.filter((ex) => allowedLevels.includes(ex.difficulty));
  }

  // Filter by equipment
  if (options.setupPreset) {
    const availableEquipment = getEquipmentFromSetup(options.setupPreset);
    exercises = exercises.filter((ex) =>
      ex.equipment.some((eq) => availableEquipment.includes(eq))
    );
  }

  // Filter by purpose tags
  if (options.purposeTags && options.purposeTags.length > 0) {
    exercises = exercises.filter((ex) =>
      options.purposeTags!.some((tag) => ex.purposeTags.includes(tag as never))
    );
  }

  return exercises;
}

/**
 * Get exercises grouped by purpose/category
 */
export function groupExercisesByPurpose(
  exercises: Exercise[]
): Record<string, Exercise[]> {
  const groups: Record<string, Exercise[]> = {
    'Core & Body Tension': [],
    'Lower Body Strength': [],
    'Upper Body / Pressing': [],
    'Pulling & Grip': [],
    'Shoulder Health': [],
    'Wrist & Prehab': [],
    'Explosive / Power': [],
    'Unilateral / Asymmetric': [],
  };

  for (const ex of exercises) {
    // Categorize based on primary purpose tags
    if (
      ex.purposeTags.includes('explosive') ||
      ex.purposeTags.includes('plyometric')
    ) {
      groups['Explosive / Power'].push(ex);
    } else if (
      ex.purposeTags.includes('unilateral') ||
      ex.purposeTags.includes('asymmetry')
    ) {
      groups['Unilateral / Asymmetric'].push(ex);
    } else if (
      ex.purposeTags.includes('core') ||
      ex.purposeTags.includes('body-tension')
    ) {
      groups['Core & Body Tension'].push(ex);
    } else if (
      ex.purposeTags.includes('squat-pattern') ||
      ex.purposeTags.includes('hip-hinge') ||
      ex.purposeTags.includes('posterior-chain')
    ) {
      groups['Lower Body Strength'].push(ex);
    } else if (
      ex.purposeTags.includes('overhead-strength') ||
      ex.purposeTags.includes('pushing')
    ) {
      groups['Upper Body / Pressing'].push(ex);
    } else if (
      ex.purposeTags.includes('pulling') ||
      ex.purposeTags.includes('grip-strength')
    ) {
      groups['Pulling & Grip'].push(ex);
    } else if (
      ex.purposeTags.includes('rotator-cuff') ||
      ex.purposeTags.includes('shoulder-mobility')
    ) {
      groups['Shoulder Health'].push(ex);
    } else if (
      ex.purposeTags.includes('wrist-strength') ||
      ex.purposeTags.includes('wrist-mobility')
    ) {
      groups['Wrist & Prehab'].push(ex);
    }
  }

  // Remove empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([, exs]) => exs.length > 0)
  );
}

/**
 * Format a single exercise for prompt injection
 */
function formatExerciseForPrompt(ex: Exercise): string {
  const tags = ex.purposeTags.slice(0, 3).join(', ');
  const equipment = ex.equipment.join(' / ');
  const roleLabel =
    ex.roles.base && ex.roles.flyer
      ? 'Both'
      : ex.roles.base
        ? 'Base'
        : 'Flyer';

  return `- **${ex.name}** [${ex.difficulty}, ${roleLabel}]
  Purpose: ${tags}
  Equipment: ${equipment}
  ${ex.shortDescription}`;
}

/**
 * Generate a text block of preferred exercises for prompt injection
 */
export function getPreferredExercisesTextBlock(
  options: ExerciseFilterOptions
): string {
  const exercises = filterExercises(options);

  if (exercises.length === 0) {
    return 'No specific exercises from library match the user constraints. Use your expertise to select appropriate exercises.';
  }

  const grouped = groupExercisesByPurpose(exercises);

  let text = `## PREFERRED EXERCISES LIBRARY (use these when they fit the user constraints)

The following exercises are curated for partner acrobatics training. **Strongly prefer** these exercises when they match the user's equipment and goals. You may add additional exercises, but prioritize library choices for consistency and quality.

`;

  for (const [category, exs] of Object.entries(grouped)) {
    if (exs.length > 0) {
      text += `### ${category}\n\n`;
      for (const ex of exs) {
        text += formatExerciseForPrompt(ex) + '\n\n';
      }
    }
  }

  text += `---

**IMPORTANT RULES FOR EXERCISE SELECTION:**
1. If an exercise requires equipment the user doesn't have, DO NOT include it
2. When using library exercises, use the exact name for consistency
3. Include the coaching cues/notes where relevant in your prescription
4. You may suggest exercise progressions or regressions based on user level
5. For exercises not in this library, provide similar detail (purpose, sets/reps, why it matters)
`;

  return text;
}

/**
 * Extract all unique exercise names from a training plan (for deduplication)
 * Note: warmup is now body parts (strings), not exercises
 */
export function extractExerciseNamesFromPlan(plan: {
  weeklyPlan: Array<{
    sessions: Array<{
      warmup: string[];
      main: Array<{ name: string }>;
      skill?: Array<{ name: string }>;
    }>;
  }>;
}): string[] {
  const names = new Set<string>();

  for (const week of plan.weeklyPlan) {
    for (const session of week.sessions) {
      for (const ex of [...session.main, ...(session.skill || [])]) {
        names.add(ex.name);
      }
    }
  }

  return Array.from(names).sort();
}

/**
 * Look up exercises from the plan in the library
 * Returns: { found: Exercise[], notFound: string[] }
 */
export function matchPlanExercisesToLibrary(exerciseNames: string[]): {
  found: Array<{ name: string; exercise: Exercise }>;
  notFound: string[];
} {
  const found: Array<{ name: string; exercise: Exercise }> = [];
  const notFound: string[] = [];

  for (const name of exerciseNames) {
    const lowerName = name.toLowerCase();

    // Try exact match first
    let match = EXERCISE_LIBRARY.find(
      (ex) =>
        ex.name.toLowerCase() === lowerName ||
        ex.aliases?.some((a) => a.toLowerCase() === lowerName)
    );

    // Try partial match
    if (!match) {
      match = EXERCISE_LIBRARY.find(
        (ex) =>
          lowerName.includes(ex.name.toLowerCase()) ||
          ex.name.toLowerCase().includes(lowerName) ||
          ex.aliases?.some(
            (a) =>
              lowerName.includes(a.toLowerCase()) ||
              a.toLowerCase().includes(lowerName)
          )
      );
    }

    if (match) {
      found.push({ name, exercise: match });
    } else {
      notFound.push(name);
    }
  }

  return { found, notFound };
}

/**
 * Generate exercise explanation for email (returns HTML)
 */
export function generateExerciseExplanation(
  name: string,
  exercise: Exercise | null,
  userRole: 'base' | 'flyer' | 'both'
): { name: string; description: string; tags: string; roleNote?: string } {
  if (exercise) {
    const tags = exercise.purposeTags.slice(0, 3).join(', ');
    let roleNote: string | undefined;

    if (userRole === 'base' && exercise.roles.base && !exercise.roles.flyer) {
      roleNote = 'Essential for bases';
    } else if (userRole === 'flyer' && exercise.roles.flyer && !exercise.roles.base) {
      roleNote = 'Key for flyers';
    }

    return {
      name,
      description: exercise.shortDescription,
      tags,
      roleNote,
    };
  }

  return {
    name,
    description: 'A supporting exercise for your training. Focus on controlled movement and proper form.',
    tags: 'general',
  };
}
