'use client';

import { Section, SectionHeader } from '@/components/shared';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared';
import { Target, Users, TrendingUp, Shield, Clock, Heart } from 'lucide-react';

const benefits = [
  {
    icon: Target,
    title: 'Role-specific training',
    description: 'Exercises tailored to whether you\'re a base, flyer, or training both roles.',
  },
  {
    icon: Users,
    title: 'For any level',
    description: 'From complete beginners to advanced practitioners — we meet you where you are.',
  },
  {
    icon: TrendingUp,
    title: 'Progressive structure',
    description: 'Build skills systematically with warm-ups, drills, and conditioning work.',
  },
  {
    icon: Shield,
    title: 'Safety-conscious',
    description: 'Proper warm-up sequences and technique notes to keep you training injury-free.',
  },
  {
    icon: Clock,
    title: 'Fits your schedule',
    description: 'Plans adapted to however many days per week you can dedicate to training.',
  },
  {
    icon: Heart,
    title: 'Goal-oriented',
    description: 'Whether it\'s strength, flexibility, or new skills — your plan reflects your priorities.',
  },
];

export function Benefits() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader
          badge="Why It Works"
          title="Training that actually fits you"
          description="Generic workout plans don't work for partner acrobatics. Get a plan designed for your specific discipline, role, and goals."
        />
      </FadeIn>

      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <StaggerItem key={benefit.title}>
            <div className="group h-full p-6 rounded-2xl border border-border/50 bg-card hover:bg-accent/30 hover:border-brand-coral/20 transition-all duration-300">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-peach/50 text-brand-navy group-hover:bg-brand-coral/20 transition-colors">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
