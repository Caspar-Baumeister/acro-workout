'use client';

import { StepHeader } from '../step-container';
import type { PartialQuestionnaire } from '../use-questionnaire';
import { cn } from '@/lib/utils';

interface Props {
  data: PartialQuestionnaire;
  onUpdate: (data: PartialQuestionnaire) => void;
}

const quickTags = [
  'Tight shoulders',
  'Weak wrists',
  'Lower back issues',
  'Knee sensitivity',
  'Working on handstands',
  'Focus on flexibility',
];

export function LimitationsStep({ data, onUpdate }: Props) {
  const limitations = data.limitations ?? '';

  const addTag = (tag: string) => {
    const current = limitations.trim();
    const newValue = current ? `${current}, ${tag.toLowerCase()}` : tag.toLowerCase();
    onUpdate({ limitations: newValue });
  };

  return (
    <div>
      <StepHeader
        title="Anything we should know?"
        description="Optional: Tell us about injuries, limitations, or areas you want to focus on"
      />
      
      <div className="space-y-4">
        {/* Quick tags */}
        <div className="flex flex-wrap gap-2 justify-center">
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className={cn(
                'rounded-full border border-border px-3 py-1.5 text-sm transition-all',
                'hover:border-primary/40 hover:bg-accent/50',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              )}
            >
              + {tag}
            </button>
          ))}
        </div>

        {/* Text area */}
        <textarea
          value={limitations}
          onChange={(e) => onUpdate({ limitations: e.target.value })}
          placeholder="E.g., recovering from a shoulder injury, need to strengthen wrists, want to focus more on flexibility..."
          className={cn(
            'w-full min-h-[120px] rounded-xl border border-border bg-card p-4 text-sm',
            'placeholder:text-muted-foreground/60',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            'resize-none transition-all'
          )}
        />

        <p className="text-center text-sm text-muted-foreground">
          This is completely optional. Skip if you don&apos;t have any specific concerns.
        </p>
      </div>
    </div>
  );
}
