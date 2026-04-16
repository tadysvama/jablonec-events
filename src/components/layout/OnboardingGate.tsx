'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

/**
 * OnboardingGate hlídá, zda je uživatel onboardovaný.
 * Pokud není a není na /onboarding, přesměruje ho tam.
 * Pokud je a je na /onboarding, pustí ho na /.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isOnboarded = useStore((s) => s.isOnboarded);
  const [hydrated, setHydrated] = useState(false);

  // Zjisti, zda se store načetl z localStorage (zabráníme SSR/CSR mismatch)
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isOnboarded && pathname !== '/onboarding') {
      router.replace('/onboarding');
    } else if (isOnboarded && pathname === '/onboarding') {
      router.replace('/');
    }
  }, [hydrated, isOnboarded, pathname, router]);

  // Dokud se nenapustí store z localStorage, ukaž jednoduchý placeholder
  // (jinak by blikla landing page a pak skočila na onboarding)
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 animate-pulse" />
          <div className="text-sm text-ink-muted">Načítám JBC Events...</div>
        </div>
      </div>
    );
  }

  // Pokud je neonboardovaný a nejsme na /onboarding, neukazuj nic (redirect proběhne)
  if (!isOnboarded && pathname !== '/onboarding') {
    return null;
  }

  return <>{children}</>;
}
