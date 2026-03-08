/**
 * AI prompt templates for training plan generation
 * TODO: Refine prompts based on actual Gemini output quality
 */

import type { QuestionnaireInput } from '@/lib/validation';

/**
 * Build the main prompt for training plan generation
 */
export function buildTrainingPlanPrompt(data: QuestionnaireInput): string {
  const roleDescription = {
    base: 'the base (supporting partner)',
    flyer: 'the flyer (aerial partner)',
    both: 'both base and flyer roles',
  }[data.role];

  const typeDescription = {
    'l-base': 'L-Base (lying down) acrobatics',
    standing: 'Standing acrobatics',
    both: 'both L-Base and Standing acrobatics',
  }[data.acrobaticsType];

  return `
You are an expert partner acrobatics coach creating a personalized training plan.

## User Profile
- **Role**: ${roleDescription}
- **Acrobatics Type**: ${typeDescription}
- **Experience Level**: ${data.level}
- **Training Days Per Week**: ${data.trainingDays}
- **Goals**: ${data.goals.join(', ')}
- **Available Equipment**: ${data.equipment.length > 0 ? data.equipment.join(', ') : 'None specified'}
${data.limitations ? `- **Limitations/Notes**: ${data.limitations}` : ''}

## Instructions
Create a structured, practical training plan that:
1. Is appropriate for their experience level
2. Focuses on their specific role and acrobatics type
3. Works within their available training days
4. Addresses their stated goals
5. Uses only their available equipment
${data.limitations ? '6. Accounts for their limitations or focus areas' : ''}

## Required Output Sections
Provide a complete plan with these sections:
1. **Profile Summary**: Brief overview of the user and their training focus
2. **Training Focus**: Main areas to develop based on goals
3. **Warm-Up**: Specific warm-up routine (5-15 minutes)
4. **Main Drills**: Core exercises and progressions
5. **Accessory Work**: Supplementary exercises
6. **Weekly Structure**: How to organize training across the week
7. **Safety Notes**: Important safety considerations

Be specific and practical. Avoid generic advice. Include exercise names, rep ranges, and progressions where appropriate.
`.trim();
}

/**
 * System prompt for consistent output formatting
 */
export const SYSTEM_PROMPT = `
You are an expert partner acrobatics coach. Your responses should be:
- Specific and actionable
- Appropriate for the user's experience level
- Safety-conscious
- Encouraging but realistic

Focus on practical training advice, not motivational fluff.
`.trim();
