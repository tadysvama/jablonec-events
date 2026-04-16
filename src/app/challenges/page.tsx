'use client';

import { Zap, Check, Trophy, Calendar } from 'lucide-react';
import { MOCK_CHALLENGES } from '@/data/users';
import { cn } from '@/lib/utils';

export default function ChallengesPage() {
  const active = MOCK_CHALLENGES.filter((c) => !c.completed);
  const completed = MOCK_CHALLENGES.filter((c) => c.completed);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold mb-2">Týdenní výzvy</h1>
        <p className="text-ink-muted">
          <Calendar className="w-4 h-4 inline mr-1" />
          Končí v neděli 23:59 · Dokončené výzvy dávají bonusové body navíc k normálním za účast.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">
          Aktivní · {active.length}
        </h2>
        <div className="grid gap-3">
          {active.map((c) => {
            const pct = Math.round((c.progress / c.targetValue) * 100);
            return (
              <div key={c.id} className="card p-5 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-brand-500/20">
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="font-display text-lg font-bold">{c.title}</h3>
                      <div className="flex items-center gap-1 flex-shrink-0 chip-brand">
                        <Zap className="w-3.5 h-3.5" />
                        +{c.rewardPoints}
                      </div>
                    </div>
                    <p className="text-sm text-ink-muted mb-3">{c.description}</p>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-ink-muted whitespace-nowrap">
                        {c.progress} / {c.targetValue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {completed.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">
            Dokončené · {completed.length}
          </h2>
          <div className="grid gap-3">
            {completed.map((c) => (
              <div key={c.id} className="card p-5 opacity-75">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-streak-100 dark:bg-streak-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-streak-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold">{c.title}</h3>
                      <span className="chip-streak">Hotovo</span>
                    </div>
                    <p className="text-sm text-ink-muted">{c.description} · získáno +{c.rewardPoints} bodů</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Příští týden */}
      <section className="mt-8">
        <div className="card p-5 border-dashed">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-brand-500" />
            <div>
              <div className="font-semibold">Nová várka výzev v pondělí</div>
              <div className="text-sm text-ink-muted">
                Každý týden 4 nové výzvy. Včasné dokončení = bonus k bodům.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
