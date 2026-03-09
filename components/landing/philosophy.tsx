'use client';

import { motion } from 'motion/react';
import { trainingPhilosophy } from '@/content/training-philosophy';
import { ImagePlaceholder } from '@/components/shared/image-placeholder';
import { 
  Dumbbell, 
  Wind, 
  Shield, 
  Target,
  Zap,
  Heart
} from 'lucide-react';

const priorityIcons: Record<string, React.ReactNode> = {
  'Strength': <Dumbbell className="h-5 w-5" />,
  'Explosive': <Zap className="h-5 w-5" />,
  'Core': <Target className="h-5 w-5" />,
  'Balance': <Wind className="h-5 w-5" />,
  'Mobility': <Wind className="h-5 w-5" />,
  'Shoulder': <Target className="h-5 w-5" />,
  'Stay': <Heart className="h-5 w-5" />,
  'Lower': <Zap className="h-5 w-5" />,
};

function getIcon(name: string) {
  for (const [key, icon] of Object.entries(priorityIcons)) {
    if (name.includes(key)) return icon;
  }
  return <Target className="h-5 w-5" />;
}

export function Philosophy() {
  const p = trainingPhilosophy;

  return (
    <section id="philosophy" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-brand-peach/5 to-background" />

      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-coral/10 text-brand-coral text-sm font-medium mb-4">
            Our Philosophy
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Train <span className="gradient-text">smarter</span>, not just harder
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {p.summary}
          </p>
        </motion.div>

        {/* Core philosophy with image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ImagePlaceholder
              aspectRatio="square"
              label="Acro training photo"
              className="max-w-lg mx-auto lg:mx-0"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Why supplemental training matters
            </h3>
            {p.corePhilosophy.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>

        {/* Role-specific priorities */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Base priorities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-brand-navy/5 to-brand-navy/10 border border-brand-navy/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-brand-navy text-white">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">{p.basePriorities.title}</h4>
                <p className="text-sm text-muted-foreground">{p.basePriorities.description}</p>
              </div>
            </div>
            <ul className="space-y-4">
              {p.basePriorities.priorities.map((priority, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-3"
                >
                  <div className={`mt-1 p-1.5 rounded-lg ${
                    priority.importance === 'critical' 
                      ? 'bg-brand-coral/20 text-brand-coral' 
                      : priority.importance === 'high'
                      ? 'bg-brand-orange/20 text-brand-orange'
                      : 'bg-brand-peach/40 text-brand-navy/60'
                  }`}>
                    {getIcon(priority.name)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{priority.name}</p>
                    <p className="text-sm text-muted-foreground">{priority.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Flyer priorities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-brand-coral/5 to-brand-coral/10 border border-brand-coral/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-brand-coral text-white">
                <Wind className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">{p.flyerPriorities.title}</h4>
                <p className="text-sm text-muted-foreground">{p.flyerPriorities.description}</p>
              </div>
            </div>
            <ul className="space-y-4">
              {p.flyerPriorities.priorities.map((priority, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-3"
                >
                  <div className={`mt-1 p-1.5 rounded-lg ${
                    priority.importance === 'critical' 
                      ? 'bg-brand-coral/20 text-brand-coral' 
                      : priority.importance === 'high'
                      ? 'bg-brand-orange/20 text-brand-orange'
                      : 'bg-brand-peach/40 text-brand-navy/60'
                  }`}>
                    {getIcon(priority.name)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{priority.name}</p>
                    <p className="text-sm text-muted-foreground">{priority.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Safety section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-green-600 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground">{p.safetyPriorities.title}</h4>
              <p className="text-sm text-muted-foreground">{p.safetyPriorities.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Base safety */}
            <div>
              <h5 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-brand-navy" />
                For Bases
              </h5>
              <ul className="space-y-3">
                {p.safetyPriorities.base.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.area}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Flyer safety */}
            <div>
              <h5 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Wind className="h-4 w-4 text-brand-coral" />
                For Flyers
              </h5>
              <ul className="space-y-3">
                {p.safetyPriorities.flyer.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.area}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
