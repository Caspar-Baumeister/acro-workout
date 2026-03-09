'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { HeroImagePlaceholder } from '@/components/shared/image-placeholder';

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
      {/* Hero background image placeholder */}
      <HeroImagePlaceholder />

      {/* Alternative animated background (shows through placeholder) */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        {/* Main gradient orbs */}
        <motion.div
          className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-br from-brand-peach via-brand-coral/30 to-transparent blur-3xl opacity-60"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-[600px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tl from-brand-orange/20 via-brand-peach/30 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-coral/30 bg-white/80 px-4 py-2 text-sm font-medium text-brand-navy shadow-lg shadow-brand-coral/5 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-brand-orange" />
          <span>AI-powered supplemental training for acrobats</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance"
        >
          Build the strength{' '}
          <span className="relative inline-block">
            <span className="gradient-text">acro reveals</span>
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-3 bg-brand-peach/50 -z-10 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ originX: 0 }}
            />
          </span>{' '}
          you need
        </motion.h1>

        {/* Subheadline - more story-driven */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-3xl mx-auto text-balance leading-relaxed"
        >
          Acro shows your weaknesses. It doesn&apos;t fix them. Get a personalized 
          strength, mobility &amp; prehab plan designed for your role and goals—so you 
          can progress faster and stay injury-free.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/questionnaire"
            className="group relative inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Create My Plan
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#philosophy"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-brand-navy/20 bg-white/80 px-6 text-brand-navy font-medium backdrop-blur-sm transition-all hover:bg-white hover:border-brand-navy/30"
          >
            <Play className="h-4 w-4" />
            Learn our approach
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          Free • Takes 2 minutes • No account needed
        </motion.p>

        {/* Trust indicators - more personal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {[
            { icon: '🎯', text: 'Base, Flyer, or Both' },
            { icon: '💪', text: 'Strength + Mobility + Prehab' },
            { icon: '🛡️', text: 'Injury prevention focus' },
            { icon: '✉️', text: 'Delivered by email' },
          ].map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground/50"
        >
          <span className="text-xs uppercase tracking-widest">Discover</span>
          <div className="h-8 w-5 rounded-full border-2 border-current p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-1 rounded-full bg-current mx-auto"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
