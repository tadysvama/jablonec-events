import { Event, EventCategory, User } from './types';

// ========== DATUM A ČAS ==========
export function formatDate(iso: string, opts?: { withTime?: boolean; short?: boolean }): string {
  const d = new Date(iso);
  const dateFormat: Intl.DateTimeFormatOptions = opts?.short
    ? { day: 'numeric', month: 'short' }
    : { day: 'numeric', month: 'long', year: 'numeric' };

  const formatted = d.toLocaleDateString('cs-CZ', dateFormat);
  if (!opts?.withTime) return formatted;

  const time = d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  return `${formatted} · ${time}`;
}

export function getRelativeTime(iso: string): string {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = then.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffDays === 0) {
    if (Math.abs(diffHours) < 1) return 'právě teď';
    if (diffHours > 0) return `za ${diffHours} h`;
    return `před ${Math.abs(diffHours)} h`;
  }
  if (diffDays === 1) return 'zítra';
  if (diffDays === -1) return 'včera';
  if (diffDays > 0 && diffDays < 7) return `za ${diffDays} dní`;
  if (diffDays < 0 && diffDays > -7) return `před ${Math.abs(diffDays)} dny`;

  return formatDate(iso, { short: true });
}

export function getDayOfWeek(iso: string): string {
  const days = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
  return days[new Date(iso).getDay()];
}

// ========== ČÍSLA ==========
export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k`;
  return n.toString();
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Zdarma';
  return `${price} Kč`;
}

// ========== DOPORUČOVACÍ ALGORITMUS ==========
/**
 * Jednoduchý skórovací algoritmus pro doporučení akcí uživateli.
 * Kombinuje: zájmy uživatele + historii (mock) + popularitu + proximita v čase.
 * V produkci by to byl ML model nebo složitější collaborative filtering.
 */
export function scoreEventForUser(event: Event, user: User, attendedCategoryCounts: Record<EventCategory, number>): number {
  let score = 0;

  // 1. Explicitní zájmy ze setupu (velká váha)
  if (user.interests.includes(event.category)) score += 50;

  // 2. Historické návyky – co navštěvoval nejčastěji
  const totalAttended = Object.values(attendedCategoryCounts).reduce((a, b) => a + b, 0);
  if (totalAttended > 0) {
    const catRatio = (attendedCategoryCounts[event.category] || 0) / totalAttended;
    score += Math.round(catRatio * 40);
  }

  // 3. Popularita (social proof)
  score += Math.min(20, Math.floor(event.attendeeCount / 100));

  // 4. Blízkost v čase – preferuj akce v příštích 14 dnech
  const daysUntil = (new Date(event.startsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysUntil < 0) score -= 100; // minulé akce úplně dolů
  else if (daysUntil < 3) score += 15;
  else if (daysUntil < 14) score += 10;
  else if (daysUntil > 30) score -= 5;

  // 5. Random prvek pro objevování – ať není feed úplně stejný
  score += Math.random() * 5;

  return score;
}

export function recommendEvents(events: Event[], user: User, attendedHistory: EventCategory[]): Event[] {
  // Spočítám historii
  const catCounts = attendedHistory.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<EventCategory, number>);

  return [...events]
    .map((e) => ({ event: e, score: scoreEventForUser(e, user, catCounts) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.event);
}

// ========== STREAK LOGIKA ==========
export function getStreakStatus(lastActiveAt?: string): 'safe' | 'at_risk' | 'broken' {
  if (!lastActiveAt) return 'broken';
  const now = new Date();
  const last = new Date(lastActiveAt);
  const hoursSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

  if (hoursSince < 20) return 'safe';
  if (hoursSince < 36) return 'at_risk';
  return 'broken';
}

// ========== CN UTIL ==========
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
