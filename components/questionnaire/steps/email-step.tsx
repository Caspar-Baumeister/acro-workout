'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { StepHeader } from '../step-container';
import type { PartialQuestionnaire } from '../use-questionnaire';
import { cn } from '@/lib/utils';

interface Props {
  data: PartialQuestionnaire;
  onUpdate: (data: PartialQuestionnaire) => void;
  submitError?: string | null;
}

export function EmailStep({ data, onUpdate, submitError }: Props) {
  const [touched, setTouched] = useState(false);
  const email = data.email ?? '';
  const acceptedTerms = data.acceptedTerms ?? false;
  
  const isValidEmail = email.includes('@') && email.includes('.');
  const showEmailError = touched && email && !isValidEmail;

  return (
    <div>
      <StepHeader
        title="Almost there! Where should we send your plan?"
        description="Enter your email to receive your personalized training plan"
      />
      
      <div className="max-w-md mx-auto space-y-6">
        {/* Email input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            onBlur={() => setTouched(true)}
            placeholder="you@example.com"
            className={cn(
              'w-full h-14 rounded-xl border bg-card pl-12 pr-12 text-base',
              'placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-2 focus:border-primary',
              showEmailError
                ? 'border-destructive focus:ring-destructive/20'
                : 'border-border focus:ring-primary/20'
            )}
          />
          {email && isValidEmail && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600"
            >
              <Check className="h-5 w-5" />
            </motion.div>
          )}
        </div>
        
        {showEmailError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            Please enter a valid email address
          </motion.p>
        )}

        {/* Terms checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => onUpdate({ acceptedTerms: e.target.checked ? true : undefined })}
              className="sr-only"
            />
            <div
              className={cn(
                'h-5 w-5 rounded border-2 transition-all flex items-center justify-center',
                acceptedTerms
                  ? 'bg-primary border-primary'
                  : 'border-border group-hover:border-primary/50'
              )}
            >
              {acceptedTerms && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                </motion.div>
              )}
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            I agree to receive my training plan by email and accept the{' '}
            <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">
              terms of service
            </a>
            {' '}and{' '}
            <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">
              privacy policy
            </a>
            .
          </span>
        </label>

        {/* Optional interest checkboxes */}
        <div className="pt-2 space-y-3 border-t border-border/50">
          <p className="text-sm font-medium text-muted-foreground">Keep me updated about (optional):</p>
          
          <InterestCheckbox
            checked={data.interestedInCoaching ?? false}
            onChange={(checked) => onUpdate({ interestedInCoaching: checked })}
            label="Private coaching opportunities"
          />
          
          <InterestCheckbox
            checked={data.interestedInWorkshops ?? false}
            onChange={(checked) => onUpdate({ interestedInWorkshops: checked })}
            label="Workshops & events"
          />
          
          <InterestCheckbox
            checked={data.interestedInNewsletter ?? false}
            onChange={(checked) => onUpdate({ interestedInNewsletter: checked })}
            label="Tips & training newsletter"
          />
        </div>

        {/* Submit error */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
          >
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {submitError}
            </p>
          </motion.div>
        )}

        {/* Privacy note */}
        <div className="p-4 rounded-xl bg-brand-peach/30 text-sm">
          <p className="font-medium text-brand-navy">🔒 Your privacy matters</p>
          <p className="mt-1 text-muted-foreground">
            We&apos;ll only use your email to send your training plan. No spam, no selling your data.
          </p>
        </div>
      </div>
    </div>
  );
}

function InterestCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            'h-5 w-5 rounded border-2 transition-all flex items-center justify-center',
            checked
              ? 'bg-primary/80 border-primary/80'
              : 'border-border group-hover:border-primary/50'
          )}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </div>
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </label>
  );
}
