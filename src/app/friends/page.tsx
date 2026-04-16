'use client';

import { useState } from 'react';
import { UserPlus, Search, Flame, Zap } from 'lucide-react';
import { MOCK_FRIENDS } from '@/data/users';
import { LEAGUE_META } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function FriendsPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'friends' | 'suggestions' | 'requests'>('friends');

  const friends = MOCK_FRIENDS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-10">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Přátelé</h1>
          <p className="text-ink-muted">{friends.length} přátel · sdílej akce a posilni streaky</p>
        </div>
        <button className="btn-primary">
          <UserPlus className="w-4 h-4" /> Pozvat
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-muted rounded-full w-fit mb-5">
        {[
          { id: 'friends', label: 'Přátelé', count: MOCK_FRIENDS.length },
          { id: 'suggestions', label: 'Návrhy', count: 5 },
          { id: 'requests', label: 'Žádosti', count: 2 },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                active ? 'bg-surface-elevated text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
              )}
            >
              {t.label} <span className="text-xs opacity-60">·{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" />
        <input
          type="text"
          placeholder="Hledej přátele..."
          className="input pl-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Friend invite card */}
      <div className="card p-5 mb-6 bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-950 dark:to-accent-950/30 border-brand-200 dark:border-brand-800">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💌</div>
          <div className="flex-1">
            <h3 className="font-display font-bold mb-1">Pozvi kamaráda – dostanete oba 200 bodů</h3>
            <p className="text-sm text-ink-muted mb-3">
              Když tvůj kamarád navštíví první akci, oba dostanete bonus.
            </p>
            <div className="flex gap-2 flex-wrap">
              <button className="btn-primary text-sm py-2">Sdílet odkaz</button>
              <button className="btn-secondary text-sm py-2">Zkopírovat kód</button>
            </div>
          </div>
        </div>
      </div>

      {/* Friends list */}
      {tab === 'friends' && (
        <div className="grid md:grid-cols-2 gap-3">
          {friends.map((f) => {
            const league = LEAGUE_META[f.currentLeague];
            return (
              <div key={f.id} className="card p-4 flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <img src={f.avatarUrl} alt={f.name} className="w-12 h-12 rounded-full" />
                  {f.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-streak-500 rounded-full border-2 border-surface-elevated" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="font-semibold truncate">{f.name}</div>
                    <span title={league.label}>{league.icon}</span>
                  </div>
                  <div className="text-xs text-ink-muted">@{f.username}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="flex items-center gap-1 text-flame-500 font-semibold">
                      <Flame className="w-3 h-3" /> {f.currentStreak}
                    </span>
                    <span className="flex items-center gap-1 text-ink-muted">
                      <Zap className="w-3 h-3" /> {f.totalPoints}
                    </span>
                    {f.commonEvents && (
                      <span className="text-ink-muted">· {f.commonEvents} společných</span>
                    )}
                  </div>
                </div>
                <button className="btn-ghost text-xs">Profil</button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'suggestions' && (
        <div className="grid gap-3">
          <div className="text-sm text-ink-muted mb-2">Lidé z akcí, na kterých jsi byl(a):</div>
          {[
            { name: 'Kateřina Malá', username: 'katka.concerts', avatar: 'https://i.pravatar.cc/200?img=49', common: 3 },
            { name: 'Jan Bláha', username: 'honza_b', avatar: 'https://i.pravatar.cc/200?img=14', common: 2 },
            { name: 'Petra Králová', username: 'petra.k', avatar: 'https://i.pravatar.cc/200?img=25', common: 2 },
          ].map((p) => (
            <div key={p.username} className="card p-4 flex items-center gap-3">
              <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-ink-muted">@{p.username} · {p.common} společných akcí</div>
              </div>
              <button className="btn-primary text-sm py-2">
                <UserPlus className="w-3.5 h-3.5" /> Přidat
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'requests' && (
        <div className="grid gap-3">
          <div className="text-sm text-ink-muted mb-2">Čekají na schválení:</div>
          {[
            { name: 'Vojtěch Horák', username: 'vojtech.h', avatar: 'https://i.pravatar.cc/200?img=11' },
            { name: 'Markéta Procházková', username: 'marketka', avatar: 'https://i.pravatar.cc/200?img=20' },
          ].map((p) => (
            <div key={p.username} className="card p-4 flex items-center gap-3">
              <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-ink-muted">@{p.username}</div>
              </div>
              <button className="btn-primary text-sm py-2">Přijmout</button>
              <button className="btn-ghost text-sm py-2">Zamítnout</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
