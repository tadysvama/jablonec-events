'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CheckinStatus } from './types';

interface UserStore {
  isOnboarded: boolean;
  setOnboarded: (val: boolean) => void;

  checkins: Record<string, CheckinStatus>;
  setCheckin: (eventId: string, status: CheckinStatus) => void;
  removeCheckin: (eventId: string) => void;

  likes: Set<string>;
  toggleLike: (eventId: string) => void;

  // Body
  earnedPoints: number;
  addPoints: (p: number) => void;
  spendPoints: (p: number) => boolean; // vrací true pokud úspěch

  // Vyzvednuté odměny – persistuje mezi sessions
  claimedRewards: Set<string>;
  claimReward: (rewardId: string, cost: number) => boolean;

  // Toast
  lastToast: { id: string; title: string; body?: string; icon?: string } | null;
  showToast: (toast: { title: string; body?: string; icon?: string }) => void;
  clearToast: () => void;

  reset: () => void;
}

export const useStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isOnboarded: false,
      setOnboarded: (val) => set({ isOnboarded: val }),

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
        const current = get().earnedPoints;
        // earnedPoints může být klidně záporný – reprezentuje "změnu oproti baseline"
        // Skutečná kontrola dostupnosti probíhá v komponentě, která zná totalPoints.
        set({ earnedPoints: current - p });
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
