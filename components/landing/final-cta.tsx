'use client';

import Link from 'next/link';
import { Section } from '@/components/shared';
import { FadeIn } from '@/components/shared';
import { motion } from 'motion/react';
import { ArrowRight, Zap } from 'lucide-react';

export function FinalCTA() {
  return (
    <Section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy/90" />
        <motion.div
          className="absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-coral/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-0 bottom-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-brand-orange/20 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <FadeIn>
        <div className="relative text-center py-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-coral text-white shadow-lg shadow-brand-coral/30"
          >
            <Zap className="h-8 w-8" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            Ready to level up your practice?
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
            Get your personalized training plan in just 2 minutes. 
            No account required, completely free.
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/questionnaire"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-brand-navy shadow-xl shadow-black/20 transition-all hover:shadow-2xl hover:bg-brand-peach"
            >
              Create My Plan Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Trust note */}
          <p className="mt-6 text-sm text-white/50">
            Join hundreds of acrobats already training smarter
          </p>
        </div>
      </FadeIn>
    </Section>
  );
}
