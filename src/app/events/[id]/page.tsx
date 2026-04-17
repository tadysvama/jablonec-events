'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import {
  ArrowLeft, Calendar, MapPin, Users, Heart, Zap, Trophy,
  QrCode, Send, Share2, MessageCircle, UserPlus, Loader2, ExternalLink,
} from 'lucide-react';
import { getEventById } from '@/data/events';
import { CATEGORY_LABELS } from '@/lib/types';
import { formatDate, formatNumber, formatPrice, getRelativeTime, cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';
import { InviteModal } from '@/components/events/InviteModal';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; username: string; avatarUrl: string | null };
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const event = getEventById(id);
  const [commentInput, setCommentInput] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const profile = useStore((s) => s.profile);
  const likes = useStore((s) => s.likes);
  const toggleLike = useStore((s) => s.toggleLike);
  const checkins = useStore((s) => s.checkins);
  const setCheckin = useStore((s) => s.setCheckin);
  const removeCheckin = useStore((s) => s.removeCheckin);
  const addPoints = useStore((s) => s.addPoints);
  const showToast = useStore((s) => s.showToast);

  useEffect(() => {
    if (!event) return;
    const loadComments = async () => {
      try {
        const res = await fetch(`/api/comments/${event.id}`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setComments(data.comments || []);
      } catch (err) {
        console.error('Nepodařilo se načíst komentáře:', err);
      } finally {
        setLoadingComments(false);
      }
    };
    loadComments();
  }, [event]);

  if (!event) return notFound();
  if (!profile) return null;

  const cat = CATEGORY_LABELS[event.category];
  const isLiked = likes.has(event.id);
  const checkinStatus = checkins[event.id];

  const handleCheckin = (status: 'going' | 'interested') => {
    if (checkinStatus === status) {
      removeCheckin(event.id);
      showToast({ title: 'Zrušeno', icon: '↩️' });
    } else {
      setCheckin(event.id, status);
      showToast({
        title: status === 'going' ? 'Jsi přihlášen(a)!' : 'Přidáno do zájmů',
        body: status === 'going' ? `+10 bodů · ${event.basePoints} získáš na místě` : undefined,
        icon: status === 'going' ? '✓' : '⭐',
      });
      if (status === 'going') addPoints(10);
    }
  };

  const handleQRScan = () => {
    setShowQR(false);
    setCheckin(event.id, 'attended' as any);
    addPoints(event.basePoints);
    showToast({
      title: `🎉 +${event.basePoints} bodů!`,
      body: 'Účast potvrzena.',
      icon: '✓',
    });
  };

  const handleSubmitComment = async () => {
    const content = commentInput.trim();
    if (!content || !profile) return;
    setSubmittingComment(true);
    setCommentError(null);
    try {
      const res = await fetch(`/api/comments/${event.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          user: { id: profile.id, name: profile.name, username: profile.username },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Chyba serveru');
      }
      const data = await res.json();
      setComments((prev) => [data.comment, ...prev]);
      setCommentInput('');
      showToast({ title: 'Komentář přidán', icon: '💬' });
    } catch (err: any) {
      setCommentError(err.message || 'Nepodařilo se odeslat');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-10">
        <button
          onClick={() => router.back()}
          className="mb-3 md:mb-4 flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Zpět
        </button>

        <div className="relative aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden mb-5 md:mb-6 shadow-2xl">
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-2 flex-wrap max-w-[calc(100%-120px)]">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold text-white backdrop-blur-md bg-gradient-to-r',
                cat.color
              )}
            >
              <span>{cat.emoji}</span> {cat.cs}
            </span>
            {event.sizeTier === 'mega' && (
              <span className="inline-flex items-center gap-1 px-2 md:px-2.5 py-1 rounded-full text-[11px] md:text-xs font-semibold text-white bg-accent-500/90 backdrop-blur-md">
                <Trophy className="w-3 h-3" /> Mega
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 md:top-4 md:right-4 flex gap-2">
            <button
              onClick={() => toggleLike(event.id)}
              className={cn(
                'w-9 h-9 md:w-10 md:h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all',
                isLiked ? 'bg-accent-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              )}
            >
              <Heart className={cn('w-4 h-4 md:w-5 md:h-5', isLiked && 'fill-white')} />
            </button>
            <button
              onClick={() => setShowInvite(true)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 flex items-center justify-center"
              aria-label="Sdílet"
            >
              <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
            <div className="text-[10px] md:text-xs font-medium opacity-80 uppercase tracking-wider mb-1 md:mb-2">
              {getRelativeTime(event.startsAt)} · {formatDate(event.startsAt, { withTime: true })}
            </div>
            <h1 className="text-xl md:text-4xl font-display font-bold leading-tight">{event.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-5 md:mb-6">
          <div className="card p-3 md:p-4">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">
              <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" /> Datum
            </div>
            <div className="font-semibold text-xs md:text-sm">{formatDate(event.startsAt, { short: true })}</div>
          </div>
          <div className="card p-3 md:p-4">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">
              <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" /> Místo
            </div>
            <div className="font-semibold text-xs md:text-sm truncate">{event.location}</div>
          </div>
          <div className="card p-3 md:p-4">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">
              <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand-600" /> Odměna
            </div>
            <div className="font-semibold text-xs md:text-sm text-brand-600">+{event.basePoints} b.</div>
          </div>
          <div className="card p-3 md:p-4">
            <div className="text-[10px] md:text-xs text-ink-muted uppercase tracking-wider mb-1">Cena</div>
            <div className={cn('font-semibold text-xs md:text-sm', event.price === 0 && 'text-streak-600')}>
              {formatPrice(event.price)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 mb-5 md:mb-6">
          <button
            onClick={() => handleCheckin('going')}
            className={cn(
              'justify-center',
              checkinStatus === 'going' ? 'btn-primary !bg-streak-500 hover:!bg-streak-600' : 'btn-primary'
            )}
          >
            {checkinStatus === 'going' ? '✓ Jdu' : 'Zúčastním se'}
          </button>
          <button
            onClick={() => handleCheckin('interested')}
            className={cn(
              'btn-secondary justify-center',
              checkinStatus === 'interested' && 'border-brand-500 text-brand-700 dark:text-brand-300'
            )}
          >
            {checkinStatus === 'interested' ? '⭐ Zájem' : 'Zajímá mě'}
          </button>
          <button onClick={() => setShowQR(true)} className="btn-secondary justify-center">
            <QrCode className="w-4 h-4" /> QR na místě
          </button>
          <button onClick={() => setShowInvite(true)} className="btn-secondary justify-center">
            <UserPlus className="w-4 h-4" /> Pozvat
          </button>
        </div>

        <div className="grid md:grid-cols-[1fr,280px] gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="card p-4 md:p-6">
            <h2 className="font-display text-lg md:text-xl font-bold mb-3">O akci</h2>
            <p className="text-sm md:text-base text-ink-muted leading-relaxed">{event.description}</p>

            {event.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {event.tags.map((tag) => (
                  <span key={tag} className="chip-brand">#{tag}</span>
                ))}
              </div>
            )}

            <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-border space-y-1 text-sm">
              {event.hostName && (
                <div>
                  <span className="text-ink-muted">Pořadatel: </span>
                  <span className="font-medium">{event.hostName}</span>
                </div>
              )}
              {event.externalUrl && (
                <a
                  href={event.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-600 hover:underline"
                >
                  Zobrazit na 365jablonec.cz <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="card p-4 md:p-6">
            <h3 className="font-display text-base md:text-lg font-bold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Účastníci
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-0 md:space-y-3">
              <div>
                <div className="text-xl md:text-2xl font-display font-bold">{formatNumber(event.attendeeCount)}</div>
                <div className="text-xs text-ink-muted">lidí jde</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{formatNumber(event.interestedCount)}</div>
                <div className="text-xs text-ink-muted">má zájem</div>
              </div>
            </div>
          </div>
        </div>

        <section className="card p-4 md:p-6">
          <h3 className="font-display text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Komentáře · {comments.length}
          </h3>

          <div className="space-y-3 md:space-y-4 mb-4">
            {loadingComments ? (
              <div className="flex items-center justify-center py-6 text-ink-muted text-sm gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Načítám...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-ink-muted text-sm">
                Zatím žádné komentáře. Buď první!
              </div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar name={c.user.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <div className="font-semibold text-sm">{c.user.name}</div>
                      <div className="text-xs text-ink-subtle">@{c.user.username}</div>
                    </div>
                    <div className="text-sm mt-1 leading-relaxed break-words">{c.content}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-ink-muted">
                      <span>{getRelativeTime(c.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {commentError && (
            <div className="mb-3 text-sm text-accent-600 bg-accent-50 dark:bg-accent-950/30 p-3 rounded-lg">
              {commentError}
            </div>
          )}

          <div className="flex gap-2 items-start">
            <Avatar name={profile.name} size="md" className="mt-1 hidden sm:flex" />
            <input
              type="text"
              placeholder={`Komentář jako ${profile.name.split(' ')[0]}...`}
              className="input flex-1"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !submittingComment) handleSubmitComment();
              }}
              disabled={submittingComment}
              maxLength={500}
            />
            <button
              onClick={handleSubmitComment}
              disabled={submittingComment || !commentInput.trim()}
              className="btn-primary flex-shrink-0"
            >
              {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </section>

        {showQR && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowQR(false)}
          >
            <div
              className="bg-surface-elevated rounded-3xl p-6 md:p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-36 h-36 md:w-48 md:h-48 mx-auto bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4">
                <QrCode className="w-20 h-20 md:w-24 md:h-24 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Simulace skenu</h3>
              <p className="text-sm text-ink-muted mb-4">
                Na akci bys teď naskenoval(a) QR kód od pořadatele.
              </p>
              <button onClick={handleQRScan} className="btn-primary w-full justify-center">
                Potvrdit účast · +{event.basePoints} bodů
              </button>
              <button onClick={() => setShowQR(false)} className="btn-ghost w-full mt-2">
                Zrušit
              </button>
            </div>
          </div>
        )}
      </div>

      <InviteModal
        open={showInvite}
        onClose={() => setShowInvite(false)}
        eventId={event.id}
        eventTitle={event.title}
        inviterName={profile.name}
      />
    </>
  );
}
