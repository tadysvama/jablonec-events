import type { Metadata } from 'next';
import { Manrope, Fraunces } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { OnboardingGate } from '@/components/layout/OnboardingGate';

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'WONK'],
});

export const metadata: Metadata = {
  title: 'JBC Events – Žij Jablonec naplno',
  description:
    'Komunitní aplikace pro kulturní a sportovní akce v Jablonci nad Nisou. Sbírej body, buduj streaky, objevuj nová místa.',
  openGraph: {
    title: 'JBC Events',
    description: 'Gamifikovaný kulturní a sportovní život v Jablonci',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={`${manrope.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <OnboardingGate>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </OnboardingGate>
        </ThemeProvider>
      </body>
    </html>
  );
}
