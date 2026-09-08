import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminInquiriesClient from './AdminInquiriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    include: {
      painting: {
        select: {
          id: true,
          title_en: true,
          price: true,
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  return <AdminInquiriesClient initialInquiries={inquiries} />;
}
