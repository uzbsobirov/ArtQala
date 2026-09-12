import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminAccessoriesClient from './AdminAccessoriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminAccessoriesPage() {
  const accessories = await prisma.accessory.findMany({
    orderBy: { created_at: 'desc' },
  });

  return <AdminAccessoriesClient initialAccessories={accessories} />;
}
