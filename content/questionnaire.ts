/**
 * Questionnaire configuration and content
 * Centralized definitions for labels, options, and step structure
 */

export const ACROBATICS_TYPES = [
  { value: 'l-base', label: 'L-Base (lying down)', description: 'Partner acrobatics with the base lying on their back' },
  { value: 'standing', label: 'Standing', description: 'Partner acrobatics with the base standing' },
  { value: 'both', label: 'Both', description: 'Training for both L-Base and Standing' },
] as const;

export const USER_ROLES = [
  { value: 'base', label: 'Base', description: 'The person who supports and lifts' },
  { value: 'flyer', label: 'Flyer', description: 'The person who is lifted and balances' },
  { value: 'both', label: 'Both', description: 'Training for both roles' },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'New to partner acrobatics (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate', description: 'Comfortable with basics (1-3 years)' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced practitioner (3+ years)' },
] as const;

/**
 * Acro style focus - can select multiple
 * Influences the plan's emphasis on different training modalities
 */
export const ACRO_STYLE_OPTIONS = [
  {
    value: 'static',
    label: 'Static Poses',
    description: 'Holding shapes, balances, controlled transitions',
    icon: '🧘',
  },
  {
    value: 'dynamic',
    label: 'Dynamic Moves',
    description: 'Pops, throws, catches, explosive transitions',
    icon: '🚀',
  },
  {
    value: 'asymmetric',
    label: 'Asymmetric / Monos',
    description: 'One-arm, one-leg, and unilateral skills',
    icon: '🦩',
  },
] as const;

/**
 * Setup presets - what equipment/environment the user has access to
 * Constrains exercise selection in the generated plan
 */
export const SETUP_PRESETS = [
  {
    value: 'no-equipment',
    label: 'No equipment / at home',
    description: 'Bodyweight only, floor space',
    icon: '🏠',
  },
  {
    value: 'basic-home',
    label: 'Basic home setup',
    description: 'Dumbbells, kettlebell, or adjustable weights',
    icon: '🏋️',
  },
  {
    value: 'calisthenics-park',
    label: 'Calisthenics park access',
    description: 'Pull-up bars, dip bars, rings',
    icon: '🏞️',
  },
  {
    value: 'weighted-calisthenics',
    label: 'Weighted calisthenics',
    description: 'Belt + plates for loaded bodyweight',
    icon: '⚙️',
  },
  {
    value: 'gym-access',
    label: 'Gym access',
    description: 'Machines and free weights',
    icon: '🏢',
  },
  {
    value: 'barbell-available',
    label: 'Barbell available',
    description: 'Long bar, squat rack, bench',
    icon: '🔩',
  },
  {
    value: 'fully-stacked',
    label: 'Fully stacked gym',
    description: 'Everything: barbells, machines, cables, rings',
    icon: '🏆',
  },
] as const;

export const TRAINING_DAYS_OPTIONS = [
  { value: 1, label: '1 day' },
  { value: 2, label: '2 days' },
  { value: 3, label: '3 days' },
  { value: 4, label: '4 days' },
  { value: 5, label: '5 days' },
  { value: 6, label: '6 days' },
  { value: 7, label: '7 days' },
] as const;

/**
 * Questionnaire step definitions
 * Structure for the multi-step form flow
 */
export const QUESTIONNAIRE_STEPS = [
  {
    id: 'acrobatics-type',
    title: 'What type of acrobatics?',
    description: 'Tell us which style you want to focus on',
  },
  {
    id: 'role',
    title: 'What is your role?',
    description: 'Choose your primary role in partner acrobatics',
  },
  {
    id: 'level',
    title: 'Experience level',
    description: 'How long have you been practicing?',
  },
  {
    id: 'acro-style',
    title: 'What kind of acro?',
    description: 'Select all that apply to your training',
  },
  {
    id: 'schedule',
    title: 'Training schedule',
    description: 'How often can you train?',
  },
  {
    id: 'setup',
    title: 'Your setup',
    description: 'What equipment do you have access to?',
  },
  {
    id: 'limitations',
    title: 'Anything we should know?',
    description: 'Optional: injuries, limitations, or focus areas',
  },
  {
    id: 'email',
    title: 'Get your plan',
    description: 'Enter your email to receive your personalized training plan',
  },
] as const;
