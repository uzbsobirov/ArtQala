import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminBranchesClient from './AdminBranchesClient';

export const dynamic = 'force-dynamic';

export default async function AdminBranchesPage() {
  const branches = await prisma.branch.findMany({
    orderBy: { order: 'asc' },
  });

  return <AdminBranchesClient initialBranches={branches} />;
}
