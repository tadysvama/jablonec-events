'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Mail } from 'lucide-react';
import { CATEGORY_LABELS, EventCategory } from '@/lib/types';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
  const router = useRouter();
  const setOnboarded = useStore((s) => s.setOnboarded);
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: '',
    username: '',
    email: '',
    ageGroup: '',
    gender: '',
    city: 'Jablonec nad Nisou',
    interests: [] as EventCategory[],
    notifications: true,
  });

  const totalSteps = 4;

  const toggleInterest = (cat: EventCategory) => {
    setData((d) => {
      if (d.interests.includes(cat)) {
        return { ...d, interests: d.interests.filter((c) => c !== cat) };
      }
      if (d.interests.length >= 3) return d;
      return { ...d, interests: [...d.interests, cat] };
    });
  };

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
    else {
      setOnboarded(true);
      router.push('/');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return data.name.trim() && data.username.trim();
      case 3: return data.interests.length === 3;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50 via-surface to-accent-50 dark:from-brand-950 dark:via-surface dark:to-accent-950/30">
      {/* Progress bar */}
      <div className="px-4 pt-6 md:px-8">
        <div className="flex items-center justify-between max-w-md mx-auto w-full">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            className={cn('btn-ghost', step === 1 && 'invisible')}
          >
            <ArrowLeft className="w-4 h-4" /> Zpět
          </button>
          <div className="text-xs font-medium text-ink-muted">
            Krok {step} z {totalSteps}
          </div>
          <div className="w-16" />
        </div>
        <div className="max-w-md mx-auto mt-3 h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {step === 1 && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-xl shadow-brand-500/30">
                  <span className="text-white text-4xl font-display font-bold">J</span>
                </div>
                <h1 className="font-display text-3xl font-bold mb-2">Vítej v JBC Events</h1>
                <p className="text-ink-muted">
                  Objevuj kulturní a sportovní akce v Jablonci, sbírej body a buduj streak s kamarády.
                </p>
              </div>

              <div className="space-y-3">
                <button className="btn-secondary w-full justify-center py-3" onClick={next}>
                  <span className="text-base">🔵</span> Pokračovat s Google
                </button>
                <button className="btn-secondary w-full justify-center py-3" onClick={next}>
                  <span className="text-base"></span> Pokračovat s Apple
                </button>
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-ink-muted">nebo</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <input
                  type="email"
                  placeholder="tvůj@email.cz"
                  className="input"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <input type="password" placeholder="Heslo" className="input" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="font-display text-2xl font-bold mb-2 text-center">Řekni nám o sobě</h2>
              <p className="text-ink-muted text-center mb-6 text-sm">
                Tyhle údaje pomáhají s doporučováním akcí a komunitou.
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Jméno a příjmení"
                  className="input"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Uživatelské jméno (@username)"
                  className="input"
                  value={data.username}
                  onChange={(e) => setData({ ...data, username: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="input"
                    value={data.ageGroup}
                    onChange={(e) => setData({ ...data, ageGroup: e.target.value })}
                  >
                    <option value="">Věková skupina</option>
                    <option value="15-17">15–17</option>
                    <option value="18-25">18–25</option>
                    <option value="26-35">26–35</option>
                    <option value="36-45">36–45</option>
                    <option value="46-60">46–60</option>
                    <option value="60+">60+</option>
                  </select>
                  <select
                    className="input"
                    value={data.gender}
                    onChange={(e) => setData({ ...data, gender: e.target.value })}
                  >
                    <option value="">Pohlaví</option>
                    <option value="female">Žena</option>
                    <option value="male">Muž</option>
                    <option value="other">Jiné</option>
                    <option value="prefer_not_to_say">Neuvádím</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Bydliště"
                  className="input"
                  value={data.city}
                  onChange={(e) => setData({ ...data, city: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-up">
              <h2 className="font-display text-2xl font-bold mb-2 text-center">Co tě zajímá?</h2>
              <p className="text-ink-muted text-center mb-6 text-sm">
                Vyber <strong>3 oblasti</strong>, o kterých chceš hlavně vědět. Později můžeš měnit.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(CATEGORY_LABELS).map(([cat, meta]) => {
                  const selected = data.interests.includes(cat as EventCategory);
                  const disabled = !selected && data.interests.length >= 3;
                  return (
                    <button
                      key={cat}
                      disabled={disabled}
                      onClick={() => toggleInterest(cat as EventCategory)}
                      className={cn(
                        'p-4 rounded-2xl border-2 transition-all text-left',
                        selected
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                          : 'border-border bg-surface-elevated hover:border-brand-300',
                        disabled && 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      <div className="text-2xl mb-1">{meta.emoji}</div>
                      <div className="font-semibold text-sm">{meta.cs}</div>
                      {selected && (
                        <div className="mt-1 inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-medium">
                          <Check className="w-3 h-3" /> Vybráno
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-xs text-ink-muted mt-4">
                {data.interests.length} / 3 vybráno
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-slide-up">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-streak-100 dark:bg-streak-500/20 flex items-center justify-center">
                  <Check className="w-10 h-10 text-streak-600" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">Všechno připraveno!</h2>
                <p className="text-ink-muted text-sm">
                  Ještě pár drobností a pak objevuješ Jablonec jinak.
                </p>
              </div>

              <div className="card p-4 mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">Upozornění na akce</div>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      Pošleme ti novinky z tvých kategorií a připomenem streak, abys nic nepromeškal(a).
                    </p>
                    <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.notifications}
                        onChange={(e) => setData({ ...data, notifications: e.target.checked })}
                        className="w-4 h-4 rounded accent-brand-600"
                      />
                      Zapnout upozornění
                    </label>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                    🔐
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">Soukromí</div>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      Profil uvidí jen přátelé. V nastavení můžeš kdykoliv přepnout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next button */}
          <button
            onClick={next}
            disabled={!canProceed()}
            className="btn-primary w-full justify-center py-3 mt-8 disabled:opacity-40"
          >
            {step === totalSteps ? 'Začít objevovat ✨' : (
              <>Pokračovat <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
