'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, Mail, ArrowRight, Home, Sparkles } from 'lucide-react';

export default function SuccessPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-peach/40 via-brand-coral/20 to-transparent blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-xl shadow-green-500/30"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>

        {/* Confetti burst effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1, 
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{ 
                opacity: 0, 
                scale: 1,
                x: Math.cos(i * 30 * Math.PI / 180) * 100,
                y: Math.sin(i * 30 * Math.PI / 180) * 100,
              }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + i * 0.02,
                ease: 'easeOut'
              }}
              className="absolute h-2 w-2 rounded-full"
              style={{
                backgroundColor: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#22C55E', '#4ADE80'][i % 6],
              }}
            />
          ))}
        </motion.div>

        {/* Content card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/50 p-8 shadow-xl shadow-black/5 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            Your plan is on its way! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-muted-foreground"
          >
            Check your inbox for your personalized partner acrobatics training plan.
          </motion.p>

          {/* Email indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-xl bg-brand-peach/30 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-coral/20 text-brand-navy">
              <Mail className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-brand-navy">Check your email</p>
              <p className="text-sm text-muted-foreground">
                Your plan should arrive within a few minutes
              </p>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-left space-y-3"
          >
            <p className="text-sm font-medium">While you wait:</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-brand-orange shrink-0" />
                <span>Check your spam/promotions folder if you don&apos;t see it</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-brand-orange shrink-0" />
                <span>Save the email for easy access during your training sessions</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-brand-orange shrink-0" />
                <span>Come back anytime to create a new plan as your goals evolve</span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 space-y-3"
          >
            <Link
              href="/questionnaire"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              Create Another Plan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border text-muted-foreground font-medium transition-colors hover:bg-muted hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Thanks for using Acro Workout! Happy training 🤸
        </motion.p>
      </div>
    </main>
  );
}
