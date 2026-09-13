import React from 'react';
import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Services — Murals, Ceramics & Custom Art Commissions',
  description:
    'Commission custom wall murals, traditional Rishtan ceramics, or personalized oil paintings with master artists at Art Qala.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services — Murals & Custom Art | Art Qala',
    description: 'Custom murals, ceramics and bespoke art commissions in Tashkent, Uzbekistan.',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
