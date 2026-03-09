/**
 * Exercise Library
 * 
 * A curated collection of exercises for partner acrobatics training.
 * This library is used in prompt generation to ensure consistent, quality exercise recommendations.
 * 
 * HOW TO ADD NEW EXERCISES:
 * 1. Add a new object to the EXERCISE_LIBRARY array below
 * 2. Use kebab-case for the id (e.g., 'goblet-squat')
 * 3. Fill in all required fields
 * 4. Optional: add aliases, coachingNotes
 * 
 * FIELD GUIDE:
 * - id: unique kebab-case identifier
 * - name: display name
 * - aliases: other names users might use
 * - shortDescription: 1-2 sentences explaining the exercise and its purpose
 * - purposeTags: what this exercise targets (see PURPOSE_TAGS below)
 * - roles: which acro roles benefit
 * - disciplines: which acro disciplines benefit
 * - acroStyleFocus: static vs dynamic training
 * - difficulty: beginner / intermediate / advanced
 * - equipment: array of equipment options (include 'none' for bodyweight)
 * - coachingNotes: cues, common mistakes, regressions (optional)
 */

export type PurposeTag =
  | 'wrist-strength'
  | 'wrist-mobility'
  | 'core'
  | 'core-anti-rotation'
  | 'posterior-chain'
  | 'squat-pattern'
  | 'hip-hinge'
  | 'overhead-strength'
  | 'overhead-stability'
  | 'shoulder-mobility'
  | 'explosive'
  | 'plyometric'
  | 'asymmetry'
  | 'unilateral'
  | 'landing'
  | 'grip-strength'
  | 'rotator-cuff'
  | 'hip-stability'
  | 'balance'
  | 'body-tension'
  | 'pushing'
  | 'pulling';

export type EquipmentOption =
  | 'none'
  | 'dumbbells'
  | 'kettlebell'
  | 'barbell'
  | 'pull-up-bar'
  | 'box'
  | 'rings'
  | 'dip-belt'
  | 'resistance-bands'
  | 'bench'
  | 'squat-rack'
  | 'cable-machine'
  | 'parallettes';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  aliases?: string[];
  shortDescription: string;
  purposeTags: PurposeTag[];
  roles: { base: boolean; flyer: boolean };
  disciplines: { lBase: boolean; standing: boolean };
  acroStyleFocus: { static: boolean; dynamic: boolean };
  difficulty: Difficulty;
  equipment: EquipmentOption[];
  coachingNotes?: string[];
}

/**
 * The Exercise Library
 * Add new exercises here following the structure above
 */
export const EXERCISE_LIBRARY: Exercise[] = [
  // ═══════════════════════════════════════════════════════════════
  // SHARED EXERCISES (Base + Flyer, L-Base + Standing)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'wrist-push-ups',
    name: 'Wrist Push-Ups',
    aliases: ['knuckle push-ups', 'wrist strengthening push-ups'],
    shortDescription:
      'Push-ups performed on the backs of the hands or with wrist extensions. Essential for wrist conditioning that protects against common acro injuries from basing and handstands.',
    purposeTags: ['wrist-strength', 'wrist-mobility', 'pushing'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['none'],
    coachingNotes: [
      'Start on knees if full push-ups are too intense',
      'Progress from back-of-hand position to knuckles to full wrist extension',
      'Stop immediately if sharp pain occurs — distinguish from stretch discomfort',
      'Do 2-3 sets of 8-12 reps as part of warmup or prehab',
    ],
  },

  {
    id: 'wrist-circles',
    name: 'Wrist Circles & Rotations',
    aliases: ['wrist mobility', 'wrist warmup'],
    shortDescription:
      'Controlled circular movements of the wrists in both directions. Fundamental warmup and prehab for all acro practitioners to maintain joint health.',
    purposeTags: ['wrist-mobility', 'wrist-strength'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['none'],
    coachingNotes: [
      'Perform 10-15 circles in each direction',
      'Include with fingers interlaced for deeper mobilization',
      'Add pressure variations (palms together, prayer stretch)',
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // BASE EXERCISES (Standing + L-Base)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'barbell-deadlift',
    name: 'Barbell Deadlift',
    aliases: ['conventional deadlift', 'deadlifts'],
    shortDescription:
      'The king of posterior chain exercises. Builds the hip and back strength bases need for lifting flyers safely and generating power in standing acro.',
    purposeTags: ['posterior-chain', 'hip-hinge', 'grip-strength', 'core'],
    roles: { base: true, flyer: false },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'intermediate',
    equipment: ['barbell'],
    coachingNotes: [
      'Keep the bar close to your body throughout the lift',
      'Brace your core hard before initiating the pull',
      'Think "push the floor away" rather than "pull the bar up"',
      'Neutral spine is non-negotiable — stop before form breaks down',
      'For acro transfer: practice explosive hip extension at the top',
    ],
  },

  {
    id: 'dumbbell-deadlift',
    name: 'Dumbbell Romanian Deadlift',
    aliases: ['dumbbell RDL', 'DB deadlift'],
    shortDescription:
      'A deadlift variation using dumbbells with emphasis on the eccentric (lowering) phase. Great for hamstring and glute development when barbells are unavailable.',
    purposeTags: ['posterior-chain', 'hip-hinge', 'balance'],
    roles: { base: true, flyer: false },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: false },
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    coachingNotes: [
      'Keep knees slightly bent throughout — this is not a stiff-leg deadlift',
      'Feel the stretch in your hamstrings at the bottom',
      'Squeeze glutes hard at the top',
      'Dumbbells at sides or in front both work',
    ],
  },

  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    aliases: ['back squat', 'squats'],
    shortDescription:
      'The foundational lower body strength exercise. Critical for bases to develop the leg drive needed for lifting, catching, and maintaining stable positions.',
    purposeTags: ['squat-pattern', 'core', 'hip-stability'],
    roles: { base: true, flyer: false },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'intermediate',
    equipment: ['barbell', 'squat-rack'],
    coachingNotes: [
      'Aim for at least parallel depth — thighs parallel to floor',
      'Keep weight centered over mid-foot, not toes',
      'Brace core like someone is about to punch you',
      'Knees track over toes — some forward travel is fine',
      'For standing acro: practice paused squats to build base stability',
    ],
  },

  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    aliases: ['kettlebell squat', 'dumbbell squat'],
    shortDescription:
      'A front-loaded squat using a dumbbell or kettlebell held at chest height. Excellent for learning squat mechanics and building leg strength without a barbell.',
    purposeTags: ['squat-pattern', 'core', 'hip-stability'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: false },
    difficulty: 'beginner',
    equipment: ['dumbbells', 'kettlebell'],
    coachingNotes: [
      'Hold weight close to chest throughout',
      'Use elbows to push knees out at the bottom',
      'Great for grooving squat pattern before barbell work',
      'Can pause at bottom to build position strength',
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // BASE EXERCISES (Standing only)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'dumbbell-overhead-press',
    name: 'Dumbbell Overhead Press',
    aliases: ['DB shoulder press', 'dumbbell press'],
    shortDescription:
      'Pressing dumbbells from shoulders to overhead. Builds the pressing strength bases need for lifting flyers overhead while allowing natural shoulder movement.',
    purposeTags: ['overhead-strength', 'overhead-stability', 'shoulder-mobility'],
    roles: { base: true, flyer: false },
    disciplines: { lBase: false, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['dumbbells'],
    coachingNotes: [
      'Keep core tight — no excessive back arch',
      'Press slightly in front of face, then back overhead',
      'Full lockout at top with active shoulders',
      'Control the descent — this is where shoulders get strongest',
    ],
  },

  {
    id: 'barbell-overhead-press',
    name: 'Barbell Overhead Press',
    aliases: ['military press', 'strict press', 'OHP'],
    shortDescription:
      'The standard overhead pressing movement with a barbell. Builds raw overhead strength for throwing and catching flyers in standing acro.',
    purposeTags: ['overhead-strength', 'overhead-stability', 'core'],
    roles: { base: true, flyer: false },
    disciplines: { lBase: false, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'intermediate',
    equipment: ['barbell'],
    coachingNotes: [
      'Start with bar at collarbone level',
      'Move head back slightly as bar passes, then forward once overhead',
      'Lock out completely with bar over mid-foot',
      'Squeeze glutes throughout to protect lower back',
      'For acro transfer: practice push press for explosive power',
    ],
  },

  {
    id: 'offset-barbell-press',
    name: 'Offset Grip Barbell Press',
    aliases: ['one-arm barbell press', 'asymmetric barbell press'],
    shortDescription:
      'Overhead press holding a barbell at its center with one hand, creating asymmetric load. Builds the anti-rotation core strength and single-arm pressing power needed for one-arm catches.',
    purposeTags: ['overhead-strength', 'core-anti-rotation', 'asymmetry', 'grip-strength'],
    roles: { base: true, flyer: false },
    disciplines: { lBase: false, standing: true },
    acroStyleFocus: { static: false, dynamic: true },
    difficulty: 'advanced',
    equipment: ['barbell'],
    coachingNotes: [
      'Start light — the leverage makes this much harder than it looks',
      'Keep hips and shoulders square throughout',
      'Core must resist rotation — that is the point',
      'Great preparation for one-arm catches and asymmetric lifting',
      'Progress: empty bar → add weight to one side only',
    ],
  },

  {
    id: 'push-press',
    name: 'Push Press',
    aliases: ['leg drive press'],
    shortDescription:
      'Overhead press with leg drive initiation. Trains explosive power transfer from legs to arms — exactly what bases need for throwing flyers.',
    purposeTags: ['overhead-strength', 'explosive', 'squat-pattern'],
    roles: { base: true, flyer: false },
    disciplines: { lBase: false, standing: true },
    acroStyleFocus: { static: false, dynamic: true },
    difficulty: 'intermediate',
    equipment: ['barbell', 'dumbbells'],
    coachingNotes: [
      'Dip with knees, not hips',
      'Drive explosively — the legs start the weight, arms finish',
      'Time it so bar leaves shoulders as legs extend fully',
      'Direct transfer to throwing mechanics in standing acro',
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // FLYER EXERCISES (L-Base + Standing)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'l-sit-finger-shift',
    name: 'L-Sit with Forward Finger Shift',
    aliases: ['L-sit finger walk', 'L-sit weight shift', 'finger shift L-sit'],
    shortDescription:
      'An L-sit hold with deliberate weight shift forward onto the fingers. Builds the finger and wrist strength flyers need for hand-to-hand and handstand work.',
    purposeTags: ['wrist-strength', 'core', 'body-tension', 'grip-strength'],
    roles: { base: false, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: false },
    difficulty: 'intermediate',
    equipment: ['none', 'parallettes'],
    coachingNotes: [
      'Start in solid L-sit with straight arms',
      'Slowly shift weight forward until fingertips bear most of the load',
      'Hold for 3-5 seconds, then shift back',
      'Builds toward planche lean and hand-to-hand positions',
      'If wrists hurt: work on basic L-sit first',
    ],
  },

  {
    id: 'box-jumps',
    name: 'Box Jumps',
    aliases: ['jump to box', 'plyometric box jump'],
    shortDescription:
      'Explosive jumps onto a raised platform. Develops the reactive power flyers need for pops, whips, and explosive transitions.',
    purposeTags: ['explosive', 'plyometric', 'squat-pattern', 'landing'],
    roles: { base: false, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: false, dynamic: true },
    difficulty: 'beginner',
    equipment: ['box'],
    coachingNotes: [
      'Land softly with bent knees — quiet landings are safe landings',
      'Step down rather than jump down to preserve knees',
      'Start with lower box and progress height gradually',
      'For acro: focus on maximum height with quiet landing',
      'Can progress to single-leg variations for asymmetric training',
    ],
  },

  {
    id: 'depth-jumps',
    name: 'Depth Jumps (Box-Down)',
    aliases: ['drop jumps', 'reactive jumps', 'box-down jumps'],
    shortDescription:
      'Stepping off a box and immediately jumping upon landing. Trains reactive strength and proper landing mechanics crucial for flyer safety.',
    purposeTags: ['explosive', 'plyometric', 'landing'],
    roles: { base: false, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: false, dynamic: true },
    difficulty: 'intermediate',
    equipment: ['box'],
    coachingNotes: [
      'Start with LOW box (20-30cm) — this is intense on joints',
      'Contact time should be minimal — "hot ground"',
      'Land on balls of feet, knees slightly bent',
      'Critical for training safe landing reflexes in acro',
      'STOP if you feel knee or ankle discomfort',
    ],
  },

  {
    id: 'pistol-squat',
    name: 'Pistol Squat',
    aliases: ['single-leg squat', 'one-leg squat'],
    shortDescription:
      'A full depth single-leg squat with the other leg extended forward. Builds unilateral leg strength and balance needed for asymmetric acro positions.',
    purposeTags: ['squat-pattern', 'unilateral', 'asymmetry', 'balance', 'hip-stability'],
    roles: { base: false, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: false },
    difficulty: 'advanced',
    equipment: ['none'],
    coachingNotes: [
      'Regression: pistol to box or assisted pistol holding something',
      'Keep heel down throughout — ankle mobility is often the limiter',
      'Control the descent — no plopping down',
      'Essential for mono skills and asymmetric shapes',
      'Address left/right imbalances — most people have one',
    ],
  },

  {
    id: 'shrimp-squat',
    name: 'Shrimp Squat',
    aliases: ['skater squat'],
    shortDescription:
      'Single-leg squat with the rear leg held behind, knee touching ground. Complements pistol squats with different balance demands.',
    purposeTags: ['squat-pattern', 'unilateral', 'asymmetry', 'balance'],
    roles: { base: false, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: false },
    difficulty: 'intermediate',
    equipment: ['none'],
    coachingNotes: [
      'Touch rear knee to ground gently — no slamming',
      'Keep torso more upright than pistol squat',
      'Easier on ankle mobility than pistols',
      'Good stepping stone to full pistol squats',
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CORE & BODY TENSION (Both roles)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    aliases: ['hollow hold', 'dish hold'],
    shortDescription:
      'The foundational gymnastics core position with lower back pressed to floor. Essential for flyers to maintain body tension and for bases to understand flyer shapes.',
    purposeTags: ['core', 'body-tension'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['none'],
    coachingNotes: [
      'Lower back MUST stay glued to floor — no gap',
      'Progressions: bent knees → straight legs → arms overhead',
      'Squeeze everything — legs, glutes, abs, arms',
      'Build to 60-second holds before progressing',
      'This is THE core exercise for acro body tension',
    ],
  },

  {
    id: 'arch-body-hold',
    name: 'Arch Body Hold',
    aliases: ['superman hold', 'arch hold'],
    shortDescription:
      'The opposite of hollow body — back extension with arms and legs lifted. Builds posterior chain engagement and back strength for both roles.',
    purposeTags: ['core', 'posterior-chain', 'body-tension'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['none'],
    coachingNotes: [
      'Lift arms AND legs simultaneously',
      'Keep neck neutral — look at floor, not forward',
      'Squeeze glutes hard',
      'Pairs with hollow body — train both every session',
    ],
  },

  {
    id: 'pallof-press',
    name: 'Pallof Press',
    aliases: ['anti-rotation press', 'core press'],
    shortDescription:
      'A cable or band exercise pressing away from the body while resisting rotation. Builds the anti-rotation core strength critical for bases catching off-center.',
    purposeTags: ['core', 'core-anti-rotation'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['cable-machine', 'resistance-bands'],
    coachingNotes: [
      'Stand sideways to anchor point',
      'Press straight out — resist the pull to rotate',
      'Keep hips and shoulders square throughout',
      'Essential for bases handling asymmetric loads',
      'Progress: further from anchor → more resistance',
    ],
  },

  {
    id: 'dead-bug',
    name: 'Dead Bug',
    aliases: ['contralateral limb extension'],
    shortDescription:
      'Lying on back, alternating opposite arm/leg extensions while maintaining hollow position. Teaches core control during limb movement — directly transfers to acro.',
    purposeTags: ['core', 'core-anti-rotation', 'body-tension'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['none'],
    coachingNotes: [
      'Lower back stays FLAT on floor throughout',
      'Move slowly with control — not a race',
      'Exhale as you extend, maintaining pressure on floor',
      'Progress: add resistance band or weights',
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // SHOULDER HEALTH & MOBILITY (Primarily Flyer)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'shoulder-cars',
    name: 'Shoulder CARs',
    aliases: ['controlled articular rotations', 'shoulder circles'],
    shortDescription:
      'Slow, controlled full circles of the shoulder joint through maximum range. Essential mobility maintenance for the overhead demands of acro.',
    purposeTags: ['shoulder-mobility', 'rotator-cuff'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['none'],
    coachingNotes: [
      'Move as slowly as possible — 30+ seconds per circle',
      'Maximize the circle size without body compensation',
      'Keep rest of body completely still',
      'Do daily as mobility maintenance',
    ],
  },

  {
    id: 'band-pull-aparts',
    name: 'Band Pull-Aparts',
    aliases: ['rear delt pulls', 'band face pulls'],
    shortDescription:
      'Pulling a resistance band apart at chest height. Simple but effective rotator cuff and rear deltoid strengthening for shoulder health.',
    purposeTags: ['rotator-cuff', 'shoulder-mobility', 'pulling'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['resistance-bands'],
    coachingNotes: [
      'Keep arms straight or slightly bent throughout',
      'Squeeze shoulder blades together at end range',
      'Control the return — do not snap back',
      'High reps (15-25) work best for prehab',
    ],
  },

  {
    id: 'cuban-rotation',
    name: 'Cuban Rotation',
    aliases: ['external rotation', 'scarecrow rotation'],
    shortDescription:
      'External rotation at the shoulder from a 90/90 position. Strengthens the rotator cuff in the exact positions used during overhead acro.',
    purposeTags: ['rotator-cuff', 'shoulder-mobility', 'overhead-stability'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['dumbbells', 'resistance-bands'],
    coachingNotes: [
      'Start LIGHT — rotator cuff muscles are small',
      'Upper arm stays fixed, only forearm rotates',
      'Control throughout — no momentum',
      'Do 12-15 reps per arm as prehab',
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GRIP & PULLING (Both roles)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    aliases: ['chin-ups', 'bar pull-ups'],
    shortDescription:
      'The fundamental upper body pulling exercise. Builds lat and grip strength for bases, and pulling power for flyers in inversions.',
    purposeTags: ['pulling', 'grip-strength', 'core'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'intermediate',
    equipment: ['pull-up-bar'],
    coachingNotes: [
      'Full range: dead hang to chin over bar',
      'Initiate with scapular pull (shoulders down)',
      'Regression: band-assisted or negative-only',
      'Vary grip width and hand position for balance',
    ],
  },

  {
    id: 'archer-pull-ups',
    name: 'Archer Pull-Ups',
    aliases: ['asymmetric pull-ups', 'one-arm pull-up progression'],
    shortDescription:
      'Pull-up with one arm doing most of the work while the other assists. Builds toward one-arm pulling strength for asymmetric acro.',
    purposeTags: ['pulling', 'grip-strength', 'asymmetry', 'unilateral'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: false },
    difficulty: 'advanced',
    equipment: ['pull-up-bar'],
    coachingNotes: [
      'One arm pulls, other arm extends to the side',
      'The extended arm assists but does minimal work',
      'Progression toward one-arm pull-ups',
      'Address left/right strength imbalances',
    ],
  },

  {
    id: 'dead-hang',
    name: 'Dead Hang',
    aliases: ['passive hang', 'bar hang'],
    shortDescription:
      'Simply hanging from a bar with relaxed shoulders. Decompresses the spine and builds grip endurance needed for extended acro sessions.',
    purposeTags: ['grip-strength', 'shoulder-mobility'],
    roles: { base: true, flyer: true },
    disciplines: { lBase: true, standing: true },
    acroStyleFocus: { static: true, dynamic: true },
    difficulty: 'beginner',
    equipment: ['pull-up-bar'],
    coachingNotes: [
      'Let shoulders rise to ears — fully passive',
      'Build toward 60-90 second holds',
      'Great for decompression after heavy lifting',
      'Variation: active hang with shoulders pulled down',
    ],
  },
];

/**
 * Get all unique purpose tags from the library
 */
export function getAllPurposeTags(): PurposeTag[] {
  const tags = new Set<PurposeTag>();
  EXERCISE_LIBRARY.forEach((ex) => ex.purposeTags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

/**
 * Get all unique equipment options from the library
 */
export function getAllEquipment(): EquipmentOption[] {
  const equipment = new Set<EquipmentOption>();
  EXERCISE_LIBRARY.forEach((ex) => ex.equipment.forEach((eq) => equipment.add(eq)));
  return Array.from(equipment).sort();
}

/**
 * Find an exercise by ID or name (case-insensitive)
 */
export function findExercise(query: string): Exercise | undefined {
  const lowerQuery = query.toLowerCase();
  return EXERCISE_LIBRARY.find(
    (ex) =>
      ex.id === lowerQuery ||
      ex.name.toLowerCase() === lowerQuery ||
      ex.aliases?.some((alias) => alias.toLowerCase() === lowerQuery)
  );
}

/**
 * Find exercises by fuzzy name match
 */
export function findExercisesByNameFuzzy(query: string): Exercise[] {
  const lowerQuery = query.toLowerCase();
  return EXERCISE_LIBRARY.filter(
    (ex) =>
      ex.name.toLowerCase().includes(lowerQuery) ||
      ex.aliases?.some((alias) => alias.toLowerCase().includes(lowerQuery))
  );
}
