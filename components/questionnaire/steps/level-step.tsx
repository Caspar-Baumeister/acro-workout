'use client';

import { OptionCard } from '@/components/shared';
import { StepHeader } from '../step-container';
import { EXPERIENCE_LEVELS } from '@/content/questionnaire';
import type { PartialQuestionnaire } from '../use-questionnaire';

interface Props {
  data: PartialQuestionnaire;
  onUpdate: (data: PartialQuestionnaire) => void;
}

const icons: Record<string, string> = {
  beginner: '🌱',
  intermediate: '🌿',
  advanced: '🌳',
};

export function LevelStep({ data, onUpdate }: Props) {
  return (
    <div>
      <StepHeader
        title="What's your experience level?"
        description="Be honest — we'll meet you where you are"
      />
      <div className="grid gap-4">
        {EXPERIENCE_LEVELS.map((level) => (
          <OptionCard
            key={level.value}
            value={level.value}
            label={level.label}
            description={level.description}
            icon={icons[level.value]}
            isSelected={data.level === level.value}
            onSelect={(value) => onUpdate({ level: value as typeof data.level })}
          />
        ))}
      </div>
    </div>
  );
}
