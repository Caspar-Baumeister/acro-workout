'use client';

import { Section, SectionHeader } from '@/components/shared';
import { FadeIn } from '@/components/shared';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const personalizationFactors = [
  {
    category: 'Discipline',
    items: ['L-Base (lying down)', 'Standing acrobatics', 'Combined training'],
  },
  {
    category: 'Your Role',
    items: ['Base training', 'Flyer training', 'Both roles'],
  },
  {
    category: 'Experience',
    items: ['Beginner fundamentals', 'Intermediate progressions', 'Advanced techniques'],
  },
  {
    category: 'Goals',
    items: ['Strength building', 'Flexibility work', 'New skill acquisition', 'Conditioning'],
  },
];

const planSections = [
  'Profile summary',
  'Training focus areas',
  'Warm-up routine',
  'Main skill drills',
  'Accessory exercises',
  'Weekly structure',
  'Safety guidelines',
];

export function Personalization() {
  return (
    <Section className="bg-gradient-to-b from-transparent via-brand-peach/10 to-transparent">
      <FadeIn>
        <SectionHeader
          badge="Tailored For You"
          title="What your plan includes"
          description="Every plan is built from your specific inputs, not generic templates."
        />
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Personalization factors */}
        <FadeIn delay={0.1}>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">We personalize based on:</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {personalizationFactors.map((factor, i) => (
                <motion.div
                  key={factor.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="p-4 rounded-xl bg-card border border-border/50"
                >
                  <p className="font-medium text-brand-navy mb-2">{factor.category}</p>
                  <ul className="space-y-1">
                    {factor.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-coral shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Right: Plan structure preview */}
        <FadeIn delay={0.2}>
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-peach/30 via-brand-coral/10 to-brand-orange/5 rounded-3xl -z-10 blur-xl" />
            
            <div className="bg-card rounded-2xl border border-border shadow-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-orange to-brand-coral flex items-center justify-center text-white font-bold">
                  📋
                </div>
                <div>
                  <p className="font-semibold">Your Training Plan</p>
                  <p className="text-xs text-muted-foreground">Personalized • Structured • Ready to use</p>
                </div>
              </div>
              
              <p className="text-sm font-medium mb-4 text-muted-foreground">Every plan includes:</p>
              <ul className="space-y-3">
                {planSections.map((section, i) => (
                  <motion.li
                    key={section}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-peach text-brand-navy">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm">{section}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
