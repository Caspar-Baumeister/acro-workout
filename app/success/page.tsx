'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, Mail, ArrowRight, Home, Sparkles, MessageCircle, Users } from 'lucide-react';

export default function SuccessPage() {
  const coachingMailto = `mailto:info@acroworld.de?subject=${encodeURIComponent('Coaching request — my acro training plan')}&body=${encodeURIComponent('Hi AcroWorld team,\n\nI just received my training plan and I\'d love to get some personal coaching help with...\n\n')}`;

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-brand-peach/20 via-background to-brand-coral/10">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-green-200/40 to-green-400/20 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-brand-coral/30 to-brand-orange/20 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="w-full max-w-lg">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-2xl shadow-green-500/40"
        >
          <CheckCircle2 className="h-14 w-14" strokeWidth={2.5} />
        </motion.div>

        {/* Confetti burst effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          {[...Array(16)].map((_, i) => (
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
                x: Math.cos(i * 22.5 * Math.PI / 180) * 120,
                y: Math.sin(i * 22.5 * Math.PI / 180) * 120,
              }}
              transition={{ 
                duration: 1, 
                delay: 0.2 + i * 0.02,
                ease: 'easeOut'
              }}
              className="absolute h-3 w-3 rounded-full"
              style={{
                backgroundColor: ['#F97316', '#FB923C', '#FDBA74', '#22C55E', '#4ADE80', '#86EFAC', '#FDE047', '#A78BFA'][i % 8],
              }}
            />
          ))}
        </motion.div>

        {/* Content card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-2xl shadow-black/10 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900"
          >
            Your plan is on its way! 
            <motion.span 
              className="inline-block ml-2"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              🎉
            </motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-gray-600 text-lg"
          >
            Check your inbox for your personalized partner acrobatics training plan.
          </motion.p>

          {/* Email indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-brand-peach/40 to-brand-coral/20 flex items-center gap-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md text-brand-coral">
              <Mail className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Check your email</p>
              <p className="text-sm text-gray-600">
                Your plan should arrive within a few minutes
              </p>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-left"
          >
            <p className="text-sm font-semibold text-gray-700 mb-4">While you wait:</p>
            <div className="space-y-3">
              {[
                "Check your spam/promotions folder if you don't see it",
                "Save the email for easy access during your training sessions",
                "Come back anytime to create a new plan as your goals evolve",
              ].map((tip, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-gray-600"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
                    <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
                  </div>
                  <span>{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-10 space-y-3"
          >
            <Link
              href="/questionnaire"
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-coral to-brand-orange text-white font-semibold shadow-lg shadow-brand-coral/30 transition-all hover:shadow-xl hover:shadow-brand-coral/40 hover:-translate-y-0.5"
            >
              Create Another Plan
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 text-gray-600 font-medium transition-all hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>

        {/* Coaching CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-6 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl shadow-black/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-coral/10 text-brand-coral">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Want Personal Guidance?</h2>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Our coaching team of <strong>acrobats, physios, and gymnasts</strong> can help you 
            with form corrections via video, specific pose progressions, or fully customized programs 
            for your partnership.
          </p>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
            <MessageCircle className="h-4 w-4" />
            <span>Just reply to the email you just received, or:</span>
          </div>
          
          <a
            href={coachingMailto}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 text-white font-medium transition-all hover:bg-gray-800 hover:-translate-y-0.5"
          >
            <Mail className="h-4 w-4" />
            Send a Coaching Request
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          
          <p className="text-xs text-gray-400 text-center mt-3">
            We typically respond within 24-48 hours
          </p>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center text-gray-500"
        >
          Thanks for using Acro Workout! Happy training 🤸
        </motion.p>
      </div>
    </main>
  );
}
