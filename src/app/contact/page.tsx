import React from 'react';
import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us & Gallery Location | Tashkent',
  description: 'Visit Art Qala Gallery at Barakhon Madrasah, Tashkent, Uzbekistan. Get in touch for original art consultations, bespoke commissions, and worldwide delivery.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Art Qala Gallery | Barakhon Madrasah, Tashkent',
    description: 'Visit our historical gallery in Tashkent or reach our curators for bespoke commissions and inquiries.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

