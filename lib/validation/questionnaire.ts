import { z } from 'zod';

/**
 * Zod schemas for questionnaire validation
 * Used for server-side validation of form submissions
 */

export const acrobaticsTypeSchema = z.enum(['l-base', 'standing', 'both']);
export const userRoleSchema = z.enum(['base', 'flyer', 'both']);
export const experienceLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const trainingDaysSchema = z.number().int().min(1).max(7);

export const questionnaireSchema = z.object({
  acrobaticsType: acrobaticsTypeSchema,
  role: userRoleSchema,
  level: experienceLevelSchema,
  goals: z.array(z.string().min(1)).min(1, 'Please select at least one goal'),
  trainingDays: trainingDaysSchema,
  equipment: z.array(z.string()),
  limitations: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  acceptedTerms: z.literal(true, 'You must accept the terms to continue'),
});

export const generatePlanRequestSchema = z.object({
  questionnaire: questionnaireSchema,
});

// Infer types from schemas
export type QuestionnaireInput = z.infer<typeof questionnaireSchema>;
export type GeneratePlanRequestInput = z.infer<typeof generatePlanRequestSchema>;
