'use client';

import { useEffect, useState } from 'react';
import { X, Check, Save } from 'lucide-react';
import { CATEGORY_LABELS, EventCategory } from '@/lib/types';
import { LocalUserProfile, useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: LocalUserProfile;
}

export function EditProfileModal({ open, onClose, profile }: EditProfileModalProps) {
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const showToast = useStore((s) => s.showToast);
  const [data, setData] = useState({
    name: profile.name,
    username: profile.username,
    ageGroup: profile.ageGroup,
    gender: profile.gender,
    city: profile.city,
    interests: profile.interests,
  });

  // Sync při otevření (pro případ změny profile mezi otevřeními)
  useEffect(() => {
    if (open) {
      setData({
        name: profile.name,
        username: profile.username,
        ageGroup: profile.ageGroup,
        gender: profile.gender,
        city: profile.city,
        interests: profile.interests,
      });
    }
  }, [open, profile]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const toggleInterest = (cat: EventCategory) => {
    setData((d) => {
      if (d.interests.includes(cat)) {
        return { ...d, interests: d.interests.filter((c) => c !== cat) };
      }
      if (d.interests.length >= 3) return d;
      return { ...d, interests: [...d.interests, cat] };
    });
  };

  const canSave =
    data.name.trim().length >= 2 &&
    data.username.trim().length >= 2 &&
    !!data.ageGroup &&
    !!data.gender &&
    data.interests.length === 3;

  const handleSave = () => {
    if (!canSave) return;
    completeOnboarding({
      name: data.name.trim(),
      username: data.username.trim().toLowerCase(),
      ageGroup: data.ageGroup,
      gender: data.gender,
      city: data.city.trim(),
      interests: data.interests,
    });
    showToast({ title: 'Profil uložen', icon: '✓' });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-elevated rounded-t-3xl md:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface-elevated border-b border-border px-5 py-4 flex items-center justify-between z-10">
          <h3 className="font-display text-lg md:text-xl font-bold">Upravit profil</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-muted hover:bg-border flex items-center justify-center"
            aria-label="Zavřít"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Obsah */}
        <div className="p-5 space-y-5">
          {/* Avatar náhled */}
          <div className="flex items-center gap-3">
            <Avatar name={data.name || '?'} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-ink-muted uppercase tracking-wider mb-0.5">Náhled</div>
              <div className="font-semibold truncate">{data.name || '—'}</div>
              <div className="text-xs text-ink-muted truncate">
                @{data.username || '—'}
              </div>
            </div>
          </div>

          {/* Jméno + username */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5 uppercase tracking-wider">
                Jméno
              </label>
              <input
                type="text"
                className="input"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
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
            </div>
          </div>

          {/* Věk */}
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
                      'p-2.5 rounded-xl border-2 transition-all text-sm font-semibold',
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

          {/* Pohlaví */}
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
                      'p-2.5 rounded-xl border-2 transition-all text-sm font-semibold',
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

          {/* Bydliště */}
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5 uppercase tracking-wider">
              Bydliště
            </label>
            <input
              type="text"
              className="input"
              value={data.city}
              onChange={(e) => setData({ ...data, city: e.target.value })}
            />
          </div>

          {/* Zájmy */}
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-2 uppercase tracking-wider">
              Moje zájmy · {data.interests.length} / 3
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CATEGORY_LABELS).map(([cat, meta]) => {
                const selected = data.interests.includes(cat as EventCategory);
                const disabled = !selected && data.interests.length >= 3;
                return (
                  <button
                    key={cat}
                    disabled={disabled}
                    onClick={() => toggleInterest(cat as EventCategory)}
                    className={cn(
                      'p-2.5 rounded-xl border-2 transition-all text-left flex items-center gap-2',
                      selected
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                        : 'border-border bg-surface-elevated hover:border-brand-300',
                      disabled && 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    <span className="text-lg">{meta.emoji}</span>
                    <span className="font-semibold text-sm flex-1">{meta.cs}</span>
                    {selected && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-elevated border-t border-border px-5 py-3 flex gap-2 safe-area-pb">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">
            Zrušit
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="btn-primary flex-1 justify-center disabled:opacity-40"
          >
            <Save className="w-4 h-4" /> Uložit
          </button>
        </div>
      </div>
    </div>
  );
}
