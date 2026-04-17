import { ImageResponse } from 'next/og';

// Dynamicky generovaný Open Graph image pro link preview
// Vytváří obrázek 1200x630 px s logem "J" v brand gradientu a textem
export const runtime = 'edge';
export const alt = 'JBC Events – Žij Jablonec naplno';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
          fontFamily: 'sans-serif',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Dekorativní kruhy */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(251,113,133,0.15)',
          }}
        />

        {/* Logo "J" s gradientem */}
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '48px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
            marginBottom: '40px',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: '160px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            J
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          JBC Events
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.3,
            display: 'flex',
          }}
        >
          Žij Jablonec naplno – kulturní a sportovní akce hravě
        </div>

        {/* Badges */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '40px',
          }}
        >
          {['🎵 Koncerty', '⚽ Sport', '🎨 Výstavy', '🏛️ Prohlídky'].map((t) => (
            <div
              key={t}
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '12px 24px',
                borderRadius: '999px',
                fontSize: '24px',
                color: 'white',
                fontWeight: 600,
                display: 'flex',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
