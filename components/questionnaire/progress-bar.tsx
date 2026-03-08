'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="font-medium text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-orange to-brand-coral"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        />
      </div>
      {/* Step dots */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              'h-2 w-2 rounded-full transition-colors duration-200',
              index <= currentStep ? 'bg-primary' : 'bg-muted'
            )}
            animate={index === currentStep ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
