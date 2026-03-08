import { Hero, HowItWorks, Benefits, Personalization, FAQ, FinalCTA } from '@/components/landing';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <Benefits />
      <Personalization />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
