'use client';

import { useState } from 'react';
import { UserPlus, Search, Check, X, Trophy, Flame, MessageCircle } from 'lucide-react';
import { MOCK_FRIENDS } from '@/data/users';
import { LEAGUE_META } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

export default function FriendsPage() {
  const [tab, setTab] = useState<'all' | 'requests' | 'suggestions'>('all');
  const [search, setSearch] = useState('');

  const friends = MOCK_FRIENDS.filter(
    (f) => !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-10">
      <div className="mb-5 md:mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-1 md:mb-2">Přátelé</h1>
        <p className="text-sm text-ink-muted">
          Sleduj aktivitu kamarádů, srovnávej body, choďte na akce spolu.
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" />
        <input
          type="text"
          placeholder="Najít přítele..."
          className="input pl-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-1 p-1 bg-surface-muted rounded-full w-fit mb-5">
        {[
          { id: 'all', label: `Přátelé · ${MOCK_FRIENDS.length}` },
          { id: 'requests', label: 'Žádosti · 2' },
          { id: 'suggestions', label: 'Doporučení' },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={cn(
                'px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all',
                active ? 'bg-surface-elevated text-ink shadow-sm' : 'text-ink-muted'
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'all' && (
        <div className="space-y-2 md:space-y-3">
          {friends.map((friend) => {
            const league = LEAGUE_META[friend.currentLeague];
            return (
              <div key={friend.id} className="card p-3 md:p-4 flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar name={friend.name} size="lg" />
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-streak-500 border-2 border-surface-elevated" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm md:text-base truncate">{friend.name}</div>
                  <div className="text-xs text-ink-muted truncate">@{friend.username}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
                    <span className="flex items-center gap-0.5">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      {friend.totalPoints.toLocaleString('cs-CZ')}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-flame-500" />
                      {friend.currentStreak}t
                    </span>
                    <span>{league.icon} {league.label}</span>
                  </div>
                </div>
                <button className="btn-ghost !px-2 md:!px-3 flex-shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'requests' && (
        <div className="space-y-3">
          <div className="card p-4 flex items-center gap-3">
            <Avatar name="Jakub Horák" size="lg" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">Jakub Horák</div>
              <div className="text-xs text-ink-muted">@jakub.h · 3 společné zájmy</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="btn-primary !px-3">
                <Check className="w-4 h-4" />
              </button>
              <button className="btn-secondary !px-3">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <Avatar name="Eva Marková" size="lg" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">Eva Marková</div>
              <div className="text-xs text-ink-muted">@eva_m · 2 společní přátelé</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="btn-primary !px-3">
                <Check className="w-4 h-4" />
              </button>
              <button className="btn-secondary !px-3">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'suggestions' && (
        <div className="card p-6 md:p-8 text-center border-dashed">
          <div className="text-4xl mb-3">🤝</div>
          <div className="font-semibold mb-1">Přivedeš kamarády?</div>
          <div className="text-sm text-ink-muted mb-4 max-w-sm mx-auto">
            Pozvi je na akci z detailu akce. Po připojení na akci vám přibudou body oběma.
          </div>
          <button className="btn-primary">
            <UserPlus className="w-4 h-4" /> Pozvat přítele
          </button>
        </div>
      )}
    </div>
  );
}
