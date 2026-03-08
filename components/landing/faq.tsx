'use client';

import { Section, SectionHeader } from '@/components/shared';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'Is this really free?',
    answer: 'Yes! Your personalized training plan is completely free. We believe everyone should have access to quality training guidance for their acrobatics practice.',
  },
  {
    question: 'Do I need a partner to use the plan?',
    answer: 'The plans include solo conditioning exercises you can do anytime, plus partner drills for when you\'re training with someone. You\'ll get value even when training alone.',
  },
  {
    question: 'What if I\'m a complete beginner?',
    answer: 'Perfect! We have specific plans for beginners that focus on foundational strength, flexibility, and safety. The plan will meet you exactly where you are.',
  },
  {
    question: 'How long does the questionnaire take?',
    answer: 'About 2 minutes. We ask just enough questions to personalize your plan effectively, without wasting your time.',
  },
  {
    question: 'Will my plan work for acroyoga too?',
    answer: 'Absolutely. Whether you call it acroyoga, partner acrobatics, or acro — if you\'re doing L-base or standing acrobatics, this plan is for you.',
  },
  {
    question: 'Can I get a new plan if my goals change?',
    answer: 'Yes! You can come back anytime and create a new plan with updated goals, experience level, or training frequency.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-brand-navy"
      >
        <span className="font-medium pr-4">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <Section>
      <FadeIn>
        <SectionHeader
          badge="Questions?"
          title="Frequently asked questions"
          description="Everything you need to know about getting your personalized training plan."
        />
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mx-auto max-w-3xl bg-card rounded-2xl border border-border/50 p-6 sm:p-8">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </FadeIn>
    </Section>
  );
}
