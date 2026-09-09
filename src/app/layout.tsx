import type { Metadata } from 'next';
import { Cormorant_Garamond, Work_Sans } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${workSans.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF4EC] text-[#281C18] selection:bg-[#BA4E25] selection:text-white">
        <AppProvider>
          <VisitTracker />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
