'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface OptionCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function OptionCard({
  value,
  label,
  description,
  icon,
  isSelected,
  onSelect,
  disabled,
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onSelect(value)}
      disabled={disabled}
      className={cn(
        'group relative w-full rounded-2xl border-2 p-5 text-left transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isSelected
          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
          : 'border-border bg-card hover:border-primary/40 hover:bg-accent/50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      whileHover={!disabled ? { scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
    >
      {/* Selected indicator */}
      <motion.div
        className={cn(
          'absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full',
          isSelected ? 'bg-primary text-primary-foreground' : 'border-2 border-border bg-background'
        )}
        animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isSelected && <Check className="h-4 w-4" strokeWidth={3} />}
      </motion.div>

      <div className="flex items-start gap-4 pr-10">
        {icon && (
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl',
              isSelected ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className={cn('font-semibold', isSelected && 'text-primary')}>{label}</p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

interface MultiSelectCardProps {
  value: string;
  label: string;
  isSelected: boolean;
  onToggle: (value: string) => void;
  disabled?: boolean;
}

export function MultiSelectCard({
  value,
  label,
  isSelected,
  onToggle,
  disabled,
}: MultiSelectCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onToggle(value)}
      disabled={disabled}
      className={cn(
        'relative rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isSelected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card hover:border-primary/40 hover:bg-accent/50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      whileHover={!disabled ? { scale: 1.03 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
    >
      {label}
    </motion.button>
  );
}
