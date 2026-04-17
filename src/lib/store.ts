'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CheckinStatus, EventCategory } from './types';

export interface LocalUserProfile {
  id: string;
  name: string;
  username: string;
  ageGroup: string;
  gender: string;
  city: string;
  interests: EventCategory[];
  createdAt: string;
}

// Startovací hodnoty pro prototyp – aby profil nevypadal prázdně
// (při vývoji produktu by to byly 0)
const STARTER_POINTS = 500;
const STARTER_STREAK = 3;

interface UserStore {
  isOnboarded: boolean;
  profile: LocalUserProfile | null;
  completeOnboarding: (profile: Omit<LocalUserProfile, 'id' | 'createdAt'>) => void;

  checkins: Record<string, CheckinStatus>;
  setCheckin: (eventId: string, status: CheckinStatus) => void;
  removeCheckin: (eventId: string) => void;

  likes: Set<string>;
  toggleLike: (eventId: string) => void;

  // Body – startovní hodnota + to, co nasbíráš během session
  earnedPoints: number;
  addPoints: (p: number) => void;
  spendPoints: (p: number) => boolean;

  // Streak v týdnech – pro prototyp statická, v produkci by se počítala z checkinů
  currentStreak: number;

  claimedRewards: Set<string>;
  claimReward: (rewardId: string, cost: number) => boolean;

  lastToast: { id: string; title: string; body?: string; icon?: string } | null;
  showToast: (toast: { title: string; body?: string; icon?: string }) => void;
  clearToast: () => void;

  reset: () => void;
}

function generateDeviceId(): string {
  return (
    'usr_' +
    Math.random().toString(36).substring(2, 11) +
    Date.now().toString(36)
  );
}

export const useStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isOnboarded: false,
      profile: null,
      completeOnboarding: (data) => {
        const existing = get().profile;
        const profile: LocalUserProfile = {
          id: existing?.id ?? generateDeviceId(),
          createdAt: existing?.createdAt ?? new Date().toISOString(),
          ...data,
        };
        set({ profile, isOnboarded: true });

        // Pokud je to první onboarding, přidej startovní bonus
        if (!existing) {
          set({ earnedPoints: STARTER_POINTS, currentStreak: STARTER_STREAK });
        }
      },

      checkins: {},
      setCheckin: (eventId, status) =>
        set((s) => ({ checkins: { ...s.checkins, [eventId]: status } })),
      removeCheckin: (eventId) =>
        set((s) => {
          const next = { ...s.checkins };
          delete next[eventId];
          return { checkins: next };
        }),

      likes: new Set(),
      toggleLike: (eventId) =>
        set((s) => {
          const next = new Set(s.likes);
          if (next.has(eventId)) next.delete(eventId);
          else next.add(eventId);
          return { likes: next };
        }),

      earnedPoints: STARTER_POINTS,
      addPoints: (p) => set((s) => ({ earnedPoints: s.earnedPoints + p })),
      spendPoints: (p) => {
        set((s) => ({ earnedPoints: s.earnedPoints - p }));
        return true;
      },

      currentStreak: STARTER_STREAK,

      claimedRewards: new Set(),
      claimReward: (rewardId, cost) => {
        const { claimedRewards, earnedPoints } = get();
        if (claimedRewards.has(rewardId)) return false;
        if (earnedPoints < cost) return false; // nedostatek bodů
        const next = new Set(claimedRewards);
        next.add(rewardId);
        set({
          claimedRewards: next,
          earnedPoints: earnedPoints - cost,
        });
        return true;
      },

      lastToast: null,
      showToast: (toast) =>
        set({ lastToast: { id: Math.random().toString(36), ...toast } }),
      clearToast: () => set({ lastToast: null }),

      reset: () =>
        set({
          isOnboarded: false,
          profile: null,
          checkins: {},
          likes: new Set(),
          earnedPoints: STARTER_POINTS,
          currentStreak: STARTER_STREAK,
          claimedRewards: new Set(),
        }),
    }),
    {
      name: 'jbc-events-storage',
      partialize: (state) =>
        ({
          isOnboarded: state.isOnboarded,
          profile: state.profile,
          checkins: state.checkins,
          likes: Array.from(state.likes),
          earnedPoints: state.earnedPoints,
          currentStreak: state.currentStreak,
          claimedRewards: Array.from(state.claimedRewards),
        }) as any,
      onRehydrateStorage: () => (state) => {
        if (state) {
          const s = state as any;
          if (Array.isArray(s.likes)) s.likes = new Set(s.likes);
          if (Array.isArray(s.claimedRewards))
            s.claimedRewards = new Set(s.claimedRewards);
        }
      },
    }
  )
);
