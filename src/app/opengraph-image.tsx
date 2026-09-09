import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Art Qala — Gallery & Studio | Tashkent, Uzbekistan';
export const size = {
  width: 1200,
  height: 630,
};
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
          backgroundColor: '#1D100B',
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(186, 78, 37, 0.4) 0%, rgba(29, 16, 11, 0.95) 70%)',
          color: '#FAF4EC',
          padding: '60px 40px',
          fontFamily: 'serif',
          border: '14px solid #BA4E25',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Top Tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '18px',
            letterSpacing: '6px',
            color: '#DAA932',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: '20px',
          }}
        >
          TASHKENT · UZBEKISTAN
        </div>

        {/* Main Brand Title */}
        <div
          style={{
            fontSize: '78px',
            fontWeight: 'bold',
            color: '#FAF4EC',
            letterSpacing: '2px',
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          Art Qala Gallery
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            color: '#D2C5BC',
            maxWidth: '820px',
            textAlign: 'center',
            lineHeight: 1.5,
            marginBottom: '36px',
            fontFamily: 'sans-serif',
          }}
        >
          Paintings that carry the soul of Uzbekistan — historical monuments, portraits, traditional crafts, murals &amp; ceramics.
        </div>

        {/* Cultural Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '16px',
            color: '#FAF4EC',
            backgroundColor: 'rgba(186, 78, 37, 0.6)',
            padding: '12px 32px',
            borderRadius: '4px',
            border: '1px solid #DAA932',
            fontFamily: 'sans-serif',
            letterSpacing: '1px',
          }}
        >
          <span>Barakhon Madrasah</span>
          <span>·</span>
          <span>Original Artworks</span>
          <span>·</span>
          <span>Worldwide Shipping</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
