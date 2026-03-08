'use client';

import { Section, SectionHeader } from '@/components/shared';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared';
import { ClipboardList, Sparkles, Mail, Dumbbell } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Answer quick questions',
    description: 'Tell us about your acrobatics style, role, experience level, and training goals.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI creates your plan',
    description: 'Our AI analyzes your answers and generates a structured, personalized workout plan.',
  },
  {
    number: '03',
    icon: Mail,
    title: 'Get it in your inbox',
    description: 'Receive your complete training plan by email, ready to use immediately.',
  },
  {
    number: '04',
    icon: Dumbbell,
    title: 'Start training',
    description: 'Follow your personalized plan and level up your partner acrobatics practice.',
  },
];

export function HowItWorks() {
  return (
    <Section className="bg-secondary/30">
      <FadeIn>
        <SectionHeader
          badge="Simple Process"
          title="Get your plan in minutes"
          description="No complicated setup, no account required. Just answer a few questions and we'll create your personalized training plan."
        />
      </FadeIn>

      <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
    </Section>
  );
}
