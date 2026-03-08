'use client';

import { MultiSelectCard } from '@/components/shared';
import { StepHeader } from '../step-container';
import { EQUIPMENT_OPTIONS } from '@/content/questionnaire';
import type { PartialQuestionnaire } from '../use-questionnaire';

interface Props {
  data: PartialQuestionnaire;
  onUpdate: (data: PartialQuestionnaire) => void;
}

export function EquipmentStep({ data, onUpdate }: Props) {
  const equipment = data.equipment ?? [];

  const toggleEquipment = (value: string) => {
    // If selecting "none", clear all other selections
    if (value === 'none') {
      onUpdate({ equipment: equipment.includes('none') ? [] : ['none'] });
      return;
    }
    // If selecting equipment, remove "none" from the list
    const withoutNone = equipment.filter((e) => e !== 'none');
    const newEquipment = withoutNone.includes(value)
      ? withoutNone.filter((e) => e !== value)
      : [...withoutNone, value];
    onUpdate({ equipment: newEquipment });
  };

  return (
    <div>
      <StepHeader
        title="What equipment do you have?"
        description="Select all that you have access to — or skip if you prefer bodyweight only"
      />
      <div className="flex flex-wrap gap-3 justify-center">
        {EQUIPMENT_OPTIONS.map((item) => (
          <MultiSelectCard
            key={item.value}
            value={item.value}
            label={item.label}
            isSelected={equipment.includes(item.value)}
            onToggle={toggleEquipment}
          />
        ))}
      </div>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {equipment.length === 0 && (
          <p>You can skip this step — bodyweight exercises work great too!</p>
        )}
        {equipment.includes('none') && (
          <p>No worries! Your plan will focus on bodyweight exercises.</p>
        )}
        {equipment.length > 0 && !equipment.includes('none') && (
          <p>{equipment.length} item{equipment.length > 1 ? 's' : ''} selected</p>
        )}
      </div>
    </div>
  );
}
