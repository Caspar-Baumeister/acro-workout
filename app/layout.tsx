import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Acro Workout | Personalized Partner Acrobatics Training Plans',
  description:
    'Get a tailored partner acrobatics training plan based on your role, experience level, and goals. Free personalized workout delivered to your inbox.',
  keywords: [
    'partner acrobatics',
    'acroyoga',
    'acro training',
    'workout plan',
    'L-base',
    'standing acrobatics',
    'base training',
    'flyer training',
  ],
  openGraph: {
    title: 'Acro Workout | Personalized Partner Acrobatics Training Plans',
    description: 'Get a tailored partner acrobatics training plan based on your role, experience level, and goals.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤸</span>
            <span className="font-semibold text-brand-navy">Acro Workout</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Free personalized training plans for partner acrobatics
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
