'use client';

import { OptionCard } from '@/components/shared';
import { StepHeader } from '../step-container';
import { ACRO_STYLE_OPTIONS } from '@/content/questionnaire';
import type { PartialQuestionnaire } from '../use-questionnaire';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface Props {
  data: PartialQuestionnaire;
  onUpdate: (data: PartialQuestionnaire) => void;
}

export function AcroStyleStep({ data, onUpdate }: Props) {
  const selected = data.acroStyleFocus ?? [];

  const toggleStyle = (value: string) => {
    const newStyles = selected.includes(value as typeof selected[number])
      ? selected.filter((s) => s !== value)
      : [...selected, value as typeof selected[number]];
    onUpdate({ acroStyleFocus: newStyles });
  };

  return (
    <div>
      <StepHeader
        title="What kind of acro are you training for?"
        description="Select all that apply — your plan will cover these focuses"
      />
      <div className="grid gap-3">
        {ACRO_STYLE_OPTIONS.map((style) => {
          const isSelected = selected.includes(style.value);
          return (
            <motion.button
              key={style.value}
              type="button"
              onClick={() => toggleStyle(style.value)}
              className={cn(
                'group relative w-full rounded-2xl border-2 p-4 text-left transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-accent/50'
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Selected indicator */}
              <motion.div
                className={cn(
                  'absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md',
                  isSelected ? 'bg-primary text-primary-foreground' : 'border-2 border-border bg-background'
                )}
                animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isSelected && <Check className="h-4 w-4" strokeWidth={3} />}
              </motion.div>

              <div className="flex items-start gap-3 pr-10">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl',
                    isSelected ? 'bg-primary/10' : 'bg-muted'
                  )}
                >
                  {style.icon}
                </div>
                <div className="min-w-0">
                  <p className={cn('font-semibold', isSelected && 'text-primary')}>
                    {style.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{style.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selection feedback */}
      <div className="mt-4 text-center text-sm">
        {selected.length === 0 && (
          <p className="text-muted-foreground">Select at least one style</p>
        )}
        {selected.length > 0 && (
          <p className="text-brand-navy">
            {selected.length} style{selected.length > 1 ? 's' : ''} selected
            {selected.length > 1 && ' — your plan will balance these focuses'}
          </p>
        )}
      </div>

      {/* Style-specific hints */}
      {selected.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-muted/50 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Your plan will include:</p>
          <ul className="space-y-1">
            {selected.includes('static') && (
              <li>• Isometric strength, stability, slow controlled movements</li>
            )}
            {selected.includes('dynamic') && (
              <li>• Explosive power, plyometrics, landing mechanics</li>
            )}
            {selected.includes('asymmetric') && (
              <li>• Unilateral strength, single-limb stability, anti-rotation work</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
