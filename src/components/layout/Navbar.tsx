'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Flame, Trophy, Users, User, Zap, Gift } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { CURRENT_USER } from '@/data/users';
import { cn } from '@/lib/utils';

const NAV_ITEMS_DESKTOP = [
  { href: '/', label: 'Akce', icon: Calendar },
  { href: '/challenges', label: 'Výzvy', icon: Zap },
  { href: '/rewards', label: 'Odměny', icon: Gift },
  { href: '/leaderboard', label: 'Liga', icon: Trophy },
  { href: '/friends', label: 'Přátelé', icon: Users },
  { href: '/profile', label: 'Profil', icon: User },
];

const NAV_ITEMS_MOBILE = [
  { href: '/', label: 'Akce', icon: Calendar },
  { href: '/challenges', label: 'Výzvy', icon: Zap },
  { href: '/rewards', label: 'Odměny', icon: Gift },
  { href: '/leaderboard', label: 'Liga', icon: Trophy },
  { href: '/profile', label: 'Profil', icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  if (pathname === '/onboarding') return null;

  return (
    <>
      <header className="sticky top-0 z-40 hidden md:block backdrop-blur-xl bg-surface/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform">
              <span className="text-white font-display font-bold text-lg">J</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-streak-500 rounded-full border-2 border-surface animate-pulse-soft" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-lg tracking-tight">JBC Events</div>
              <div className="text-[10px] uppercase tracking-widest text-ink-muted">Žij Jablonec</div>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS_DESKTOP.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all',
                    active
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-flame-500/10 to-accent-500/10 border border-flame-500/20" title="Týdenní streak">
              <Flame className="w-4 h-4 text-flame-500 flame-glow" />
              <span className="text-sm font-bold">{CURRENT_USER.currentStreak}t</span>
            </div>

            <ThemeToggle />

            <Link href="/profile" className="relative">
              <img
                src={CURRENT_USER.avatarUrl}
                alt={CURRENT_USER.name}
                className="w-9 h-9 rounded-full border-2 border-border hover:border-brand-500 transition-colors"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-surface flex items-center justify-center text-[8px]">
                🥈
              </div>
            </Link>
          </div>
        </div>
      </header>

      <header className="md:hidden sticky top-0 z-40 backdrop-blur-xl bg-surface/80 border-b border-border">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">J</span>
            </div>
            <span className="font-display font-bold">JBC Events</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-flame-500/10 border border-flame-500/20" title="Týdenní streak">
              <Flame className="w-3.5 h-3.5 text-flame-500" />
              <span className="text-xs font-bold">{CURRENT_USER.currentStreak}t</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-elevated border-t border-border safe-area-pb">
        <div className="grid grid-cols-5">
          {NAV_ITEMS_MOBILE.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                  active ? 'text-brand-600' : 'text-ink-muted'
                )}
              >
                <Icon className={cn('w-5 h-5', active && 'stroke-[2.5]')} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
