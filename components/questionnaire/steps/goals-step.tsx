'use client';

import { MultiSelectCard } from '@/components/shared';
import { StepHeader } from '../step-container';
import { TRAINING_GOALS } from '@/content/questionnaire';
import type { PartialQuestionnaire } from '../use-questionnaire';

interface Props {
  data: PartialQuestionnaire;
  onUpdate: (data: PartialQuestionnaire) => void;
}

export function GoalsStep({ data, onUpdate }: Props) {
  const goals = data.goals ?? [];

  const toggleGoal = (value: string) => {
    const newGoals = goals.includes(value)
      ? goals.filter((g) => g !== value)
      : [...goals, value];
    onUpdate({ goals: newGoals });
  };

  return (
    <div>
      <StepHeader
        title="What are your training goals?"
        description="Select all that apply — your plan will prioritize these"
      />
      <div className="flex flex-wrap gap-3 justify-center">
        {TRAINING_GOALS.map((goal) => (
          <MultiSelectCard
            key={goal.value}
            value={goal.value}
            label={goal.label}
            isSelected={goals.includes(goal.value)}
            onToggle={toggleGoal}
          />
        ))}
      </div>
      {goals.length === 0 && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Please select at least one goal
        </p>
      )}
      {goals.length > 0 && (
        <p className="mt-4 text-center text-sm text-brand-navy">
          {goals.length} goal{goals.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
