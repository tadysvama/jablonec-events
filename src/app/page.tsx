'use client';

import { useMemo, useState } from 'react';
import { Search, Zap, Flame, TrendingUp } from 'lucide-react';
import { MOCK_EVENTS, filterEvents } from '@/data/events';
import { CURRENT_USER } from '@/data/users';
import { CATEGORY_LABELS, EventCategory } from '@/lib/types';
import { EventCard } from '@/components/events/EventCard';
import { recommendEvents } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

type SortBy = 'recommended' | 'date' | 'popularity' | 'points';

export default function HomePage() {
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('recommended');
  const earnedPoints = useStore((s) => s.earnedPoints);
  const totalPoints = CURRENT_USER.totalPoints + earnedPoints;

  const events = useMemo(() => {
    if (sortBy === 'recommended') {
      const recommended = recommendEvents(MOCK_EVENTS, CURRENT_USER, ['concert', 'concert', 'sport', 'festival']);
      return filterEvents(recommended, { category, search });
    }
    return filterEvents(MOCK_EVENTS, { category, search, sortBy: sortBy as 'date' | 'popularity' | 'points' });
  }, [category, search, sortBy]);

  const featured = events[0];
  const rest = events.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-10">
      {/* Hero – kompaktnější na mobilu */}
      <section className="mb-5 md:mb-8">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-5 md:p-8 text-white shadow-xl shadow-brand-500/20">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative grid md:grid-cols-[1fr,auto] gap-4 md:gap-6 items-center">
            <div>
              <div className="text-xs md:text-sm font-medium opacity-90 mb-1 md:mb-2">
                Ahoj, {CURRENT_USER.name.split(' ')[0]} 👋
              </div>
              <h1 className="text-2xl md:text-4xl font-display font-bold mb-3 leading-tight">
                Co se děje v Jablonci
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 md:gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <Flame className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="font-semibold">{CURRENT_USER.currentStreak} týdnů</span>
                </div>
                <div className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="font-semibold">{totalPoints.toLocaleString('cs-CZ')} b.</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  🥈 <span className="font-semibold">Stříbrná · 5.</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block text-6xl md:text-8xl opacity-80">🎉</div>
          </div>
        </div>
      </section>

      {/* Search & filtry */}
      <section className="mb-5 md:mb-6">
        <div className="relative mb-3 md:mb-4">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            type="text"
            placeholder="Hledej akci, místo..."
            className="input pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {(['all', ...Object.keys(CATEGORY_LABELS)] as const).map((cat) => {
            const meta = cat === 'all' ? { cs: 'Vše', emoji: '✨' } : CATEGORY_LABELS[cat as EventCategory];
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                  active
                    ? 'bg-ink text-surface border-ink'
                    : 'bg-surface-elevated border-border hover:border-brand-400 text-ink-muted'
                )}
              >
                <span>{meta.emoji}</span>
                {meta.cs}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            { id: 'recommended', label: 'Pro tebe', icon: TrendingUp },
            { id: 'date', label: 'Nejbližší', icon: null },
            { id: 'popularity', label: 'Populární', icon: null },
            { id: 'points', label: 'Nejvíc bodů', icon: Zap },
          ].map((opt) => {
            const Icon = opt.icon;
            const active = sortBy === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id as SortBy)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  active
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    : 'text-ink-muted hover:bg-surface-muted'
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        {events.length === 0 ? (
          <div className="text-center py-20 text-ink-muted">
            <div className="text-5xl mb-4">🔍</div>
            <p>Nenašly se žádné akce odpovídající filtru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {featured && <EventCard event={featured} variant="featured" />}
            {rest.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
