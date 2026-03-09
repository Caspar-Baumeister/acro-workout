import { Hero, HowItWorks, Philosophy, About, Benefits, Personalization, FAQ, FinalCTA } from '@/components/landing';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <Philosophy />
      <About />
      <Benefits />
      <Personalization />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
