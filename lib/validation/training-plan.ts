import { z } from 'zod';

/**
 * Zod schemas for Gemini training plan response validation
 * Used to validate and type the AI-generated content
 * 
 * Note: Using .nullish() instead of .optional() because Gemini
 * returns null for empty optional fields, not undefined
 */

export const exerciseSchema = z.object({
  name: z.string(),
  sets: z.string().nullish(),
  reps: z.string().nullish(),
  duration: z.string().nullish(),
  notes: z.string().nullish(),
});

export const sessionSchema = z.object({
  name: z.string(),
  focus: z.string(),
  warmup: z.array(exerciseSchema),
  main: z.array(exerciseSchema),
  accessory: z.array(exerciseSchema),
  cooldown: z.array(exerciseSchema),
});

export const weekPlanSchema = z.object({
  week: z.number(),
  theme: z.string(),
  sessions: z.array(sessionSchema),
});

export const profileSchema = z.object({
  role: z.string(),
  acrobaticsType: z.string(),
  acroStyleFocus: z.union([z.string(), z.array(z.string())]), // Can be string or array from Gemini
  level: z.string(),
  trainingDays: z.number(),
  setup: z.string(),
  limitations: z.string().nullish(),
});

export const trainingPlanSchema = z.object({
  title: z.string(),
  summary: z.string(),
  profile: profileSchema,
  weeklyPlan: z.array(weekPlanSchema).min(1),
  safetyNotes: z.array(z.string()),
  progressionRules: z.array(z.string()),
});

export type Exercise = z.infer<typeof exerciseSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type WeekPlan = z.infer<typeof weekPlanSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type TrainingPlanOutput = z.infer<typeof trainingPlanSchema>;
