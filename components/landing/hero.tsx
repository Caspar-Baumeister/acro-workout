'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
      {/* Hero background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero_bg.jpg"
          alt="Partner acrobatics in action"
          fill
          priority
          className="object-cover"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
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
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
