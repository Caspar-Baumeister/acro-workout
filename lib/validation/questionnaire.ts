import { z } from 'zod';

/**
 * Zod schemas for questionnaire validation
 * Used for server-side validation of form submissions
 */

export const acrobaticsTypeSchema = z.enum(['l-base', 'standing', 'both']);
export const userRoleSchema = z.enum(['base', 'flyer', 'both']);
export const experienceLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const trainingDaysSchema = z.number().int().min(1).max(7);

// Acro style focus options (can select multiple)
export const acroStyleOptionSchema = z.enum(['static', 'dynamic', 'asymmetric']);
export const acroStyleFocusSchema = z.array(acroStyleOptionSchema).min(1, 'Please select at least one acro style');

// New: Setup presets (replaces equipment list)
export const setupPresetSchema = z.enum([
  'no-equipment',
  'basic-home',
  'calisthenics-park',
  'weighted-calisthenics',
  'gym-access',
  'barbell-available',
  'fully-stacked',
]);

export const questionnaireSchema = z.object({
  acrobaticsType: acrobaticsTypeSchema,
  role: userRoleSchema,
  level: experienceLevelSchema,
  acroStyleFocus: acroStyleFocusSchema,
  trainingDays: trainingDaysSchema,
  // New setup fields (replaces equipment array)
  setupPreset: setupPresetSchema,
  setupNotes: z.string().optional(),
  // Existing optional fields
  limitations: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  acceptedTerms: z.literal(true, 'You must accept the terms to continue'),
  // Marketing & interest fields
  interestedInCoaching: z.boolean().optional().default(false),
  interestedInWorkshops: z.boolean().optional().default(false),
  interestedInNewsletter: z.boolean().optional().default(false),
});

export const generatePlanRequestSchema = z.object({
  questionnaire: questionnaireSchema,
});

// Infer types from schemas
export type AcroStyleOption = z.infer<typeof acroStyleOptionSchema>;
export type AcroStyleFocus = z.infer<typeof acroStyleFocusSchema>; // Array of options
export type SetupPreset = z.infer<typeof setupPresetSchema>;
export type QuestionnaireInput = z.infer<typeof questionnaireSchema>;
export type GeneratePlanRequestInput = z.infer<typeof generatePlanRequestSchema>;
