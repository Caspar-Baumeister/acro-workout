'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { QuestionnaireFlow } from '@/components/questionnaire';

export default function QuestionnairePage() {
  return (
    <main className="relative min-h-screen py-8 px-4">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-peach/50 via-brand-coral/20 to-transparent blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tl from-brand-orange/10 via-brand-peach/20 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="text-sm font-medium text-brand-navy">
            Acro Workout
          </div>
        </motion.header>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Let&apos;s build your plan
          </h1>
          <p className="mt-2 text-muted-foreground">
            Answer a few questions to get your personalized training
          </p>
        </motion.div>

        {/* Questionnaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <QuestionnaireFlow />
        </motion.div>
      </div>
    </main>
  );
}
