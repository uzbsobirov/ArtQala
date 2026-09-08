import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch real counts from DB
  const totalPaintings = await prisma.painting.count();
  const soldPaintings = await prisma.painting.count({ where: { is_sold: true } });
  const newInquiriesCount = await prisma.inquiry.count({ where: { status: 'NEW' } });
  const totalInquiries = await prisma.inquiry.count();
  const serviceRequestsCount = await prisma.serviceRequest.count();
  const activeDiscountsCount = await prisma.discount.count({ where: { is_active: true } });

  // Recent inquiries
  const recentInquiries = await prisma.inquiry.findMany({
    take: 4,
    orderBy: { created_at: 'desc' },
    include: {
      painting: { select: { title_en: true } },
    },
  });

  // Top viewed paintings
  const topViewedPaintings = await prisma.painting.findMany({
    take: 3,
    orderBy: { views_count: 'desc' },
    include: {
      artist: { select: { name: true } },
      _count: { select: { inquiries: true } },
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="bg-[#E0F2FE] text-[#0284C7] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            New
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            In progress
          </span>
        );
      case 'ANSWERED':
        return (
          <span className="bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            Answered
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-5 shadow-xs">
          <div className="text-[11px] font-bold tracking-wider text-[#726861] uppercase mb-1">
            TOTAL PAINTINGS
          </div>
          <div className="font-serif text-3xl font-semibold text-[#281C18]">
            {totalPaintings}
          </div>
          <div className="text-xs text-[#429599] font-medium mt-1">
            {soldPaintings} marked as sold
          </div>
        </div>

        <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-5 shadow-xs">
          <div className="text-[11px] font-bold tracking-wider text-[#726861] uppercase mb-1">
            NEW INQUIRIES
          </div>
          <div className="font-serif text-3xl font-semibold text-[#BA4E25]">
            {newInquiriesCount || totalInquiries}
          </div>
          <div className="text-xs text-[#8F8178] mt-1">
            {newInquiriesCount} awaiting reply
          </div>
        </div>

        <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-5 shadow-xs">
          <div className="text-[11px] font-bold tracking-wider text-[#726861] uppercase mb-1">
            SERVICE REQUESTS
          </div>
          <div className="font-serif text-3xl font-semibold text-[#281C18]">
            {serviceRequestsCount}
          </div>
          <div className="text-xs text-[#429599] font-medium mt-1">
            Murals &amp; ceramics
          </div>
        </div>

        <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-5 shadow-xs">
          <div className="text-[11px] font-bold tracking-wider text-[#726861] uppercase mb-1">
            ACTIVE DISCOUNTS
          </div>
          <div className="font-serif text-3xl font-semibold text-[#281C18]">
            {activeDiscountsCount}
          </div>
          <div className="text-xs text-[#8F8178] mt-1">
            Priority hierarchy active
          </div>
        </div>
      </div>

      {/* Recent Inquiries Table Panel */}
      <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#F0EAE1]">
          <h2 className="font-serif text-lg font-semibold text-[#281C18]">
            Recent Inquiries
          </h2>
          <Link
            href="/admin/inquiries"
            className="text-xs font-semibold text-[#BA4E25] hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7E0D8] text-[#8F8178] font-bold tracking-wider uppercase text-[10.5px]">
                <th className="py-2.5 px-3">CUSTOMER</th>
                <th className="py-2.5 px-3">PAINTING</th>
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {recentInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-[#FAF4EC]/50 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-[#281C18]">
                    {inq.guest_name || 'Guest Customer'}
                  </td>
                  <td className="py-3.5 px-3 text-[#554740]">
                    {inq.painting?.title_en || 'Artwork'}
                  </td>
                  <td className="py-3.5 px-3 text-[#8F8178]">
                    {new Date(inq.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {getStatusBadge(inq.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Most Viewed This Month Table Panel */}
      <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#F0EAE1]">
          <h2 className="font-serif text-lg font-semibold text-[#281C18]">
            Most Viewed This Month
          </h2>
          <Link
            href="/admin/paintings"
            className="text-xs font-semibold text-[#BA4E25] hover:underline flex items-center gap-1"
          >
            <span>Full catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7E0D8] text-[#8F8178] font-bold tracking-wider uppercase text-[10.5px]">
                <th className="py-2.5 px-3">PAINTING</th>
                <th className="py-2.5 px-3">ARTIST</th>
                <th className="py-2.5 px-3">VIEWS</th>
                <th className="py-2.5 px-3 text-right">INQUIRIES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {topViewedPaintings.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF4EC]/50 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-[#281C18]">
                    {p.title_en}
                  </td>
                  <td className="py-3.5 px-3 text-[#554740]">{p.artist.name}</td>
                  <td className="py-3.5 px-3 font-mono font-medium text-[#281C18]">
                    {p.views_count}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-[#BA4E25]">
                    {p._count.inquiries}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
