'use client';

import { OptionCard } from '@/components/shared';
import { StepHeader } from '../step-container';
import { SETUP_PRESETS } from '@/content/questionnaire';
import type { PartialQuestionnaire } from '../use-questionnaire';
import { cn } from '@/lib/utils';

interface Props {
  data: PartialQuestionnaire;
  onUpdate: (data: PartialQuestionnaire) => void;
}

const quickNotes = [
  'Kettlebell only',
  'No squat rack',
  'TRX / suspension trainer',
  'Resistance bands',
  'Parallettes',
  'Gymnastics rings',
];

export function SetupStep({ data, onUpdate }: Props) {
  const setupNotes = data.setupNotes ?? '';

  const addNote = (note: string) => {
    const current = setupNotes.trim();
    const newValue = current ? `${current}, ${note.toLowerCase()}` : note.toLowerCase();
    onUpdate({ setupNotes: newValue });
  };

  return (
    <div>
      <StepHeader
        title="What's your setup?"
        description="Select your training environment — exercises will match what you have"
      />

      {/* Preset grid */}
      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {SETUP_PRESETS.map((preset) => (
          <OptionCard
            key={preset.value}
            value={preset.value}
            label={preset.label}
            description={preset.description}
            icon={preset.icon}
            isSelected={data.setupPreset === preset.value}
            onSelect={(value) => onUpdate({ setupPreset: value as typeof data.setupPreset })}
            compact
          />
        ))}
      </div>

      {/* Additional notes section */}
      <div className="space-y-3 pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground">
          Anything specific? <span className="text-muted-foreground font-normal">(optional)</span>
        </p>

        {/* Quick tags */}
        <div className="flex flex-wrap gap-2">
          {quickNotes.map((note) => (
            <button
              key={note}
              type="button"
              onClick={() => addNote(note)}
              className={cn(
                'rounded-full border border-border px-3 py-1.5 text-sm transition-all',
                'hover:border-primary/40 hover:bg-accent/50',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              )}
            >
              + {note}
            </button>
          ))}
        </div>

        {/* Free text input */}
        <textarea
          value={setupNotes}
          onChange={(e) => onUpdate({ setupNotes: e.target.value })}
          placeholder="E.g., 25kg kettlebell, no bench, climbing gym, only machines..."
          className={cn(
            'w-full min-h-[80px] rounded-xl border border-border bg-card p-3 text-sm',
            'placeholder:text-muted-foreground/60',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            'resize-none transition-all'
          )}
        />
      </div>

      {/* Help text */}
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {!data.setupPreset && (
          <>Select your setup above — we&apos;ll match exercises to what you have.</>
        )}
        {data.setupPreset === 'no-equipment' && (
          <>Your plan will focus on bodyweight exercises you can do anywhere.</>
        )}
        {data.setupPreset && data.setupPreset !== 'no-equipment' && (
          <>Great! Your plan will include exercises that use your equipment.</>
        )}
      </p>
    </div>
  );
}
