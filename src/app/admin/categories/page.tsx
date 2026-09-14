import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminCategoriesClient from './AdminCategoriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      _count: { select: { paintings: true } },
    },
    orderBy: { created_at: 'asc' },
  });

  return <AdminCategoriesClient initialCategories={categories} />;
}
