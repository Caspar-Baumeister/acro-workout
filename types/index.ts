/**
 * Core types for the Acro Workout app
 */

// Re-export Zod-inferred types as the source of truth
export type { QuestionnaireInput } from '@/lib/validation/questionnaire';
export type {
  TrainingPlanOutput,
  Exercise,
  Session,
  WeekPlan,
  Profile,
} from '@/lib/validation/training-plan';

// Basic enum types
export type AcrobaticsType = 'l-base' | 'standing' | 'both';
export type UserRole = 'base' | 'flyer' | 'both';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type TrainingDays = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// API Response types
export interface ApiSuccessResponse {
  ok: true;
}

export interface ApiErrorResponse {
  ok: false;
  code: string;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Legacy types (kept for compatibility during transition)
export interface TrainingPlan {
  profileSummary: string;
  trainingFocus: string;
  warmUp: string[];
  mainDrills: string[];
  accessoryWork: string[];
  weeklyStructure: string;
  safetyNotes: string[];
}
