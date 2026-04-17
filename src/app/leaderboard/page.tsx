'use client';

import { Trophy, TrendingUp, Clock } from 'lucide-react';
import { MOCK_LEAGUE } from '@/data/users';
import { LEAGUE_META } from '@/lib/types';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

export default function LeaderboardPage() {
  const profile = useStore((s) => s.profile);
  const earnedPoints = useStore((s) => s.earnedPoints);

  if (!profile) return null;

  // Nahradíme původní "me" položku v mock lize za reálný profil
  // a přepočítáme pozici podle nasbíraných bodů
  const myLeaguePoints = Math.max(0, earnedPoints); // záporné neukazujeme
  const myLeague = 'bronze'; // nový uživatel začíná v bronzu

  // Odfiltrujeme původní Terezu a vložíme skutečného uživatele
  const others = MOCK_LEAGUE.filter((e) => !e.isMe);

  // Seřazení podle bodů (sestupně), s přidáním uživatele
  const combined = [
    ...others.map((e) => ({ ...e, isMe: false })),
    {
      userId: profile.id,
      username: profile.username,
      name: profile.name,
      avatarUrl: '',
      leaguePoints: myLeaguePoints,
      currentLeague: myLeague as any,
      position: 0,
      isMe: true,
    },
  ]
    .sort((a, b) => b.leaguePoints - a.leaguePoints)
    .map((entry, i) => ({ ...entry, position: i + 1 }));

  const myEntry = combined.find((e) => e.isMe)!;
  const league = LEAGUE_META[myLeague];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-10">
      <div className="mb-5 md:mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-1 md:mb-2">Liga</h1>
        <p className="text-sm text-ink-muted">
          Každý týden soutěžíš s dalšími 9 lidmi. Top 3 postupují, spodní 3 klesají.
        </p>
      </div>

      <div
        className={cn(
          'relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-8 mb-5 md:mb-6 text-white bg-gradient-to-br shadow-xl',
          league.bg
        )}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="relative grid md:grid-cols-[1fr,auto] gap-4 md:gap-6 items-center">
          <div>
            <div className="text-xs md:text-sm font-medium opacity-90 mb-1">Tvoje pozice tento týden</div>
            <div className="flex items-baseline gap-2 mb-2 md:mb-3">
              <span className="font-display text-4xl md:text-6xl font-bold">
                {myEntry.position}.
              </span>
              <span className="text-base md:text-xl opacity-80">místo</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="font-semibold">{myEntry.leaguePoints} bodů</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="font-semibold">3 dny zbývají</span>
              </div>
            </div>
          </div>
          <div className="text-center hidden md:block">
            <div className="text-7xl md:text-8xl mb-2">{league.icon}</div>
            <div className="font-display font-bold text-lg">{league.label}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 md:mb-6">
        <div className="card p-3 md:p-4 border-streak-500/30">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-streak-100 dark:bg-streak-500/20 flex items-center justify-center text-lg md:text-xl">
              🚀
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] md:text-xs text-ink-muted">Zóna postupu</div>
              <div className="font-semibold text-xs md:text-sm">Top 3 pozice</div>
            </div>
          </div>
        </div>
        <div className="card p-3 md:p-4 border-accent-500/30">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent-100 dark:bg-accent-500/20 flex items-center justify-center text-lg md:text-xl">
              ⚠️
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] md:text-xs text-ink-muted">Zóna sestupu</div>
              <div className="font-semibold text-xs md:text-sm">Spodní 3 pozice</div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-xs md:text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">
          Top 10 · tento týden
        </h2>
        <div className="card overflow-hidden">
          {combined.slice(0, 10).map((entry) => {
            const medal =
              entry.position === 1
                ? '🥇'
                : entry.position === 2
                ? '🥈'
                : entry.position === 3
                ? '🥉'
                : null;
            const isPromotion = entry.position <= 3;
            const isRelegation = entry.position >= 8;
            return (
              <div
                key={entry.userId}
                className={cn(
                  'flex items-center gap-3 px-3 md:px-4 py-3 border-b border-border last:border-b-0 transition-colors',
                  entry.isMe && 'bg-brand-50 dark:bg-brand-950',
                  !entry.isMe && 'hover:bg-surface-muted'
                )}
              >
                <div
                  className={cn(
                    'w-8 text-center font-bold',
                    medal
                      ? 'text-xl md:text-2xl'
                      : isPromotion
                      ? 'text-streak-600'
                      : isRelegation
                      ? 'text-accent-600'
                      : 'text-ink-muted'
                  )}
                >
                  {medal || entry.position}
                </div>
                <Avatar name={entry.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate flex items-center gap-2 text-sm md:text-base">
                    {entry.name}
                    {entry.isMe && <span className="chip-brand text-[10px]">Ty</span>}
                  </div>
                  <div className="text-[11px] md:text-xs text-ink-muted">@{entry.username}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm md:text-base">{entry.leaguePoints}</div>
                  <div className="text-[10px] text-ink-muted uppercase tracking-wider">bodů</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 md:mt-8">
        <h2 className="text-xs md:text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">
          Všechny ligy
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {(Object.entries(LEAGUE_META) as [keyof typeof LEAGUE_META, typeof LEAGUE_META[keyof typeof LEAGUE_META]][]).map(
            ([key, meta]) => {
              const isCurrent = key === myLeague;
              return (
                <div
                  key={key}
                  className={cn('card p-3 md:p-4 text-center', isCurrent && 'ring-2 ring-brand-500')}
                >
                  <div className="text-3xl md:text-4xl mb-2">{meta.icon}</div>
                  <div className="font-semibold text-xs md:text-sm">{meta.label}</div>
                  {isCurrent && <div className="text-[10px] md:text-xs text-brand-600 mt-1">Aktuální</div>}
                </div>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}
