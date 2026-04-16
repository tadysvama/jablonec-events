'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CheckinStatus, EventCategory } from './types';

// Profil uživatele stažený na tomto zařízení
export interface LocalUserProfile {
  id: string; // persistentní ID tohoto zařízení
  name: string;
  username: string;
  ageGroup: string; // "15-17" | "18-25" | "26-35" | "36-45" | "46-60" | "60+"
  gender: string; // "female" | "male" | "other" | "prefer_not_to_say"
  city: string;
  interests: EventCategory[]; // max 3
  createdAt: string;
}

interface UserStore {
  // Onboarding
  isOnboarded: boolean;
  profile: LocalUserProfile | null;
  completeOnboarding: (profile: Omit<LocalUserProfile, 'id' | 'createdAt'>) => void;

  // Akce
  checkins: Record<string, CheckinStatus>;
  setCheckin: (eventId: string, status: CheckinStatus) => void;
  removeCheckin: (eventId: string) => void;

  // Lajky
  likes: Set<string>;
  toggleLike: (eventId: string) => void;

  // Body (naběháno na tomto zařízení)
  earnedPoints: number;
  addPoints: (p: number) => void;
  spendPoints: (p: number) => boolean;

  // Odměny
  claimedRewards: Set<string>;
  claimReward: (rewardId: string, cost: number) => boolean;

  // Toast
  lastToast: { id: string; title: string; body?: string; icon?: string } | null;
  showToast: (toast: { title: string; body?: string; icon?: string }) => void;
  clearToast: () => void;

  reset: () => void;
}

// Pomocná funkce pro generování unikátního ID zařízení
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

      earnedPoints: 0,
      addPoints: (p) => set((s) => ({ earnedPoints: s.earnedPoints + p })),
      spendPoints: (p) => {
        set((s) => ({ earnedPoints: s.earnedPoints - p }));
        return true;
      },

      claimedRewards: new Set(),
      claimReward: (rewardId, cost) => {
        const { claimedRewards, earnedPoints } = get();
        if (claimedRewards.has(rewardId)) return false;
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
          earnedPoints: 0,
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
