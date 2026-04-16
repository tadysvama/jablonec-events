'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Flame, Zap, Trophy, MapPin, Settings, Share2, Edit3, Lock, Bell, Moon, Calendar, LogOut, Trash2,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { MOCK_BADGES } from '@/data/users';
import { MOCK_EVENTS } from '@/data/events';
import { CATEGORY_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

function formatHistoryDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const months = [
    'ledna', 'února', 'března', 'dubna', 'května', 'června',
    'července', 'srpna', 'září', 'října', 'listopadu', 'prosince',
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const time = d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  return `${day}. ${month} ${year} · ${time}`;
}

function formatCreatedAt(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const months = [
    'ledna', 'února', 'března', 'dubna', 'května', 'června',
    'července', 'srpna', 'září', 'října', 'listopadu', 'prosince',
  ];
  return `${day}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatAgeGroup(age: string): string {
  if (!age) return '—';
  return age + (age === '60+' ? ' let' : ' let');
}

function formatGender(g: string): string {
  const map: Record<string, string> = {
    female: 'Žena',
    male: 'Muž',
    other: 'Jiné',
    prefer_not_to_say: 'Neuvádím',
  };
  return map[g] || '—';
}

export default function ProfilePage() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const earnedPoints = useStore((s) => s.earnedPoints);
  const checkins = useStore((s) => s.checkins);
  const claimedRewards = useStore((s) => s.claimedRewards);
  const reset = useStore((s) => s.reset);
  const [tab, setTab] = useState<'overview' | 'history' | 'badges' | 'settings'>('overview');

  if (!profile) return null;

  // Skutečná historie z checkinů (navštívené akce)
  const attendedEventIds = Object.keys(checkins).filter((id) => checkins[id] === 'attended');
  const history = attendedEventIds
    .map((id) => MOCK_EVENTS.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => !!e)
    .map((e) => ({ ...e, attendedAt: new Date().toISOString() })) // v prototypu nezaznamenáváme přesný čas
    .sort((a, b) => new Date(b.attendedAt).getTime() - new Date(a.attendedAt).getTime());

  const stats = {
    totalPoints: earnedPoints,
    eventsAttended: attendedEventIds.length,
    interests: profile.interests.length,
    rewardsClaimed: claimedRewards.size,
  };

  const handleLogout = () => {
    if (confirm('Opravdu se chceš odhlásit? Všechna data na tomto zařízení budou smazána.')) {
      reset();
      router.push('/onboarding');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-10">
      {/* Profile header */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl mb-5 md:mb-6">
        <div className="bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-5 md:p-8 text-white">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="relative flex flex-col sm:flex-row gap-4 md:gap-5 items-start sm:items-center">
            <Avatar
              name={profile.name}
              size="2xl"
              className="!w-20 !h-20 md:!w-24 md:!h-24 !text-2xl md:!text-3xl ring-4 ring-white/30 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl md:text-3xl font-bold leading-tight">
                {profile.name}
              </h1>
              <div className="text-xs md:text-sm opacity-80 mb-1 md:mb-2">@{profile.username}</div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[11px] md:text-xs">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.city}
                </span>
                <span>Od {formatCreatedAt(profile.createdAt)}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => router.push('/onboarding')}
                className="btn-secondary !bg-white/20 !border-white/30 !text-white flex-1 sm:flex-initial text-xs md:text-sm"
              >
                <Edit3 className="w-3.5 h-3.5" /> Upravit
              </button>
              <button className="btn-secondary !bg-white/20 !border-white/30 !text-white flex-shrink-0">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-5 md:mb-6">
        <div className="card p-3 md:p-4">
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">
            <Zap className="w-3 h-3 text-brand-600" /> Body
          </div>
          <div className="text-xl md:text-2xl font-display font-bold">
            {stats.totalPoints.toLocaleString('cs-CZ')}
          </div>
        </div>
        <div className="card p-3 md:p-4">
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">
            <Flame className="w-3 h-3 text-flame-500" /> Streak
          </div>
          <div className="text-xl md:text-2xl font-display font-bold">🔥 0</div>
          <div className="text-[10px] md:text-xs text-ink-muted">týdnů · začátečník</div>
        </div>
        <div className="card p-3 md:p-4">
          <div className="text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">
            Akcí
          </div>
          <div className="text-xl md:text-2xl font-display font-bold">{stats.eventsAttended}</div>
        </div>
        <div className="card p-3 md:p-4">
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">
            <Trophy className="w-3 h-3 text-amber-500" /> Odznaků
          </div>
          <div className="text-xl md:text-2xl font-display font-bold">0/{MOCK_BADGES.length}</div>
        </div>
      </div>

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
          <div className="card p-4 md:p-5">
            <h3 className="font-display text-base md:text-lg font-bold mb-3">O mně</h3>
            <div className="space-y-2 text-sm">
              <Row label="Věk" value={formatAgeGroup(profile.ageGroup)} />
              <Row label="Pohlaví" value={formatGender(profile.gender)} />
              <Row label="Bydliště" value={profile.city} />
            </div>
          </div>

          <div className="card p-4 md:p-5">
            <h3 className="font-display text-base md:text-lg font-bold mb-3">Moje zájmy</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((cat) => {
                const meta = CATEGORY_LABELS[cat];
                return (
                  <span
                    key={cat}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r',
                      meta.color
                    )}
                  >
                    <span>{meta.emoji}</span>
                    {meta.cs}
                  </span>
                );
              })}
            </div>
            <button
              onClick={() => router.push('/onboarding')}
              className="btn-ghost mt-3 text-xs"
            >
              <Edit3 className="w-3 h-3" /> Změnit zájmy
            </button>
          </div>

          {stats.eventsAttended === 0 && (
            <div className="card p-4 md:p-5 border-dashed text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold mb-1">Ještě jsi nenavštívil(a) žádnou akci</div>
              <div className="text-sm text-ink-muted">
                Projdi si akce, přidej se a na místě naskenuj QR kód – získáš body a odznaky.
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'badges' && (
        <div>
          <div className="card p-4 md:p-5 border-dashed text-center mb-4">
            <div className="text-3xl mb-2">🔒</div>
            <div className="font-semibold mb-1">Zatím žádné odznaky</div>
            <div className="text-sm text-ink-muted">
              Plň výzvy a navštěvuj akce, abys je odemykal(a).
            </div>
          </div>
          <h3 className="text-xs md:text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">
            Možné odznaky · {MOCK_BADGES.length}
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
            {MOCK_BADGES.map((b) => (
              <div key={b.id} className="card p-3 md:p-4 text-center opacity-50">
                <div className="text-3xl md:text-4xl mb-2 grayscale">🔒</div>
                <div className="text-xs md:text-sm font-semibold leading-tight">{b.name}</div>
                <div className="text-[10px] md:text-xs text-ink-muted capitalize mt-1">
                  {b.tier}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-ink-muted mb-3">
            <Calendar className="w-4 h-4" />
            {history.length === 0
              ? 'Zatím žádné navštívené akce'
              : `Seřazeno od nejnovější · ${history.length} akcí`}
          </div>
          {history.length === 0 ? (
            <div className="card p-8 text-center border-dashed">
              <div className="text-4xl mb-3">📅</div>
              <div className="font-semibold mb-1">Tady se objeví tvá účast</div>
              <div className="text-sm text-ink-muted">
                Po potvrzení účasti na akci (QR scan) se záznam uloží sem.
              </div>
            </div>
          ) : (
            <div className="grid gap-2 md:gap-3">
              {history.map((e) => {
                const meta = CATEGORY_LABELS[e.category];
                return (
                  <div
                    key={`${e.id}-${e.attendedAt}`}
                    className="card p-3 md:p-4 flex items-center gap-3 md:gap-4"
                  >
                    <div
                      className={cn(
                        'w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg md:text-xl flex-shrink-0',
                        meta.color
                      )}
                    >
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
                      <div className="font-bold text-brand-600 text-sm md:text-base">
                        +{e.basePoints}
                      </div>
                      <div className="text-[9px] md:text-[10px] text-ink-muted uppercase">
                        bodů
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div className="card divide-y divide-border">
          <SettingsRow icon={Lock} label="Režim soukromí" value="Jen přátelé" />
          <SettingsRow icon={Bell} label="Upozornění" value="Zapnuto" />
          <SettingsRow icon={Moon} label="Motiv" value="Systémový" />
          <SettingsRow icon={Settings} label="Jazyk" value="Čeština" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 md:p-4 hover:bg-accent-50 dark:hover:bg-accent-950/30 transition-colors text-left text-accent-600"
          >
            <Trash2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-sm">Smazat profil a odhlásit</div>
              <div className="text-[11px] md:text-xs opacity-80">
                Smaže všechna data na tomto zařízení a spustí onboarding znovu.
              </div>
            </div>
          </button>
          <div className="p-4 text-ink-subtle text-xs">Verze 0.3.0 · Prototyp</div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-muted flex-shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
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
