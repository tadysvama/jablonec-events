'use client';

import { useState } from 'react';
import { Zap, Gift, Lock, Check, Info, TrendingUp } from 'lucide-react';
import { MOCK_REWARDS, TIER_META, RewardTier, Reward } from '@/data/rewards';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function RewardsPage() {
  const [tier, setTier] = useState<RewardTier | 'all'>('all');
  const [detailReward, setDetailReward] = useState<Reward | null>(null);

  // Body čte ze store – stejná hodnota jako v profilu
  const earnedPoints = useStore((s) => s.earnedPoints);
  const claimedRewards = useStore((s) => s.claimedRewards);
  const claimReward = useStore((s) => s.claimReward);
  const showToast = useStore((s) => s.showToast);

  const totalPoints = earnedPoints;

  const rewards = tier === 'all' ? MOCK_REWARDS : MOCK_REWARDS.filter((r) => r.tier === tier);

  const nextGoal = MOCK_REWARDS
    .filter((r) => r.cost > totalPoints && !claimedRewards.has(r.id))
    .sort((a, b) => a.cost - b.cost)[0];

  const progressToNextGoal = nextGoal
    ? Math.min(100, Math.round((totalPoints / nextGoal.cost) * 100))
    : 100;

  const handleClaim = (r: Reward) => {
    if (totalPoints < r.cost) {
      showToast({
        title: 'Nedostatek bodů',
        body: `Chybí ti ještě ${r.cost - totalPoints} bodů.`,
        icon: '⚠️',
      });
      return;
    }
    const success = claimReward(r.id, r.cost);
    if (!success) {
      showToast({ title: 'Tuto odměnu už máš', icon: 'ℹ️' });
      return;
    }
    setDetailReward(null);
    showToast({
      title: `🎁 ${r.name}`,
      body: `−${r.cost.toLocaleString('cs-CZ')} bodů · vyzvedni v TIC`,
      icon: '✓',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-10">
      <div className="mb-5 md:mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-1 md:mb-2">Odměny</h1>
        <p className="text-sm text-ink-muted">
          Vyměň nasbírané body za slevy, virtuální odznaky nebo fyzický merch.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-5 md:p-8 text-white shadow-xl shadow-brand-500/20 mb-5 md:mb-6">
        <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-1">
            <Zap className="w-4 h-4" /> Tvoje body
          </div>
          <div className="font-display text-4xl md:text-6xl font-bold mb-3 md:mb-4">
            {totalPoints.toLocaleString('cs-CZ')}
          </div>

          {nextGoal && (
            <div>
              <div className="flex items-center justify-between text-xs mb-2 gap-2">
                <span className="opacity-80 flex-shrink-0">Další:</span>
                <span className="font-semibold truncate">
                  {nextGoal.image} {nextGoal.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 md:h-3 bg-white/20 rounded-full overflow-hidden flex-1">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${progressToNextGoal}%` }}
                  />
                </div>
                <span className="text-xs font-semibold whitespace-nowrap">
                  −{nextGoal.cost - totalPoints}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setTier('all')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
            tier === 'all'
              ? 'bg-ink text-surface border-ink'
              : 'bg-surface-elevated border-border hover:border-brand-400 text-ink-muted'
          )}
        >
          <span>🎁</span> Vše
        </button>
        {(Object.entries(TIER_META) as [RewardTier, typeof TIER_META[RewardTier]][]).map(([key, meta]) => {
          const active = tier === key;
          return (
            <button
              key={key}
              onClick={() => setTier(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                active
                  ? 'bg-ink text-surface border-ink'
                  : 'bg-surface-elevated border-border hover:border-brand-400 text-ink-muted'
              )}
            >
              <span>{meta.icon}</span> {meta.label}
            </button>
          );
        })}
      </div>

      {tier !== 'all' && (
        <div className="card p-4 mb-5 flex items-start gap-3 border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/50">
          <Info className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold mb-0.5">{TIER_META[tier].label}</div>
            <div className="text-ink-muted">{TIER_META[tier].description}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {rewards.map((r) => {
          const tierMeta = TIER_META[r.tier];
          const affordable = totalPoints >= r.cost;
          const isClaimed = claimedRewards.has(r.id);
          const soldOut = r.stockLimit && r.claimedCount && r.claimedCount >= r.stockLimit;
          const stockPercent = r.stockLimit ? Math.round(((r.claimedCount || 0) / r.stockLimit) * 100) : 0;

          return (
            <div
              key={r.id}
              className={cn(
                'card overflow-hidden transition-all flex flex-col',
                !affordable && !isClaimed && 'opacity-60',
                r.featured && 'ring-2 ring-brand-500',
                isClaimed && 'ring-2 ring-streak-500'
              )}
            >
              <div className={cn('aspect-[16/10] bg-gradient-to-br flex items-center justify-center relative', tierMeta.color)}>
                <div className="text-6xl md:text-7xl">{r.image}</div>

                {r.featured && !isClaimed && (
                  <span className="absolute top-2 md:top-3 left-2 md:left-3 px-2 md:px-2.5 py-1 rounded-full bg-white text-brand-700 text-[10px] md:text-xs font-bold shadow-lg">
                    ⭐ Doporučeno
                  </span>
                )}

                <span className="absolute top-2 md:top-3 right-2 md:right-3 px-2 md:px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-md text-white text-[10px] md:text-xs font-semibold">
                  {tierMeta.icon} {tierMeta.label}
                </span>

                {isClaimed && (
                  <div className="absolute inset-0 bg-streak-500/40 backdrop-blur-sm flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-streak-500 text-white font-bold flex items-center gap-1.5 shadow-lg">
                      <Check className="w-4 h-4" /> Získáno
                    </span>
                  </div>
                )}

                {soldOut && !isClaimed && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white text-ink font-bold">Vyprodáno</span>
                  </div>
                )}
              </div>

              <div className="p-3 md:p-4 flex-1 flex flex-col">
                <h3 className="font-display font-bold text-base md:text-lg mb-1 leading-tight">{r.name}</h3>
                <p className="text-xs md:text-sm text-ink-muted flex-1 mb-3 line-clamp-2 md:line-clamp-none">{r.description}</p>

                <div className="space-y-1.5 mb-3 text-xs text-ink-muted">
                  {r.partner && (
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="opacity-60 flex-shrink-0">Partner:</span>
                      <span className="font-medium text-ink truncate">{r.partner}</span>
                    </div>
                  )}
                  {r.expiresIn && (
                    <div className="flex items-center gap-1.5">
                      <span className="opacity-60">Platnost:</span>
                      <span className="font-medium text-ink">{r.expiresIn}</span>
                    </div>
                  )}
                </div>

                {r.stockLimit && !soldOut && !isClaimed && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink-muted">Dostupnost</span>
                      <span className="font-semibold">
                        {r.stockLimit - (r.claimedCount || 0)} z {r.stockLimit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          stockPercent > 80 ? 'bg-accent-500' : stockPercent > 50 ? 'bg-flame-500' : 'bg-streak-500'
                        )}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-brand-600" />
                    <span className="font-display text-lg md:text-xl font-bold">{r.cost.toLocaleString('cs-CZ')}</span>
                    <span className="text-xs text-ink-muted">b.</span>
                  </div>

                  {isClaimed ? (
                    <span className="chip-streak">
                      <Check className="w-3 h-3" /> Získáno
                    </span>
                  ) : soldOut ? (
                    <span className="text-xs text-ink-muted">—</span>
                  ) : affordable ? (
                    <button
                      onClick={() => setDetailReward(r)}
                      className="btn-primary text-xs py-2 px-3 md:px-4"
                    >
                      Vyměnit
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] md:text-xs text-ink-muted">
                      <Lock className="w-3 h-3" />
                      Chybí {(r.cost - totalPoints).toLocaleString('cs-CZ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-4 md:p-5 mt-6 md:mt-8 border-dashed">
        <div className="flex items-start md:items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
            💡
          </div>
          <div className="flex-1">
            <div className="font-semibold mb-1 text-sm md:text-base">Jak nejrychleji získat body?</div>
            <div className="text-xs md:text-sm text-ink-muted">
              Dokonči týdenní výzvy, účastni se mega akcí, udržuj týdenní streak a pozvi kamaráda.
            </div>
          </div>
          <TrendingUp className="w-6 h-6 text-brand-500 hidden md:block" />
        </div>
      </div>

      {detailReward && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDetailReward(null)}
        >
          <div
            className="bg-surface-elevated rounded-3xl p-5 md:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cn(
              'aspect-square max-w-[140px] md:max-w-[180px] mx-auto rounded-3xl bg-gradient-to-br flex items-center justify-center mb-4',
              TIER_META[detailReward.tier].color
            )}>
              <div className="text-6xl md:text-8xl">{detailReward.image}</div>
            </div>

            <h3 className="font-display text-xl md:text-2xl font-bold text-center mb-1">{detailReward.name}</h3>
            <p className="text-sm text-ink-muted text-center mb-4">{detailReward.description}</p>

            <div className="bg-surface-muted rounded-xl p-4 mb-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-muted">Cena:</span>
                <span className="font-bold">{detailReward.cost.toLocaleString('cs-CZ')} b.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Tvé body:</span>
                <span className="font-bold">{totalPoints.toLocaleString('cs-CZ')} b.</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-ink-muted">Po výměně:</span>
                <span className="font-bold text-brand-600">
                  {(totalPoints - detailReward.cost).toLocaleString('cs-CZ')} b.
                </span>
              </div>
            </div>

            <button
              onClick={() => handleClaim(detailReward)}
              className="btn-primary w-full justify-center mb-2"
            >
              <Gift className="w-4 h-4" /> Potvrdit výměnu
            </button>
            <button
              onClick={() => setDetailReward(null)}
              className="btn-ghost w-full justify-center"
            >
              Zrušit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
