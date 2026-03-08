'use client';

import { OptionCard } from '@/components/shared';
import { StepHeader } from '../step-container';
import { USER_ROLES } from '@/content/questionnaire';
import type { PartialQuestionnaire } from '../use-questionnaire';

interface Props {
  data: PartialQuestionnaire;
  onUpdate: (data: PartialQuestionnaire) => void;
}

const icons: Record<string, string> = {
  base: '💪',
  flyer: '🦋',
  both: '🔄',
};

export function RoleStep({ data, onUpdate }: Props) {
  return (
    <div>
      <StepHeader
        title="What's your role?"
        description="Tell us which role you want to train for"
      />
      <div className="grid gap-4">
        {USER_ROLES.map((role) => (
          <OptionCard
            key={role.value}
            value={role.value}
            label={role.label}
            description={role.description}
            icon={icons[role.value]}
            isSelected={data.role === role.value}
            onSelect={(value) => onUpdate({ role: value as typeof data.role })}
          />
        ))}
      </div>
    </div>
  );
}
