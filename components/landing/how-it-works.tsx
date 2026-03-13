'use client';

import Link from 'next/link';
import { Section, SectionHeader } from '@/components/shared';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared';
import { ClipboardList, Sparkles, Mail, Dumbbell, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Share your acro profile',
    description: 'Tell us your role (base/flyer), experience level, training days, and acro style.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'We create your plan',
    description: 'Experienced acrobats have trained our system on what actually works for bases and flyers.',
  },
  {
    number: '03',
    icon: Mail,
    title: 'Receive by email',
    description: 'Get your complete plan with exercises, sets, reps, and progression cues.',
  },
  {
    number: '04',
    icon: RefreshCw,
    title: 'Train indefinitely',
    description: 'Use your evergreen weekly template until your goals or situation changes.',
  },
];

const philosophyPoints = [
  {
    icon: Shield,
    title: 'Injury prevention first',
    description: 'Every session includes prehab for wrists, shoulders, and core.',
  },
  {
    icon: Dumbbell,
    title: 'Role-specific training',
    description: 'Bases get strength focus. Flyers get mobility and explosiveness.',
  },
  {
    icon: Sparkles,
    title: 'Acro-specific exercises',
    description: 'Every exercise connects to real acro movements and positions.',
  },
];

export function HowItWorks() {
  return (
    <Section className="bg-secondary/30">
      <FadeIn>
        <SectionHeader
          badge="How It Works"
          title="From questionnaire to training plan"
          description="We combine your personal acro profile with proven training principles to create a plan that actually supports your practice."
        />
      </FadeIn>

      {/* Steps */}
      <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-20">
        {steps.map((step, index) => (
          <StaggerItem key={step.number}>
            <div className="group relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-border via-brand-coral/30 to-border z-0" />
              )}
              
              <div className="relative bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg hover:border-brand-coral/20 transition-all duration-300 h-full">
                {/* Step number */}
                <div className="absolute -top-3 -left-1 bg-brand-peach text-brand-navy text-xs font-bold px-2 py-1 rounded-full">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-peach to-brand-coral/30 text-brand-navy group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-7 w-7" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Philosophy connection - without image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-brand-navy/[0.03] to-brand-coral/[0.03] rounded-3xl p-8 md:p-12"
      >
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Built on proven principles
          </h3>
          <p className="text-muted-foreground text-lg">
            Your plan isn&apos;t randomly generated. It&apos;s based on years of experience training acro 
            and understanding what actually helps acrobats progress safely.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {philosophyPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-background/50"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-coral/10 text-brand-coral mb-4">
                <point.icon className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{point.title}</h4>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/questionnaire"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Create My Plan
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#philosophy"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-navy/20 text-brand-navy font-medium hover:bg-brand-navy/5 transition-all"
          >
            Read our philosophy
          </Link>
        </div>
      </motion.div>
    </Section>
  );
}
