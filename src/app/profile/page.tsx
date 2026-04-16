'use client';

import { useMemo, useState } from 'react';
import { Flame, Zap, Trophy, MapPin, Settings, Share2, Edit3, Lock, Bell, Moon, Calendar } from 'lucide-react';
import { CURRENT_USER, MOCK_BADGES } from '@/data/users';
import { MOCK_EVENTS } from '@/data/events';
import { CATEGORY_LABELS, LEAGUE_META } from '@/lib/types';
import { cn } from '@/lib/utils';

// Historie s reálnými roky – smíšeně 2025-2026
const HISTORY_ENTRIES: Array<{ eventId: string; attendedAt: string }> = [
  { eventId: 'evt_001', attendedAt: '2026-04-05T16:00:00Z' },
  { eventId: 'evt_002', attendedAt: '2026-03-30T19:00:00Z' },
  { eventId: 'evt_004', attendedAt: '2026-03-18T14:00:00Z' },
  { eventId: 'evt_006', attendedAt: '2026-02-14T17:30:00Z' },
  { eventId: 'evt_008', attendedAt: '2026-01-25T11:00:00Z' },
  { eventId: 'evt_010', attendedAt: '2025-12-18T19:00:00Z' },
  { eventId: 'evt_011', attendedAt: '2025-11-22T20:00:00Z' },
  { eventId: 'evt_015', attendedAt: '2025-10-12T18:00:00Z' },
];

function formatHistoryDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const months = ['ledna', 'února', 'března', 'dubna', 'května', 'června',
                  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const time = d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  return `${day}. ${month} ${year} · ${time}`;
}

export default function ProfilePage() {
  const [tab, setTab] = useState<'overview' | 'history' | 'badges' | 'settings'>('overview');

  const earnedBadges = MOCK_BADGES.filter((b) => b.earned);
  const lockedBadges = MOCK_BADGES.filter((b) => !b.earned);
  const league = LEAGUE_META[CURRENT_USER.currentLeague];

  // Historie seřazená od nejnovější po nejstarší
  const history = useMemo(() => {
    return HISTORY_ENTRIES
      .map((h) => {
        const event = MOCK_EVENTS.find((e) => e.id === h.eventId);
        return event ? { ...event, attendedAt: h.attendedAt } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => new Date(b.attendedAt).getTime() - new Date(a.attendedAt).getTime());
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-10">
      {/* Profile header – kompaktnější na mobilu */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl mb-5 md:mb-6">
        <div className={cn('bg-gradient-to-br p-5 md:p-8 text-white', league.bg)}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="relative flex flex-col sm:flex-row gap-4 md:gap-5 items-start sm:items-center">
            <div className="relative flex-shrink-0">
              <img
                src={CURRENT_USER.avatarUrl}
                alt={CURRENT_USER.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-lg md:text-xl shadow-lg">
                {league.icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl md:text-3xl font-bold leading-tight">{CURRENT_USER.name}</h1>
              <div className="text-xs md:text-sm opacity-80 mb-1 md:mb-2">@{CURRENT_USER.username}</div>
              {CURRENT_USER.bio && <p className="text-xs md:text-sm opacity-90 mb-2">{CURRENT_USER.bio}</p>}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[11px] md:text-xs">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{CURRENT_USER.city}</span>
                <span>Od 15. září 2025</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
              <button className="btn-secondary !bg-white/20 !border-white/30 !text-white flex-1 sm:flex-initial text-xs md:text-sm">
                <Edit3 className="w-3.5 h-3.5" /> Upravit
              </button>
              <button className="btn-secondary !bg-white/20 !border-white/30 !text-white flex-shrink-0">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main stats – vždy viditelné 4 sloupce, menší na mobilu */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-5 md:mb-6">
        <div className="card p-3 md:p-4">
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">
            <Zap className="w-3 h-3 text-brand-600" /> Body
          </div>
          <div className="text-xl md:text-2xl font-display font-bold">{CURRENT_USER.totalPoints.toLocaleString('cs-CZ')}</div>
        </div>
        <div className="card p-3 md:p-4">
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">
            <Flame className="w-3 h-3 text-flame-500" /> Streak
          </div>
          <div className="text-xl md:text-2xl font-display font-bold">🔥 {CURRENT_USER.currentStreak}</div>
          <div className="text-[10px] md:text-xs text-ink-muted">týdnů · rekord {CURRENT_USER.longestStreak}</div>
        </div>
        <div className="card p-3 md:p-4">
          <div className="text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">Akcí</div>
          <div className="text-xl md:text-2xl font-display font-bold">{CURRENT_USER.stats.eventsAttended}</div>
        </div>
        <div className="card p-3 md:p-4">
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">
            <Trophy className="w-3 h-3 text-amber-500" /> Odznaků
          </div>
          <div className="text-xl md:text-2xl font-display font-bold">{earnedBadges.length}/{MOCK_BADGES.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-muted rounded-full w-fit mb-5 overflow-x-auto max-w-full">
        {[
          { id: 'overview', label: 'Přehled' },
          { id: 'badges', label: 'Odznaky' },
          { id: 'history', label: 'Historie' },
          { id: 'settings', label: 'Nastavení' },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={cn(
                'px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all',
                active ? 'bg-surface-elevated text-ink shadow-sm' : 'text-ink-muted'
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'overview' && (
        <div className="grid gap-4 md:gap-6">
          {/* Týdenní streak detail */}
          <div className="card p-4 md:p-5">
            <h3 className="font-display text-base md:text-lg font-bold mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-flame-500 flame-glow" /> Týdenní streak
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl md:text-6xl animate-flame-flicker">🔥</div>
              <div>
                <div className="text-2xl md:text-3xl font-display font-bold">{CURRENT_USER.currentStreak} týdnů</div>
                <div className="text-xs md:text-sm text-ink-muted">V tomto týdnu jsi už byl(a) na akci ✓</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm flex-wrap">
              <span className="chip bg-surface-muted">🧊 {CURRENT_USER.streakFreezes} streak freezů</span>
              <span className="text-ink-muted">užij je, když tento týden nebudeš moct</span>
            </div>
          </div>

          {/* Top kategorie */}
          <div className="card p-4 md:p-5">
            <h3 className="font-display text-base md:text-lg font-bold mb-3">Nejnavštěvovanější kategorie</h3>
            <div className="space-y-3">
              {[
                { cat: 'concert', count: 8 },
                { cat: 'sport', count: 6 },
                { cat: 'festival', count: 4 },
                { cat: 'theatre', count: 3 },
              ].map((item) => {
                const meta = CATEGORY_LABELS[item.cat as keyof typeof CATEGORY_LABELS];
                const max = 8;
                return (
                  <div key={item.cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <span>{meta.emoji}</span>
                        <span className="font-medium">{meta.cs}</span>
                      </span>
                      <span className="text-ink-muted">{item.count}×</span>
                    </div>
                    <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full bg-gradient-to-r', meta.color)}
                        style={{ width: `${(item.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'badges' && (
        <div className="space-y-5 md:space-y-6">
          <div>
            <h3 className="text-xs md:text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">
              Získané · {earnedBadges.length}
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
              {earnedBadges.map((b) => (
                <div key={b.id} className="card p-3 md:p-4 text-center hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl mb-2">{b.icon}</div>
                  <div className="text-xs md:text-sm font-semibold leading-tight">{b.name}</div>
                  <div className="text-[10px] md:text-xs text-ink-muted capitalize mt-1">{b.tier}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">
              Zamčené · {lockedBadges.length}
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
              {lockedBadges.map((b) => (
                <div key={b.id} className="card p-3 md:p-4 text-center opacity-50">
                  <div className="text-3xl md:text-4xl mb-2 grayscale">🔒</div>
                  <div className="text-xs md:text-sm font-semibold leading-tight">{b.name}</div>
                  {b.progress !== undefined && b.target !== undefined && (
                    <div className="mt-2 h-1 bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500"
                        style={{ width: `${(b.progress / b.target) * 100}%` }}
                      />
                    </div>
                  )}
                  {b.progress !== undefined && (
                    <div className="text-[10px] text-ink-muted mt-1">
                      {b.progress} / {b.target}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-ink-muted mb-3">
            <Calendar className="w-4 h-4" />
            Seřazeno od nejnovější · {history.length} akcí
          </div>
          <div className="grid gap-2 md:gap-3">
            {history.map((e) => {
              const meta = CATEGORY_LABELS[e.category];
              return (
                <div key={`${e.id}-${e.attendedAt}`} className="card p-3 md:p-4 flex items-center gap-3 md:gap-4">
                  <div className={cn('w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg md:text-xl flex-shrink-0', meta.color)}>
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm md:text-base truncate">{e.title}</div>
                    <div className="text-[11px] md:text-xs text-ink-muted">
                      {formatHistoryDate(e.attendedAt)}
                    </div>
                    <div className="text-[11px] md:text-xs text-ink-muted truncate">
                      {e.location}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-brand-600 text-sm md:text-base">+{e.basePoints}</div>
                    <div className="text-[9px] md:text-[10px] text-ink-muted uppercase">bodů</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="card divide-y divide-border">
          <SettingsRow icon={Lock} label="Režim soukromí" value="Jen přátelé" />
          <SettingsRow icon={Bell} label="Upozornění" value="Zapnuto" />
          <SettingsRow icon={Moon} label="Motiv" value="Systémový" />
          <SettingsRow icon={Settings} label="Jazyk" value="Čeština" />
          <div className="p-4 text-accent-600 font-medium text-sm">Odhlásit se</div>
          <div className="p-4 text-ink-subtle text-xs">Verze 0.2.0 · Prototyp</div>
        </div>
      )}
    </div>
  );
}

function SettingsRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-3 md:p-4 hover:bg-surface-muted transition-colors text-left">
      <Icon className="w-4 h-4 md:w-5 md:h-5 text-ink-muted flex-shrink-0" />
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
      </div>
      <div className="text-xs md:text-sm text-ink-muted">{value}</div>
    </button>
  );
}
