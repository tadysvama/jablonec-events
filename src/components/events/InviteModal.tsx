'use client';

import { useEffect, useState } from 'react';
import { Copy, Check, Share2, X, QrCode as QrIcon } from 'lucide-react';

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  inviterName: string;
}

// Offline QR generator: vygeneruje SVG přes externí API
// (kdyby někdy offline – fallback na textový odkaz, který pořád jde zkopírovat)
function buildQrUrl(url: string, size = 300): string {
  const encoded = encodeURIComponent(url);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&margin=10`;
}

export function InviteModal({ open, onClose, eventId, eventTitle, inviterName }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Sestav URL s utm parametrem, aby bylo poznat, že přišel přes pozvánku
    const url = `${window.location.origin}/events/${eventId}?invitedBy=${encodeURIComponent(inviterName)}`;
    setInviteUrl(url);
    setCanShare(!!navigator.share);
  }, [eventId, inviterName]);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    // ESC pro zavření
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = inviteUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `Přidej se se mnou na akci: ${eventTitle}`,
        text: `${inviterName} tě zve na "${eventTitle}" přes JBC Events.`,
        url: inviteUrl,
      });
    } catch {
      /* user zrušil sdílení */
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-elevated rounded-3xl p-5 md:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-muted hover:bg-border flex items-center justify-center"
          aria-label="Zavřít"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <QrIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-display text-lg md:text-xl font-bold mb-1">Pozvi kamaráda</h3>
          <p className="text-xs md:text-sm text-ink-muted">
            Naskenuj QR kód nebo pošli odkaz na akci.
          </p>
        </div>

        {/* QR kód */}
        <div className="bg-white rounded-2xl p-4 mb-4 flex items-center justify-center">
          {inviteUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={buildQrUrl(inviteUrl, 300)}
              alt="QR kód s odkazem na akci"
              className="w-48 h-48 md:w-56 md:h-56"
            />
          ) : (
            <div className="w-48 h-48 md:w-56 md:h-56 bg-surface-muted rounded-xl" />
          )}
        </div>

        {/* Link s kopírováním */}
        <div className="mb-3">
          <div className="text-xs font-medium text-ink-muted mb-1.5 uppercase tracking-wider">
            Odkaz ke sdílení
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="input flex-1 !text-xs !py-2 font-mono"
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={handleCopy}
              className="btn-primary !px-3 flex-shrink-0"
              aria-label="Kopírovat odkaz"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <div className="text-xs text-streak-600 mt-1.5 flex items-center gap-1">
              <Check className="w-3 h-3" /> Zkopírováno do schránky
            </div>
          )}
        </div>

        {/* Native share button (mobil) */}
        {canShare && (
          <button
            onClick={handleShare}
            className="btn-secondary w-full justify-center"
          >
            <Share2 className="w-4 h-4" /> Sdílet přes aplikaci
          </button>
        )}

        <p className="text-[11px] text-ink-subtle text-center mt-3">
          Referenční program (bonusové body) ještě není aktivní.
        </p>
      </div>
    </div>
  );
}
