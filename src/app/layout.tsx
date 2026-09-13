import type { Metadata } from 'next';
import { Cormorant_Garamond, Work_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import KhorezmScrollTrack from '@/components/patterns/KhorezmScrollTrack';
import { prisma } from '@/lib/prisma';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const siteUrl = process.env.NEXTAUTH_URL || 'https://artqala.uz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Art Qala — Gallery & Studio | Tashkent, Uzbekistan',
    template: '%s | Art Qala Gallery',
  },
  description:
    'Art Qala is a premier art gallery in Tashkent, Uzbekistan, showcasing original paintings of historical monuments, portraits, and traditional crafts, alongside custom murals and ceramics.',
  alternates: {
    canonical: '/',
  },
  keywords: [
    'Tashkent art gallery',
    'Uzbekistan paintings',
    'Tashkent art',
    'Barakhon Madrasah gallery',
    'Ikat ceramics',
    'Custom murals Tashkent',
    'Original Central Asian art',
  ],
  authors: [{ name: 'Art Qala Gallery' }],
  creator: 'Art Qala',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Art Qala — Gallery & Studio | Tashkent, Uzbekistan',
    description:
      'Paintings that carry the soul of Uzbekistan — historical monuments, portraits and everyday craft, alongside custom murals and ceramics.',
    siteName: 'Art Qala Gallery',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Art Qala — Gallery & Studio | Tashkent, Uzbekistan',
    description:
      'Paintings that carry the soul of Uzbekistan — original artworks from Tashkent.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import VisitTracker from '@/components/analytics/VisitTracker';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

async function getOrganizationJsonLd() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    const address = settings?.address || 'Barakhon Madrasah, Tashkent, Uzbekistan';
    return {
      '@context': 'https://schema.org',
      '@type': 'ArtGallery',
      name: 'Art Qala',
      description:
        'Art Qala is a premier art gallery in Tashkent, Uzbekistan, showcasing original paintings of historical monuments, portraits, and traditional crafts, alongside custom murals and ceramics.',
      url: siteUrl,
      image: `${siteUrl}/logo.png`,
      telephone: settings?.phone || '+998 66 233 44 55',
      email: settings?.email || 'info@artqala.uz',
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
        addressLocality: 'Tashkent',
        addressCountry: 'UZ',
      },
      ...(settings?.location_map ? { hasMap: settings.location_map } : {}),
      sameAs: [settings?.telegram, settings?.instagram].filter(Boolean),
    };
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = await getOrganizationJsonLd();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${workSans.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF4EC] text-[#281C18] selection:bg-[#BA4E25] selection:text-white">
        {orgJsonLd && (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
        )}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        <AppProvider>
          <VisitTracker />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <KhorezmScrollTrack />
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
