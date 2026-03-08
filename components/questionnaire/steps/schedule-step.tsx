'use client';

import { motion } from 'motion/react';
import { StepHeader } from '../step-container';
import { TRAINING_DAYS_OPTIONS } from '@/content/questionnaire';
import type { PartialQuestionnaire } from '../use-questionnaire';
import { cn } from '@/lib/utils';

interface Props {
  data: PartialQuestionnaire;
  onUpdate: (data: PartialQuestionnaire) => void;
}

export function ScheduleStep({ data, onUpdate }: Props) {
  return (
    <div>
      <StepHeader
        title="How many days can you train?"
        description="We'll structure your plan around your availability"
      />
      <div className="grid grid-cols-7 gap-2 max-w-md mx-auto">
        {TRAINING_DAYS_OPTIONS.map((option) => {
          const isSelected = data.trainingDays === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onUpdate({ trainingDays: option.value })}
              className={cn(
                'relative aspect-square rounded-xl border-2 font-semibold transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-accent/50'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.value}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        {data.trainingDays && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
          >
            <span className="font-medium text-primary">{data.trainingDays} day{data.trainingDays > 1 ? 's' : ''}</span>
            <span className="text-muted-foreground"> per week</span>
          </motion.p>
        )}
        {!data.trainingDays && (
          <p className="text-sm text-muted-foreground">Select how often you can train</p>
        )}
      </div>
      <div className="mt-4 p-4 rounded-xl bg-brand-peach/30 text-sm text-brand-navy">
        <p className="font-medium">💡 Tip</p>
        <p className="mt-1 text-muted-foreground">
          Consistency beats intensity. It&apos;s better to train 2-3 days reliably than to aim for 6 and burn out.
        </p>
      </div>
    </div>
  );
}
