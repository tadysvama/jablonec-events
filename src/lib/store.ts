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

// Společný streak s kamarádem
export interface BuddyStreak {
  id: string;
  friendId: string; // id uživatele z MOCK_FRIENDS
  createdAt: string;
  currentWeeks: number; // kolik týdnů streak trvá
  longestWeeks: number; // rekord
  lastActiveAt: string; // ISO datum posledního "společného plnění"
  goal?: string; // volitelný cíl, např. "2 koncerty měsíčně"
  completedThisWeek: boolean; // už v tomto týdnu splněno?
}

// Vygeneruje náhodné body 2000-2500 končící na 5 nebo 0
function randomStarterPoints(): number {
  // Seznam všech čísel mezi 2000 a 2500 končících na 0 nebo 5
  // → 2000, 2005, 2010, 2015... 2495, 2500
  // Celkem 101 hodnot (každých 5 krok)
  const steps = Math.floor((2500 - 2000) / 5) + 1;
  const randomIndex = Math.floor(Math.random() * steps);
  return 2000 + randomIndex * 5;
}

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

  earnedPoints: number;
  addPoints: (p: number) => void;
  spendPoints: (p: number) => boolean;

  currentStreak: number;

  claimedRewards: Set<string>;
  claimReward: (rewardId: string, cost: number) => boolean;

  // Společné streaky s kamarády
  buddyStreaks: BuddyStreak[];
  createBuddyStreak: (friendId: string, goal?: string) => BuddyStreak;
  removeBuddyStreak: (id: string) => void;
  completeBuddyStreakThisWeek: (id: string) => void;

  lastToast: { id: string; title: string; body?: string; icon?: string } | null;
  showToast: (toast: { title: string; body?: string; icon?: string }) => void;
  clearToast: () => void;

  reset: () => void;
}

function generateDeviceId(): string {
  return 'usr_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function generateStreakId(): string {
  return 'bs_' + Math.random().toString(36).substring(2, 11);
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

        if (!existing) {
          // První onboarding – nastav náhodné startovní hodnoty + 1 streak s náhodným kamarádem
          const startingPoints = randomStarterPoints();

          // Vygeneruj 1 buddy streak s prvním kamarádem z mocku (Martin Kovář)
          const initialStreak: BuddyStreak = {
            id: generateStreakId(),
            friendId: 'usr_002', // Martin Kovář
            createdAt: new Date(Date.now() - 7 * 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 týdnů zpátky
            currentWeeks: 7,
            longestWeeks: 7,
            lastActiveAt: new Date().toISOString(),
            goal: 'Alespoň 1 akce týdně',
            completedThisWeek: true,
          };

          set({
            earnedPoints: startingPoints,
            currentStreak: STARTER_STREAK,
            buddyStreaks: [initialStreak],
          });
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

      earnedPoints: 0,
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
        if (earnedPoints < cost) return false;
        const next = new Set(claimedRewards);
        next.add(rewardId);
        set({
          claimedRewards: next,
          earnedPoints: earnedPoints - cost,
        });
        return true;
      },

      buddyStreaks: [],
      createBuddyStreak: (friendId, goal) => {
        const existing = get().buddyStreaks.find((s) => s.friendId === friendId);
        if (existing) return existing;

        const newStreak: BuddyStreak = {
          id: generateStreakId(),
          friendId,
          createdAt: new Date().toISOString(),
          currentWeeks: 0,
          longestWeeks: 0,
          lastActiveAt: new Date().toISOString(),
          goal,
          completedThisWeek: false,
        };
        set((s) => ({ buddyStreaks: [...s.buddyStreaks, newStreak] }));
        return newStreak;
      },
      removeBuddyStreak: (id) =>
        set((s) => ({ buddyStreaks: s.buddyStreaks.filter((bs) => bs.id !== id) })),
      completeBuddyStreakThisWeek: (id) =>
        set((s) => ({
          buddyStreaks: s.buddyStreaks.map((bs) => {
            if (bs.id !== id) return bs;
            if (bs.completedThisWeek) return bs;
            const newCurrent = bs.currentWeeks + 1;
            return {
              ...bs,
              currentWeeks: newCurrent,
              longestWeeks: Math.max(bs.longestWeeks, newCurrent),
              completedThisWeek: true,
              lastActiveAt: new Date().toISOString(),
            };
          }),
        })),

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
          currentStreak: STARTER_STREAK,
          claimedRewards: new Set(),
          buddyStreaks: [],
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
          buddyStreaks: state.buddyStreaks,
        }) as any,
      onRehydrateStorage: () => (state) => {
        if (state) {
          const s = state as any;
          if (Array.isArray(s.likes)) s.likes = new Set(s.likes);
          if (Array.isArray(s.claimedRewards))
            s.claimedRewards = new Set(s.claimedRewards);
          if (!Array.isArray(s.buddyStreaks)) s.buddyStreaks = [];
        }
      },
    }
  )
);
