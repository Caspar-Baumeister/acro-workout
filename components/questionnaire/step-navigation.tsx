'use client';

import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  canProceed,
  isSubmitting,
  onBack,
  onNext,
  onSubmit,
}: StepNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      {/* Back button */}
      <motion.button
        type="button"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        className={cn(
          'flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all',
          isFirstStep
            ? 'invisible'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
        whileHover={!isFirstStep ? { x: -4 } : undefined}
        whileTap={!isFirstStep ? { scale: 0.98 } : undefined}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </motion.button>

      {/* Next/Submit button */}
      <motion.button
        type="button"
        onClick={isLastStep ? onSubmit : onNext}
        disabled={!canProceed || isSubmitting}
        className={cn(
          'flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all',
          canProceed && !isSubmitting
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
        whileHover={canProceed && !isSubmitting ? { scale: 1.02, x: 4 } : undefined}
        whileTap={canProceed && !isSubmitting ? { scale: 0.98 } : undefined}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating your plan...
          </>
        ) : isLastStep ? (
          <>
            Get My Plan
            <ArrowRight className="h-4 w-4" />
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </motion.button>
    </div>
  );
}
