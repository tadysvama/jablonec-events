'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Search, Check, X, Trophy, Flame, MessageCircle, Users, Plus } from 'lucide-react';
import { MOCK_FRIENDS } from '@/data/users';
import { LEAGUE_META } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { useStore } from '@/lib/store';

export default function FriendsPage() {
  const [tab, setTab] = useState<'all' | 'streaks' | 'requests'>('all');
  const [search, setSearch] = useState('');
  const buddyStreaks = useStore((s) => s.buddyStreaks);
  const createBuddyStreak = useStore((s) => s.createBuddyStreak);
  const showToast = useStore((s) => s.showToast);

  const friends = MOCK_FRIENDS.filter(
    (f) => !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pro každého kamaráda zjisti, jestli s ním máš aktivní streak
  const streakByFriend = new Map(buddyStreaks.map((bs) => [bs.friendId, bs]));

  const handleCreateStreak = (friendId: string, friendName: string) => {
    const existing = streakByFriend.get(friendId);
    if (existing) {
      // Už existuje – jen naviguj do detailu
      window.location.href = `/friends/streak/${existing.id}`;
      return;
    }
    const newStreak = createBuddyStreak(friendId, 'Alespoň 1 akce týdně');
    showToast({
      title: `🔥 Streak s ${friendName} vytvořen`,
      body: 'Plňte spolu každý týden. Dnes 0 týdnů · začínáte!',
      icon: '✓',
    });
    window.location.href = `/friends/streak/${newStreak.id}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-10">
      <div className="mb-5 md:mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-1 md:mb-2">Přátelé</h1>
        <p className="text-sm text-ink-muted">
          Sleduj aktivitu kamarádů, plňte společně streaky, choďte na akce spolu.
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

      <div className="flex gap-1 p-1 bg-surface-muted rounded-full w-fit mb-5 overflow-x-auto max-w-full">
        {[
          { id: 'all', label: `Přátelé · ${MOCK_FRIENDS.length}` },
          { id: 'streaks', label: `Streaky · ${buddyStreaks.length}` },
          { id: 'requests', label: 'Žádosti · 2' },
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
            const buddyStreak = streakByFriend.get(friend.id);
            return (
              <div key={friend.id} className="card p-3 md:p-4 flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar name={friend.name} size="lg" />
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-streak-500 border-2 border-surface-elevated" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-semibold text-sm md:text-base truncate">{friend.name}</div>
                    {buddyStreak && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-flame-500/20 to-accent-500/20 border border-flame-500/30 text-[10px] md:text-xs font-bold text-flame-600">
                        🔥 {buddyStreak.currentWeeks}t
                      </span>
                    )}
                  </div>
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
                    <span className="hidden sm:inline">{league.icon} {league.label}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {buddyStreak ? (
                    <Link
                      href={`/friends/streak/${buddyStreak.id}`}
                      className="btn-primary !text-[11px] md:!text-xs !px-2.5 md:!px-3 !py-1.5 !bg-gradient-to-r !from-flame-500 !to-accent-500 hover:!from-flame-600 hover:!to-accent-600"
                    >
                      🔥 Streak
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleCreateStreak(friend.id, friend.name)}
                      className="btn-secondary !text-[11px] md:!text-xs !px-2.5 md:!px-3 !py-1.5"
                    >
                      <Plus className="w-3 h-3" /> Streak
                    </button>
                  )}
                  <button
                    className="btn-ghost !text-[11px] md:!text-xs !px-2.5 md:!px-3 !py-1.5 justify-center"
                    title="Zpráva"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'streaks' && (
        <div>
          {buddyStreaks.length === 0 ? (
            <div className="card p-6 md:p-8 text-center border-dashed">
              <div className="text-4xl mb-3">🔥</div>
              <div className="font-semibold mb-1">Žádné společné streaky</div>
              <div className="text-sm text-ink-muted mb-4 max-w-sm mx-auto">
                Streak je série týdnů, kdy oba dva splníte cíl. Začni klikem na
                &quot;Streak&quot; u kamaráda v záložce Přátelé.
              </div>
              <button onClick={() => setTab('all')} className="btn-primary">
                <Users className="w-4 h-4" /> Zobrazit přátele
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {buddyStreaks.map((bs) => {
                const friend = MOCK_FRIENDS.find((f) => f.id === bs.friendId);
                if (!friend) return null;
                return (
                  <Link
                    key={bs.id}
                    href={`/friends/streak/${bs.id}`}
                    className="card p-4 flex items-center gap-3 hover:border-flame-500 group"
                  >
                    <div className="relative">
                      <Avatar name={friend.name} size="lg" />
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-flame-500 to-accent-500 rounded-full w-7 h-7 flex items-center justify-center border-2 border-surface-elevated text-sm">
                        🔥
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm md:text-base truncate">
                        {friend.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
                        <span className="font-bold text-flame-600 dark:text-flame-400">
                          {bs.currentWeeks} {bs.currentWeeks === 1 ? 'týden' : bs.currentWeeks < 5 ? 'týdny' : 'týdnů'}
                        </span>
                        {bs.completedThisWeek ? (
                          <span className="chip-streak text-[10px]">
                            <Check className="w-3 h-3" /> Dnešní týden ✓
                          </span>
                        ) : (
                          <span className="chip text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            ⏳ Čeká na plnění
                          </span>
                        )}
                      </div>
                      {bs.goal && (
                        <div className="text-[11px] text-ink-muted mt-1">
                          Cíl: {bs.goal}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] uppercase tracking-wider text-ink-subtle">
                        Rekord
                      </div>
                      <div className="font-bold">{bs.longestWeeks}t</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
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
    </div>
  );
}
