'use client';

import Link from 'next/link';
import { MapPin, Users, Heart, Zap, Trophy, Calendar } from 'lucide-react';
import { Event, CATEGORY_LABELS } from '@/lib/types';
import { formatDate, formatNumber, formatPrice, cn, getRelativeTime, getDayOfWeek } from '@/lib/utils';
import { useStore } from '@/lib/store';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'featured' | 'compact';
}

export function EventCard({ event, variant = 'default' }: EventCardProps) {
  const likes = useStore((s) => s.likes);
  const toggleLike = useStore((s) => s.toggleLike);
  const checkins = useStore((s) => s.checkins);

  const isLiked = likes.has(event.id);
  const checkinStatus = checkins[event.id];
  const cat = CATEGORY_LABELS[event.category];

  // Compact varianta – malá horizontální karta do seznamu
  if (variant === 'compact') {
    return (
      <Link href={`/events/${event.id}`} className="card p-3 flex gap-3 items-center group hover:border-brand-300">
        <div className={cn('w-14 h-14 rounded-xl bg-gradient-to-br flex-shrink-0 flex items-center justify-center text-2xl', cat.color)}>
          {cat.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-ink-muted">{getRelativeTime(event.startsAt)}</div>
          <div className="font-semibold truncate group-hover:text-brand-600 transition-colors">{event.title}</div>
          <div className="text-xs text-ink-muted flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {event.location}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-ink-muted">+{event.basePoints}</div>
          <div className="text-xs font-bold text-brand-600">bodů</div>
        </div>
      </Link>
    );
  }

  // Featured varianta – přes 2 sloupce a 2 řádky v gridu
  // Řešení: obrázek vyplní CELOU kartu, meta jsou absolutně nad ním
  if (variant === 'featured') {
    return (
      <Link
        href={`/events/${event.id}`}
        className="group relative card overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade-in block md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[600px]"
      >
        {/* Obrázek na plnou výšku karty */}
        <img
          src={event.coverImage}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay gradient – aby byl text čitelný */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

        {/* Horní chipy */}
        <div className="absolute top-3 md:top-4 left-3 md:left-4 flex gap-2 flex-wrap max-w-[calc(100%-80px)]">
          <span className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold text-white backdrop-blur-md bg-gradient-to-r', cat.color)}>
            <span>{cat.emoji}</span>
            {cat.cs}
          </span>
          {event.sizeTier === 'mega' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-accent-500/90 backdrop-blur-md">
              <Trophy className="w-3 h-3" />
              Mega
            </span>
          )}
        </div>

        {/* Tlačítko lajk */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleLike(event.id);
          }}
          className={cn(
            'absolute top-3 md:top-4 right-3 md:right-4 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all',
            isLiked ? 'bg-accent-500 text-white scale-110' : 'bg-white/20 text-white hover:bg-white/30'
          )}
          aria-label="Lajk"
        >
          <Heart className={cn('w-5 h-5', isLiked && 'fill-white')} />
        </button>

        {/* Status badge když uživatel jde */}
        {checkinStatus === 'going' && (
          <div className="absolute top-16 right-3 md:right-4 px-3 py-1.5 rounded-full bg-streak-500 text-white text-xs font-bold flex items-center gap-1 animate-bounce-in shadow-lg">
            ✓ Jdu
          </div>
        )}
        {checkinStatus === 'interested' && (
          <div className="absolute top-16 right-3 md:right-4 px-3 py-1.5 rounded-full bg-brand-600 text-white text-xs font-bold shadow-lg">
            ⭐ Zájem
          </div>
        )}

        {/* Spodní obsah – vyplní spodní část karty */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium opacity-90 mb-2 md:mb-3 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {getDayOfWeek(event.startsAt)} · {formatDate(event.startsAt, { withTime: true, short: true })}
          </div>

          <h3 className="font-display font-bold leading-tight mb-3 md:mb-4 text-2xl md:text-4xl line-clamp-2">
            {event.title}
          </h3>

          {event.description && (
            <p className="text-xs md:text-sm opacity-80 mb-3 md:mb-4 line-clamp-2 leading-relaxed hidden md:block">
              {event.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <div className="flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 opacity-80" />
                <span className="font-medium truncate">{event.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <Users className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80" />
                <span className="font-semibold">{formatNumber(event.attendeeCount)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80" />
                <span className="font-semibold">{formatNumber(event.likeCount)}</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-bold">+{event.basePoints}</span>
              </div>
              <span className={cn('text-sm md:text-base font-bold', event.price === 0 ? 'text-streak-300' : 'text-white')}>
                {formatPrice(event.price)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default varianta – standardní karta
  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative card overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade-in block"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2 flex-wrap max-w-[calc(100%-60px)]">
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] md:text-xs font-semibold text-white backdrop-blur-md bg-gradient-to-r', cat.color)}>
            <span>{cat.emoji}</span>
            {cat.cs}
          </span>
          {event.sizeTier === 'mega' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] md:text-xs font-semibold text-white bg-accent-500/90 backdrop-blur-md">
              <Trophy className="w-3 h-3" />
              Mega
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleLike(event.id);
          }}
          className={cn(
            'absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all',
            isLiked ? 'bg-accent-500 text-white scale-110' : 'bg-white/20 text-white hover:bg-white/30'
          )}
          aria-label="Lajk"
        >
          <Heart className={cn('w-4 h-4', isLiked && 'fill-white')} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] md:text-xs font-medium opacity-80 uppercase tracking-wider mb-1">
                {getDayOfWeek(event.startsAt)} · {formatDate(event.startsAt, { withTime: true, short: true })}
              </div>
              <h3 className="font-display font-bold leading-tight line-clamp-2 text-base md:text-lg">
                {event.title}
              </h3>
            </div>
          </div>
        </div>

        {checkinStatus === 'going' && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-streak-500 text-white text-xs font-bold flex items-center gap-1 animate-bounce-in">
            ✓ Jdu
          </div>
        )}
        {checkinStatus === 'interested' && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-brand-600 text-white text-xs font-bold">
            ⭐ Zájem
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        <div className="flex items-center gap-1.5 text-xs md:text-sm text-ink-muted min-w-0">
          <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 text-brand-500" />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="flex items-center gap-1 text-xs md:text-sm">
              <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-ink-muted flex-shrink-0" />
              <span className="font-semibold">{formatNumber(event.attendeeCount)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs md:text-sm">
              <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-ink-muted flex-shrink-0" />
              <span className="font-semibold">{formatNumber(event.likeCount)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800">
              <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="text-[11px] md:text-xs font-bold text-brand-700 dark:text-brand-300">+{event.basePoints}</span>
            </div>
            <span className={cn('text-xs md:text-sm font-semibold', event.price === 0 ? 'text-streak-600' : 'text-ink')}>
              {formatPrice(event.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
