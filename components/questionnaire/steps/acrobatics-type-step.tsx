'use client';

import { OptionCard } from '@/components/shared';
import { StepHeader } from '../step-container';
import { ACROBATICS_TYPES } from '@/content/questionnaire';
import type { PartialQuestionnaire } from '../use-questionnaire';

interface Props {
  data: PartialQuestionnaire;
  onUpdate: (data: PartialQuestionnaire) => void;
}

const icons: Record<string, string> = {
  'l-base': '🧘',
  'standing': '🏋️',
  'both': '🤸',
};

export function AcrobaticsTypeStep({ data, onUpdate }: Props) {
  return (
    <div>
      <StepHeader
        title="What type of acrobatics do you practice?"
        description="Choose your primary style — we'll tailor your plan accordingly"
      />
      <div className="grid gap-4">
        {ACROBATICS_TYPES.map((type) => (
          <OptionCard
            key={type.value}
            value={type.value}
            label={type.label}
            description={type.description}
            icon={icons[type.value]}
            isSelected={data.acrobaticsType === type.value}
            onSelect={(value) => onUpdate({ acrobaticsType: value as typeof data.acrobaticsType })}
          />
        ))}
      </div>
    </div>
  );
}
