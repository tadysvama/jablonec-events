'use client';

import { useEffect, useState } from 'react';
import { Copy, Check, Share2, X, QrCode as QrIcon, ExternalLink } from 'lucide-react';

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  inviterName: string;
}

/**
 * QR kód generujeme přes dva různé externí servery (oba zdarma, bez API klíče).
 * Pokud první selže, browser automaticky zkusí druhý (onError handler).
 * Jako 3. fallback máme text odkazu ke zkopírování / sdílení.
 */
function buildQrUrl(url: string, size: number, server: 'qrserver' | 'google'): string {
  const encoded = encodeURIComponent(url);
  if (server === 'google') {
    // Deprecated, ale pořád funguje
    return `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encoded}&choe=UTF-8`;
  }
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&margin=10`;
}

export function InviteModal({ open, onClose, eventId, eventTitle, inviterName }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [qrSrc, setQrSrc] = useState('');
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/events/${eventId}?invitedBy=${encodeURIComponent(inviterName)}`;
    setInviteUrl(url);
    setQrSrc(buildQrUrl(url, 300, 'qrserver'));
    setQrError(false);
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, [eventId, inviterName, open]);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Když první QR server selže, zkus druhý
  const handleQrError = () => {
    if (qrSrc.includes('qrserver.com')) {
      setQrSrc(buildQrUrl(inviteUrl, 300, 'google'));
    } else {
      setQrError(true); // oba selhaly, ukážeme fallback
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        // fallback pro starší browsery / http kontext
        const el = document.createElement('textarea');
        el.value = inviteUrl;
        el.style.position = 'fixed';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `Přidej se na akci: ${eventTitle}`,
        text: `${inviterName} tě zve na "${eventTitle}" přes JBC Events.`,
        url: inviteUrl,
      });
    } catch (err) {
      // user zrušil sdílení nebo share neproběhl
      console.debug('Share cancelled', err);
    }
  };

  const handleOpenDirectly = () => {
    window.open(inviteUrl, '_blank', 'noopener,noreferrer');
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-elevated rounded-t-3xl md:rounded-3xl p-5 md:p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto relative animate-slide-up safe-area-pb"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-muted hover:bg-border flex items-center justify-center z-10"
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
        <div className="bg-white rounded-2xl p-4 mb-4 flex items-center justify-center min-h-[200px]">
          {inviteUrl && !qrError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={qrSrc}
              alt="QR kód s odkazem na akci"
              className="w-44 h-44 md:w-52 md:h-52"
              onError={handleQrError}
            />
          ) : qrError ? (
            <div className="text-center text-xs text-gray-600 py-6 px-4">
              <div className="text-3xl mb-2">📡</div>
              <div>QR server není dostupný.<br/>Použij tlačítka níž.</div>
            </div>
          ) : (
            <div className="w-44 h-44 md:w-52 md:h-52 bg-gray-100 rounded-xl animate-pulse" />
          )}
        </div>

        {/* Link ke zkopírování */}
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
              title="Kopírovat"
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

        {/* Sdílet / otevřít – vždy něco zobrazeno */}
        <div className="space-y-2">
          {canShare ? (
            <button
              onClick={handleShare}
              className="btn-primary w-full justify-center"
            >
              <Share2 className="w-4 h-4" /> Sdílet přes aplikaci
            </button>
          ) : (
            <button
              onClick={handleOpenDirectly}
              className="btn-secondary w-full justify-center"
            >
              <ExternalLink className="w-4 h-4" /> Otevřít odkaz v nové záložce
            </button>
          )}
        </div>

        <p className="text-[11px] text-ink-subtle text-center mt-3">
          Referenční program (bonusové body) ještě není aktivní.
        </p>
      </div>
    </div>
  );
}
