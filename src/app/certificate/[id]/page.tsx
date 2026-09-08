import React from 'react';
import { notFound } from 'next/navigation';
import { getPaintingById } from '@/lib/api';
import CertificateClient from './CertificateClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function CertificatePage({ params }: PageProps) {
  const { id } = await params;
  const painting = await getPaintingById(id);

  if (!painting) {
    notFound();
  }

  return <CertificateClient painting={painting} />;
}
