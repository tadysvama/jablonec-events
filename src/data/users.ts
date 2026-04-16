import { User, Badge, Challenge, Friend, LeagueEntry, Comment } from '@/lib/types';

// HLAVNÍ UŽIVATEL – streaky jsou v TÝDNECH (ne dnech)
export const CURRENT_USER: User = {
  id: 'usr_me',
  username: 'tereza_jbc',
  name: 'Tereza Nováková',
  avatarUrl: 'https://i.pravatar.cc/200?img=47',
  bio: 'Miluju koncerty, občas si zaběhám. Sbírám zážitky místo věcí.',
  birthYear: 1998,
  gender: 'female',
  city: 'Jablonec nad Nisou',
  interests: ['concert', 'sport', 'festival'],
  privacyMode: 'friends',
  totalPoints: 2340,
  currentStreak: 12,      // 12 TÝDNŮ v kuse
  longestStreak: 18,      // rekord 18 týdnů
  streakFreezes: 2,
  currentLeague: 'silver',
  leaguePoints: 480,
  lastActiveAt: new Date().toISOString(),
  createdAt: '2025-09-15T10:00:00Z',
  stats: {
    eventsAttended: 23,
    badgesEarned: 11,
    friendsCount: 14,
    venuesVisited: 9,
  },
};

// PŘÁTELÉ – streaky v týdnech
export const MOCK_FRIENDS: Friend[] = [
  { id: 'usr_002', username: 'martin_k', name: 'Martin Kovář', avatarUrl: 'https://i.pravatar.cc/200?img=12', totalPoints: 3150, currentStreak: 24, currentLeague: 'gold', isOnline: true, commonEvents: 6 },
  { id: 'usr_003', username: 'anicka.s', name: 'Anna Svobodová', avatarUrl: 'https://i.pravatar.cc/200?img=45', totalPoints: 1890, currentStreak: 8, currentLeague: 'silver', isOnline: false, commonEvents: 4 },
  { id: 'usr_004', username: 'pavel_runs', name: 'Pavel Hájek', avatarUrl: 'https://i.pravatar.cc/200?img=33', totalPoints: 4200, currentStreak: 41, currentLeague: 'diamond', isOnline: true, commonEvents: 3 },
  { id: 'usr_005', username: 'lucka_art', name: 'Lucie Dvořáková', avatarUrl: 'https://i.pravatar.cc/200?img=44', totalPoints: 1120, currentStreak: 5, currentLeague: 'bronze', isOnline: false, commonEvents: 2 },
  { id: 'usr_006', username: 'tomas.jbc', name: 'Tomáš Veselý', avatarUrl: 'https://i.pravatar.cc/200?img=68', totalPoints: 2780, currentStreak: 15, currentLeague: 'silver', isOnline: true, commonEvents: 7 },
];

export const MOCK_LEAGUE: LeagueEntry[] = [
  { userId: 'usr_020', username: 'katka.concerts', name: 'Kateřina Malá', avatarUrl: 'https://i.pravatar.cc/200?img=49', leaguePoints: 890, currentLeague: 'silver', position: 1 },
  { userId: 'usr_006', username: 'tomas.jbc', name: 'Tomáš Veselý', avatarUrl: 'https://i.pravatar.cc/200?img=68', leaguePoints: 720, currentLeague: 'silver', position: 2 },
  { userId: 'usr_021', username: 'honza_b', name: 'Jan Bláha', avatarUrl: 'https://i.pravatar.cc/200?img=14', leaguePoints: 650, currentLeague: 'silver', position: 3 },
  { userId: 'usr_022', username: 'petra.k', name: 'Petra Králová', avatarUrl: 'https://i.pravatar.cc/200?img=25', leaguePoints: 520, currentLeague: 'silver', position: 4 },
  { userId: 'usr_me', username: 'tereza_jbc', name: 'Tereza Nováková', avatarUrl: 'https://i.pravatar.cc/200?img=47', leaguePoints: 480, currentLeague: 'silver', position: 5, isMe: true },
  { userId: 'usr_003', username: 'anicka.s', name: 'Anna Svobodová', avatarUrl: 'https://i.pravatar.cc/200?img=45', leaguePoints: 420, currentLeague: 'silver', position: 6 },
  { userId: 'usr_023', username: 'vojtech.h', name: 'Vojtěch Horák', avatarUrl: 'https://i.pravatar.cc/200?img=11', leaguePoints: 380, currentLeague: 'silver', position: 7 },
  { userId: 'usr_024', username: 'marketka', name: 'Markéta Procházková', avatarUrl: 'https://i.pravatar.cc/200?img=20', leaguePoints: 340, currentLeague: 'silver', position: 8 },
  { userId: 'usr_025', username: 'david.jbc', name: 'David Čermák', avatarUrl: 'https://i.pravatar.cc/200?img=8', leaguePoints: 290, currentLeague: 'silver', position: 9 },
  { userId: 'usr_026', username: 'eva.sport', name: 'Eva Růžičková', avatarUrl: 'https://i.pravatar.cc/200?img=32', leaguePoints: 250, currentLeague: 'silver', position: 10 },
];

export const MOCK_BADGES: Badge[] = [
  { id: 'bdg_001', slug: 'first_event', name: 'První krok', description: 'Navštívil(a) jsi svou první akci.', icon: '🌱', tier: 'bronze', category: 'milestone', earned: true, earnedAt: '2025-09-20T10:00:00Z' },
  { id: 'bdg_002', slug: 'streak_4w', name: 'Měsíc v kuse', description: '4 týdny po sobě aktivní.', icon: '🔥', tier: 'bronze', category: 'streak', earned: true, earnedAt: '2025-10-15T10:00:00Z' },
  { id: 'bdg_003', slug: 'streak_12w', name: 'Kvartálník', description: '12 týdnů po sobě bez přerušení.', icon: '🔥', tier: 'silver', category: 'streak', earned: true, earnedAt: '2025-12-20T10:00:00Z' },
  { id: 'bdg_004', slug: 'concert_lover', name: 'Milovník koncertů', description: 'Navštívil(a) jsi 5 koncertů.', icon: '🎵', tier: 'silver', category: 'collection', earned: true, earnedAt: '2025-11-10T10:00:00Z' },
  { id: 'bdg_005', slug: 'jbc_explorer', name: 'Průzkumník Jablonce', description: 'Navštívil(a) jsi 10 různých míst ve městě.', icon: '🗺️', tier: 'gold', category: 'collection', earned: false, progress: 9, target: 10 },
  { id: 'bdg_006', slug: 'social_butterfly', name: 'Společenský typ', description: 'Získal(a) jsi 10 přátel.', icon: '🦋', tier: 'silver', category: 'social', earned: true, earnedAt: '2025-12-01T10:00:00Z' },
  { id: 'bdg_007', slug: 'night_owl', name: 'Noční pták', description: 'Absolvoval(a) jsi 3 noční akce.', icon: '🦉', tier: 'silver', category: 'collection', earned: false, progress: 1, target: 3 },
  { id: 'bdg_008', slug: 'summer_2026', name: 'Jablonecké léto 2026', description: 'Speciální sezónní odznak za účast na festivalu.', icon: '☀️', tier: 'legendary', category: 'seasonal', earned: false },
  { id: 'bdg_009', slug: 'runner', name: 'Běžec', description: 'Zaběhl(a) jsi první závod.', icon: '🏃', tier: 'bronze', category: 'milestone', earned: true, earnedAt: '2025-10-15T10:00:00Z' },
  { id: 'bdg_010', slug: 'friend_inviter', name: 'Dobrý zvací', description: 'Pozval(a) jsi 3 kamarády na akci.', icon: '💌', tier: 'bronze', category: 'social', earned: true, earnedAt: '2025-11-20T10:00:00Z' },
  { id: 'bdg_011', slug: 'culture_mix', name: 'Kulturní mix', description: 'Navštiv aspoň jednu akci z každé kategorie.', icon: '🎨', tier: 'gold', category: 'collection', earned: false, progress: 4, target: 7 },
  { id: 'bdg_012', slug: 'mega_event', name: 'Velký zážitek', description: 'Zúčastnil(a) jsi se akce s 1000+ účastníky.', icon: '🎪', tier: 'silver', category: 'milestone', earned: true, earnedAt: '2025-12-15T10:00:00Z' },
];

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 'ch_001', title: 'Koncertní týden', description: 'Navštiv 2 koncerty tento týden', icon: '🎵', targetType: 'category_count', targetValue: 2, categoryFilter: 'concert', rewardPoints: 200, startsAt: '2026-04-13T00:00:00Z', endsAt: '2026-04-19T23:59:59Z', progress: 1, completed: false },
  { id: 'ch_002', title: 'Objevitel', description: 'Navštiv 1 místo, kde jsi ještě nebyl(a)', icon: '🗺️', targetType: 'new_venue', targetValue: 1, rewardPoints: 150, startsAt: '2026-04-13T00:00:00Z', endsAt: '2026-04-19T23:59:59Z', progress: 0, completed: false },
  { id: 'ch_003', title: 'Aktivní týden', description: 'Zúčastni se 3 akcí za týden', icon: '⚡', targetType: 'attend_count', targetValue: 3, rewardPoints: 300, startsAt: '2026-04-13T00:00:00Z', endsAt: '2026-04-19T23:59:59Z', progress: 2, completed: false },
  { id: 'ch_004', title: 'Sportovní duch', description: 'Zúčastni se 1 sportovní akce', icon: '⚽', targetType: 'category_count', targetValue: 1, categoryFilter: 'sport', rewardPoints: 100, startsAt: '2026-04-13T00:00:00Z', endsAt: '2026-04-19T23:59:59Z', progress: 1, completed: true },
];

// Komentáře jen jako seed – při prvním spuštění se nahrají do DB; dál se pracuje s DB.
export const MOCK_COMMENTS: Record<string, Comment[]> = {};
