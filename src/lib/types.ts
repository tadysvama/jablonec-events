// Centrální typy – sdílené mezi frontendem a mock daty

export type EventCategory =
  | 'concert'
  | 'sport'
  | 'exhibition'
  | 'tour'
  | 'theatre'
  | 'festival'
  | 'workshop';

export type SizeTier = 'small' | 'medium' | 'large' | 'mega';

export type League = 'bronze' | 'silver' | 'gold' | 'diamond';

export type CheckinStatus = 'interested' | 'going' | 'attended';

export type PrivacyMode = 'public' | 'friends' | 'private';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  coverImage: string;
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  startsAt: string; // ISO
  endsAt?: string;
  capacity?: number;
  price: number;
  basePoints: number;
  sizeTier: SizeTier;
  attendeeCount: number;
  interestedCount: number;
  likeCount: number;
  commentCount: number;
  hostName?: string;
  hostId?: string;
  externalUrl?: string;
  tags?: string[];
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  birthYear?: number;
  gender?: string;
  city?: string;
  interests: EventCategory[];
  privacyMode: PrivacyMode;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  currentLeague: League;
  leaguePoints: number;
  lastActiveAt?: string;
  createdAt: string;
  stats: {
    eventsAttended: number;
    badgesEarned: number;
    friendsCount: number;
    venuesVisited: number;
  };
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'legendary';
  category: 'streak' | 'collection' | 'social' | 'seasonal' | 'milestone';
  earned?: boolean;
  earnedAt?: string;
  progress?: number;
  target?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetType: 'attend_count' | 'category_count' | 'new_venue' | 'streak_days';
  targetValue: number;
  categoryFilter?: EventCategory;
  rewardPoints: number;
  startsAt: string;
  endsAt: string;
  progress: number;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Friend {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  totalPoints: number;
  currentStreak: number;
  currentLeague: League;
  isOnline?: boolean;
  commonEvents?: number;
}

export interface LeagueEntry {
  userId: string;
  username: string;
  name: string;
  avatarUrl: string;
  leaguePoints: number;
  currentLeague: League;
  position: number;
  isMe?: boolean;
}

export const CATEGORY_LABELS: Record<EventCategory, { cs: string; emoji: string; color: string }> = {
  concert: { cs: 'Koncerty', emoji: '🎵', color: 'from-pink-500 to-rose-500' },
  sport: { cs: 'Sport', emoji: '⚽', color: 'from-emerald-500 to-teal-500' },
  exhibition: { cs: 'Výstavy', emoji: '🎨', color: 'from-amber-500 to-orange-500' },
  tour: { cs: 'Prohlídky', emoji: '🏛️', color: 'from-blue-500 to-indigo-500' },
  theatre: { cs: 'Divadlo', emoji: '🎭', color: 'from-purple-500 to-violet-500' },
  festival: { cs: 'Festivaly', emoji: '🎪', color: 'from-fuchsia-500 to-pink-500' },
  workshop: { cs: 'Workshopy', emoji: '🛠️', color: 'from-cyan-500 to-blue-500' },
};

export const LEAGUE_META: Record<League, { label: string; icon: string; color: string; bg: string }> = {
  bronze: { label: 'Bronzová liga', icon: '🥉', color: '#cd7f32', bg: 'from-amber-700 to-amber-900' },
  silver: { label: 'Stříbrná liga', icon: '🥈', color: '#c0c0c0', bg: 'from-slate-400 to-slate-600' },
  gold: { label: 'Zlatá liga', icon: '🥇', color: '#ffd700', bg: 'from-yellow-400 to-amber-600' },
  diamond: { label: 'Diamantová liga', icon: '💎', color: '#b9f2ff', bg: 'from-cyan-400 to-blue-600' },
};

export const SIZE_TIER_POINTS: Record<SizeTier, number> = {
  small: 30,
  medium: 75,
  large: 150,
  mega: 300,
};
