'use client';

import { motion } from 'motion/react';
import { ImagePlaceholder } from '@/components/shared/image-placeholder';
import { Heart, Award, Users, Calendar } from 'lucide-react';

const stats = [
  { icon: Calendar, value: '7+', label: 'Years of acro practice' },
  { icon: Users, value: '100+', label: 'Training partners' },
  { icon: Heart, value: '∞', label: 'Passion for movement' },
];

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/[0.02] to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main image */}
            <ImagePlaceholder
              aspectRatio="portrait"
              label="Founder/team photo"
              className="max-w-md mx-auto lg:mx-0"
            />
            
            {/* Floating accent images */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 w-32 h-32 md:w-40 md:h-40"
            >
              <ImagePlaceholder
                aspectRatio="square"
                label="Acro moment"
                className="shadow-2xl"
              />
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:pl-8"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-medium mb-4">
              About Us
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Built by acrobats,{' '}
              <span className="gradient-text">for acrobats</span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                We&apos;ve been where you are. Excited about acro, training hard, making progress—and 
                then hitting a wall. Injuries. Plateaus. The frustration of not knowing why 
                your body won&apos;t do what your mind can see.
              </p>
              <p>
                After years of trial and error, working with physical therapists, coaches, and 
                countless training partners, we discovered something important: <strong className="text-foreground">acro alone 
                isn&apos;t enough</strong>. It shows you your weaknesses but doesn&apos;t build the 
                strength to fix them.
              </p>
              <p>
                That&apos;s why we created this tool—to give every acrobat access to the kind of 
                targeted supplemental training that used to require expensive coaching or 
                learning the hard way (often through injury).
              </p>
              <p className="text-foreground font-medium">
                Your plan isn&apos;t generic. It&apos;s built for your role, your level, and your goals. 
                Because we know that a base&apos;s needs are different from a flyer&apos;s, and a beginner&apos;s 
                path looks different from an advanced practitioner&apos;s.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-border">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-xl bg-brand-peach/30 text-brand-orange">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-brand-peach/20 to-brand-coral/10 border-l-4 border-brand-coral"
            >
              <p className="text-foreground italic">
                &ldquo;The best investment you can make in your acro journey is building a body 
                that&apos;s ready for anything. That&apos;s what this is about.&rdquo;
              </p>
              <footer className="mt-3 text-sm text-muted-foreground">
                — The AcroWorld Team
              </footer>
            </motion.blockquote>
          </motion.div>
        </div>

        {/* Image gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            'Training session',
            'Partner work',
            'Mobility flow',
            'Community jam',
          ].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <ImagePlaceholder
                aspectRatio="square"
                label={label}
                className="hover:scale-[1.02] transition-transform duration-300"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
