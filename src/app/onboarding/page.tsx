'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { CATEGORY_LABELS, EventCategory } from '@/lib/types';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: '',
    username: '',
    ageGroup: '',
    gender: '',
    city: 'Jablonec nad Nisou',
    interests: [] as EventCategory[],
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
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Ulož do store a přesměruj
      completeOnboarding({
        name: data.name.trim(),
        username: data.username.trim().toLowerCase(),
        ageGroup: data.ageGroup,
        gender: data.gender,
        city: data.city.trim(),
        interests: data.interests,
      });
      router.replace('/');
    }
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.name.trim().length >= 2 && data.username.trim().length >= 2;
      case 2:
        return !!data.ageGroup && !!data.gender;
      case 3:
        return data.interests.length === 3;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50 via-surface to-accent-50 dark:from-brand-950 dark:via-surface dark:to-accent-950/30">
      <div className="px-4 pt-5 md:pt-6 md:px-8">
        <div className="flex items-center justify-between max-w-md mx-auto w-full">
          <button
            onClick={back}
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

      <div className="flex-1 flex items-center justify-center px-4 py-6 md:py-8">
        <div className="w-full max-w-md">
          {/* Krok 1: Jméno + uživatelské jméno */}
          {step === 1 && (
            <div className="animate-slide-up">
              <div className="text-center mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-xl shadow-brand-500/30">
                  <span className="text-white text-3xl md:text-4xl font-display font-bold">J</span>
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
                  Vítej v JBC Events
                </h1>
                <p className="text-sm md:text-base text-ink-muted">
                  Objevuj kulturní a sportovní akce v Jablonci. Jak se jmenuješ?
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5 uppercase tracking-wider">
                    Tvé jméno
                  </label>
                  <input
                    type="text"
                    placeholder="Např. Tereza Nováková"
                    className="input"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5 uppercase tracking-wider">
                    Uživatelské jméno
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle">@</span>
                    <input
                      type="text"
                      placeholder="tereza_jbc"
                      className="input pl-8"
                      value={data.username}
                      onChange={(e) =>
                        setData({
                          ...data,
                          username: e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''),
                        })
                      }
                    />
                  </div>
                  <p className="text-xs text-ink-subtle mt-1.5">
                    Zobrazí se u tvých komentářů. Jen písmena, čísla, tečka a podtržítko.
                  </p>
                </div>

                {/* Live preview iniciál */}
                {data.name.trim().length >= 2 && (
                  <div className="card p-4 flex items-center gap-3 mt-4 animate-fade-in">
                    <Avatar name={data.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{data.name}</div>
                      {data.username && (
                        <div className="text-xs text-ink-muted truncate">@{data.username}</div>
                      )}
                    </div>
                    <span className="text-xs text-ink-subtle">náhled</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Krok 2: Věk + pohlaví */}
          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="font-display text-xl md:text-2xl font-bold mb-2 text-center">
                Pár údajů o tobě
              </h2>
              <p className="text-ink-muted text-center mb-5 md:mb-6 text-sm">
                Pomůže to s přesnějším doporučováním akcí. Nikdo je veřejně neuvidí.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">
                    Věková skupina
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['15-17', '18-25', '26-35', '36-45', '46-60', '60+'].map((age) => {
                      const active = data.ageGroup === age;
                      return (
                        <button
                          key={age}
                          onClick={() => setData({ ...data, ageGroup: age })}
                          className={cn(
                            'p-3 rounded-xl border-2 transition-all text-sm font-semibold',
                            active
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                              : 'border-border bg-surface-elevated hover:border-brand-300'
                          )}
                        >
                          {age}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">
                    Pohlaví
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'female', label: 'Žena' },
                      { id: 'male', label: 'Muž' },
                      { id: 'other', label: 'Jiné' },
                      { id: 'prefer_not_to_say', label: 'Neuvádím' },
                    ].map((g) => {
                      const active = data.gender === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => setData({ ...data, gender: g.id })}
                          className={cn(
                            'p-3 rounded-xl border-2 transition-all text-sm font-semibold',
                            active
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                              : 'border-border bg-surface-elevated hover:border-brand-300'
                          )}
                        >
                          {g.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5 uppercase tracking-wider">
                    Bydliště
                  </label>
                  <input
                    type="text"
                    placeholder="Město"
                    className="input"
                    value={data.city}
                    onChange={(e) => setData({ ...data, city: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Krok 3: Zájmy */}
          {step === 3 && (
            <div className="animate-slide-up">
              <h2 className="font-display text-xl md:text-2xl font-bold mb-2 text-center">
                Co tě zajímá?
              </h2>
              <p className="text-ink-muted text-center mb-5 md:mb-6 text-sm">
                Vyber <strong>3 oblasti</strong>, o kterých chceš hlavně vědět.
              </p>

              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {Object.entries(CATEGORY_LABELS).map(([cat, meta]) => {
                  const selected = data.interests.includes(cat as EventCategory);
                  const disabled = !selected && data.interests.length >= 3;
                  return (
                    <button
                      key={cat}
                      disabled={disabled}
                      onClick={() => toggleInterest(cat as EventCategory)}
                      className={cn(
                        'p-3 md:p-4 rounded-2xl border-2 transition-all text-left',
                        selected
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                          : 'border-border bg-surface-elevated hover:border-brand-300',
                        disabled && 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      <div className="text-xl md:text-2xl mb-1">{meta.emoji}</div>
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

          {/* Krok 4: Hotovo */}
          {step === 4 && (
            <div className="animate-slide-up">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Avatar name={data.name} size="2xl" className="w-24 h-24 text-3xl" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-8 h-8 text-accent-500 animate-pulse-soft" />
                  </div>
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold mb-1">
                  Vše je připravené, {data.name.split(' ')[0]}!
                </h2>
                <p className="text-ink-muted text-sm">
                  Tvůj profil je vytvořený jen na tomto zařízení. Zkontroluj a začni objevovat.
                </p>
              </div>

              <div className="card p-4 space-y-3">
                <Row label="Jméno" value={data.name} />
                <Row label="Username" value={`@${data.username}`} />
                <Row label="Věk" value={data.ageGroup} />
                <Row label="Pohlaví" value={formatGender(data.gender)} />
                <Row label="Bydliště" value={data.city} />
                <Row
                  label="Zájmy"
                  value={data.interests
                    .map((c) => CATEGORY_LABELS[c].emoji + ' ' + CATEGORY_LABELS[c].cs)
                    .join(', ')}
                />
              </div>

              <p className="text-xs text-ink-subtle text-center mt-4">
                Data ukládáme jen do tohoto prohlížeče. Žádný server si je nepamatuje.
              </p>
            </div>
          )}

          <button
            onClick={next}
            disabled={!canProceed()}
            className="btn-primary w-full justify-center py-3 mt-6 md:mt-8 disabled:opacity-40"
          >
            {step === totalSteps ? (
              <>
                Začít objevovat <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Pokračovat <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-ink-muted flex-shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function formatGender(g: string): string {
  const map: Record<string, string> = {
    female: 'Žena',
    male: 'Muž',
    other: 'Jiné',
    prefer_not_to_say: 'Neuvádím',
  };
  return map[g] || g;
}
