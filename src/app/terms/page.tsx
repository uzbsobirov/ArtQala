import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service | Art Qala Gallery',
  description: 'Terms of Service for Art Qala Gallery in Tashkent, Uzbekistan. Information regarding original artwork purchases, authenticity certificates, and commissions.',
};

export default function TermsPage() {
  return <TermsClient />;
}
