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

export const TRAINING_GOALS = [
  { value: 'strength', label: 'Build Strength' },
  { value: 'flexibility', label: 'Improve Flexibility' },
  { value: 'balance', label: 'Better Balance' },
  { value: 'new-skills', label: 'Learn New Skills' },
  { value: 'consistency', label: 'Train More Consistently' },
  { value: 'conditioning', label: 'General Conditioning' },
] as const;

export const EQUIPMENT_OPTIONS = [
  { value: 'mat', label: 'Yoga Mat' },
  { value: 'blocks', label: 'Yoga Blocks' },
  { value: 'resistance-bands', label: 'Resistance Bands' },
  { value: 'pull-up-bar', label: 'Pull-Up Bar' },
  { value: 'gymnastics-rings', label: 'Gymnastics Rings' },
  { value: 'parallettes', label: 'Parallettes' },
  { value: 'none', label: 'No Equipment' },
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
    id: 'goals',
    title: 'Training goals',
    description: 'What do you want to achieve?',
  },
  {
    id: 'schedule',
    title: 'Training schedule',
    description: 'How often can you train?',
  },
  {
    id: 'equipment',
    title: 'Available equipment',
    description: 'What do you have access to?',
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
