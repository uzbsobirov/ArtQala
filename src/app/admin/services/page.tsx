import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminServicesClient from './AdminServicesClient';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const serviceRequests = await prisma.serviceRequest.findMany({
    include: {
      messages: {
        orderBy: { created_at: 'asc' },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  return <AdminServicesClient initialRequests={serviceRequests} />;
}
