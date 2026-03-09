'use client';

import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | 'hero';
  label?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
  hero: 'aspect-[16/9] md:aspect-[21/9]',
};

/**
 * Image placeholder component for development
 * Replace src with actual images in production
 */
export function ImagePlaceholder({
  className,
  aspectRatio = 'video',
  label = 'Replace with image',
  overlay = false,
  children,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-peach/40 via-brand-coral/20 to-brand-orange/30',
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Gradient overlay for text readability */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      )}

      {/* Placeholder indicator */}
      {!children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-navy/40">
          <ImageIcon className="h-12 w-12 mb-2" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      )}

      {/* Content slot */}
      {children && (
        <div className="absolute inset-0 flex items-end">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Hero background image placeholder
 * Covers full section with gradient overlay
 */
export function HeroImagePlaceholder({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 -z-10 overflow-hidden',
        className
      )}
    >
      {/* Background gradient simulating image */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-peach/30 via-brand-coral/10 to-brand-orange/20" />
      
      {/* Animated gradient orbs */}
      <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-brand-orange/20 to-transparent blur-3xl animate-pulse" />
      <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-brand-coral/20 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

      {/* Dev indicator */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand-navy/10 text-brand-navy/40 text-xs font-medium backdrop-blur-sm">
        📷 Add hero background image
      </div>

      {children}
    </div>
  );
}
