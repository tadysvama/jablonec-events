'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Flame, Trophy, Target, Check, Trash2, Calendar, Share2, MessageCircle,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { MOCK_FRIENDS } from '@/data/users';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

function formatCreatedDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const months = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
  return `${day}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function weeksLabel(n: number): string {
  if (n === 1) return 'týden';
  if (n < 5) return 'týdny';
  return 'týdnů';
}

export default function BuddyStreakDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const buddyStreaks = useStore((s) => s.buddyStreaks);
  const completeBuddyStreakThisWeek = useStore((s) => s.completeBuddyStreakThisWeek);
  const removeBuddyStreak = useStore((s) => s.removeBuddyStreak);
  const showToast = useStore((s) => s.showToast);
  const addPoints = useStore((s) => s.addPoints);

  const streak = buddyStreaks.find((bs) => bs.id === params.id);
  const friend = streak ? MOCK_FRIENDS.find((f) => f.id === streak.friendId) : null;

  if (!streak || !friend || !profile) return notFound();

  const handleMarkComplete = () => {
    if (streak.completedThisWeek) {
      showToast({ title: 'Tento týden už máš splněný', icon: 'ℹ️' });
      return;
    }
    completeBuddyStreakThisWeek(streak.id);
    addPoints(50); // bonus za plnění společného streaku
    showToast({
      title: `🔥 Týden splněn! +50 b.`,
      body: `Streak s ${friend.name} teď na ${streak.currentWeeks + 1} ${weeksLabel(streak.currentWeeks + 1)}`,
      icon: '✓',
    });
  };

  const handleEnd = () => {
    if (!confirm(`Opravdu ukončit streak s ${friend.name}? Rekord ${streak.longestWeeks}t zůstane v historii, ale aktuální série se resetuje.`)) {
      return;
    }
    removeBuddyStreak(streak.id);
    showToast({ title: 'Streak ukončen', icon: '👋' });
    router.push('/friends');
  };

  // Vygeneruj mřížku posledních 12 týdnů
  const weekGrid = Array.from({ length: 12 }, (_, i) => {
    const weeksAgo = 11 - i;
    return {
      weekNum: weeksAgo,
      completed: weeksAgo < streak.currentWeeks,
      current: weeksAgo === 0,
    };
  });

  // Příští milestone
  const nextMilestone = streak.currentWeeks < 4 ? 4 :
    streak.currentWeeks < 12 ? 12 :
    streak.currentWeeks < 26 ? 26 :
    streak.currentWeeks < 52 ? 52 : 100;
  const progressToMilestone = Math.min(100, (streak.currentWeeks / nextMilestone) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-10">
      <button
        onClick={() => router.back()}
        className="mb-3 md:mb-4 flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Zpět na přátele
      </button>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl mb-5 md:mb-6 bg-gradient-to-br from-flame-500 via-flame-600 to-accent-500 text-white p-5 md:p-8 shadow-xl shadow-flame-500/30">
        <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          {/* Avatars */}
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <Avatar name={profile.name} size="xl" className="!w-14 !h-14 md:!w-16 md:!h-16 ring-4 ring-white/30" />
            <div className="text-3xl md:text-4xl animate-pulse-soft">🔥</div>
            <Avatar name={friend.name} size="xl" className="!w-14 !h-14 md:!w-16 md:!h-16 ring-4 ring-white/30" />
          </div>

          <div className="text-xs md:text-sm font-medium opacity-90 uppercase tracking-wider mb-1">
            Společný streak
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold mb-1">
            {profile.name.split(' ')[0]} &amp; {friend.name.split(' ')[0]}
          </h1>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-display text-5xl md:text-7xl font-bold">
              {streak.currentWeeks}
            </span>
            <span className="text-lg md:text-xl opacity-90">
              {weeksLabel(streak.currentWeeks)} v kuse
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
              <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="font-semibold">Rekord {streak.longestWeeks}t</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="font-semibold">Od {formatCreatedDate(streak.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status tohoto týdne */}
      {streak.completedThisWeek ? (
        <div className="card p-4 md:p-5 mb-5 border-streak-500 bg-streak-50 dark:bg-streak-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-streak-500 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-streak-700 dark:text-streak-400">
                Tento týden splněno! 🎉
              </div>
              <div className="text-xs md:text-sm text-ink-muted">
                Super práce. Streak pokračuje dál. Další týden začne v pondělí.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-4 md:p-5 mb-5 border-flame-500/30 bg-flame-50 dark:bg-flame-500/5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-flame-500 flex items-center justify-center flex-shrink-0 animate-pulse-soft">
              <Flame className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Tento týden ještě nesplněno</div>
              <div className="text-xs md:text-sm text-ink-muted">
                {streak.goal
                  ? `Cíl: ${streak.goal}. Navštivte spolu akci nebo klikněte níže až budete ready.`
                  : 'Navštivte spolu akci nebo klikněte níže, až budete ready.'}
              </div>
            </div>
          </div>
          <button
            onClick={handleMarkComplete}
            className="btn-primary w-full justify-center !bg-gradient-to-r !from-flame-500 !to-accent-500 hover:!from-flame-600 hover:!to-accent-600"
          >
            <Check className="w-4 h-4" /> Označit tento týden jako splněný (+50 b.)
          </button>
        </div>
      )}

      {/* Cíl */}
      {streak.goal && (
        <div className="card p-4 md:p-5 mb-5">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-brand-600" />
            <h3 className="font-display font-bold">Společný cíl</h3>
          </div>
          <p className="text-sm text-ink-muted">{streak.goal}</p>
        </div>
      )}

      {/* Pokrok k milestone */}
      <div className="card p-4 md:p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold">Další cíl</h3>
          </div>
          <span className="text-sm font-bold text-ink-muted">
            {streak.currentWeeks} / {nextMilestone}t
          </span>
        </div>
        <div className="h-3 bg-surface-muted rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-flame-500 to-accent-500 rounded-full transition-all duration-700"
            style={{ width: `${progressToMilestone}%` }}
          />
        </div>
        <div className="text-xs text-ink-muted">
          {nextMilestone === 4 && 'Dosáhnete měsíčního odznaku 🥉'}
          {nextMilestone === 12 && 'Dosáhnete kvartálního odznaku 🥈'}
          {nextMilestone === 26 && 'Dosáhnete půlročního odznaku 🥇'}
          {nextMilestone === 52 && 'Dosáhnete ročního odznaku 💎'}
          {nextMilestone === 100 && 'Dosáhnete legendárního odznaku 👑'}
        </div>
      </div>

      {/* Historie týdnů */}
      <div className="card p-4 md:p-5 mb-5">
        <h3 className="font-display font-bold mb-3">Posledních 12 týdnů</h3>
        <div className="grid grid-cols-12 gap-1 md:gap-2">
          {weekGrid.map((w, i) => (
            <div
              key={i}
              className={cn(
                'aspect-square rounded-md md:rounded-lg flex items-center justify-center text-[10px] md:text-xs font-bold',
                w.completed && !w.current && 'bg-gradient-to-br from-flame-500 to-accent-500 text-white',
                w.completed && w.current && 'bg-gradient-to-br from-flame-500 to-accent-500 text-white ring-2 ring-flame-500 ring-offset-2 ring-offset-surface-elevated',
                !w.completed && !w.current && 'bg-surface-muted text-ink-subtle',
                !w.completed && w.current && 'bg-surface-muted ring-2 ring-flame-500 ring-offset-2 ring-offset-surface-elevated text-ink-subtle'
              )}
              title={w.current ? 'Tento týden' : `Před ${w.weekNum} týdny`}
            >
              {w.completed ? '✓' : w.current ? '⏳' : ''}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] md:text-xs text-ink-muted">
          <span>Před 11 týdny</span>
          <span>Tento týden</span>
        </div>
      </div>

      {/* Akce */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <button className="btn-secondary justify-center">
          <MessageCircle className="w-4 h-4" /> Zpráva
        </button>
        <button className="btn-secondary justify-center">
          <Share2 className="w-4 h-4" /> Sdílet
        </button>
        <button
          onClick={handleEnd}
          className="btn-ghost justify-center !text-accent-600 hover:!bg-accent-50 dark:hover:!bg-accent-950/30 col-span-2 md:col-span-1"
        >
          <Trash2 className="w-4 h-4" /> Ukončit streak
        </button>
      </div>

      {/* Tip */}
      <div className="card p-4 md:p-5 mt-5 border-dashed">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="text-sm">
            <div className="font-semibold mb-1">Jak streak funguje</div>
            <div className="text-ink-muted">
              Každý týden jeden z vás označí jako splněný. Pokud to někdo z vás
              nestihne, streak se resetuje na 0. Za každý splněný týden dostanete
              bonus 50 bodů navíc. Za milníky (4t, 12t, 26t, 52t) dostanete speciální odznak.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
