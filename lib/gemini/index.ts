import 'server-only';

import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai';
import { trainingPlanSchema, type TrainingPlanOutput } from '@/lib/validation/training-plan';
import type { QuestionnaireInput } from '@/lib/validation/questionnaire';

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
    title: { type: SchemaType.STRING, description: 'Title of the training plan' },
    summary: { type: SchemaType.STRING, description: 'Brief summary of the plan' },
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
          theme: { type: SchemaType.STRING },
          sessions: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING },
                focus: { type: SchemaType.STRING },
                warmup: {
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
                main: {
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
    safetyNotes: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    progressionRules: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: ['title', 'summary', 'profile', 'weeklyPlan', 'safetyNotes', 'progressionRules'],
};

/**
 * Build the prompt for training plan generation
 */
function buildPrompt(data: QuestionnaireInput): string {
  const roleDescriptions: Record<string, string> = {
    base: 'base (the person who supports and lifts)',
    flyer: 'flyer (the person who is lifted and balances)',
    both: 'both base and flyer roles',
  };

  const typeDescriptions: Record<string, string> = {
    'l-base': 'L-Base (lying down) partner acrobatics',
    standing: 'Standing partner acrobatics',
    both: 'both L-Base and Standing partner acrobatics',
  };

  const levelDescriptions: Record<string, string> = {
    beginner: 'beginner (0-1 years experience)',
    intermediate: 'intermediate (1-3 years experience)',
    advanced: 'advanced (3+ years experience)',
  };

  return `You are an expert partner acrobatics coach. Create a comprehensive, personalized training plan.

## User Profile
- Role: ${roleDescriptions[data.role] || data.role}
- Acrobatics Type: ${typeDescriptions[data.acrobaticsType] || data.acrobaticsType}
- Experience Level: ${levelDescriptions[data.level] || data.level}
- Training Days Per Week: ${data.trainingDays}
- Goals: ${data.goals.join(', ')}
- Available Equipment: ${data.equipment.length > 0 ? data.equipment.join(', ') : 'Bodyweight only'}
${data.limitations ? `- Limitations/Notes: ${data.limitations}` : ''}

## Requirements
Create a detailed 4-week training plan that:
1. Is appropriate for their ${data.level} experience level
2. Focuses on their specific role (${data.role}) and acrobatics type (${data.acrobaticsType})
3. Has ${data.trainingDays} training sessions per week
4. Addresses their goals: ${data.goals.join(', ')}
5. Uses only their available equipment
${data.limitations ? `6. Accounts for: ${data.limitations}` : ''}

## Session Structure
Each session should include:
- Warmup (5-10 min): Joint mobility, activation exercises
- Main Work (20-30 min): Skill-specific drills and progressions
- Accessory (10-15 min): Strength and conditioning
- Cooldown (5-10 min): Stretching and recovery

## Important Guidelines
- Be specific with exercise names, sets, reps, and durations
- Progress difficulty across the 4 weeks
- Include both solo and partner exercises (mark partner exercises clearly)
- For ${data.role === 'base' ? 'bases' : data.role === 'flyer' ? 'flyers' : 'versatile training'}, focus on ${data.role === 'base' ? 'pushing strength, stability, and timing' : data.role === 'flyer' ? 'body tension, balance, and proprioception' : 'both supporting and flying skills'}
- Include safety considerations throughout`;
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
