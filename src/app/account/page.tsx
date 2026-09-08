'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import PaintingCard, { PaintingItem } from '@/components/PaintingCard';
import {
  User,
  Heart,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  Shield,
  Palette,
  ExternalLink,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, signOut, formatPrice, wishlist, lang } = useApp();

  const [activeTab, setActiveTab] = useState<'inquiries' | 'wishlist' | 'profile'>('inquiries');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [wishlistPaintings, setWishlistPaintings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch inquiries
        const inqRes = await fetch('/api/user/inquiries');
        if (inqRes.ok) {
          const inqData = await inqRes.json();
          if (inqData.success) {
            setInquiries(inqData.inquiries || []);
            setServiceRequests(inqData.serviceRequests || []);
          }
        }

        // Fetch wishlist items
        const wishRes = await fetch('/api/paintings');
        if (wishRes.ok) {
          const wishData = await wishRes.json();
          if (wishData.success) {
            const allP = wishData.paintings || [];
            setWishlistPaintings(allP.filter((p: any) => wishlist.includes(p.id)));
          }
        }
      } catch (err) {
        console.error('Error loading account data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [wishlist]);

  // If not logged in, show prompt
  if (!user && !loading) {
    return (
      <div className="py-20 px-6 flex items-center justify-center min-h-[65vh]">
        <div className="max-w-md w-full bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#BA4E25]/10 text-[#BA4E25] flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#281C18]">
            Sign in to access your account
          </h2>
          <p className="text-xs text-[#726861] leading-relaxed">
            Please log in to track your painting inquiries, view your custom service orders, and sync your saved wishlist.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/signin"
              className="bg-[#BA4E25] hover:bg-[#9C3E1B] text-white text-xs font-semibold py-2.5 rounded-[3px] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="border border-[#E7E0D8] text-[#554740] hover:border-[#BA4E25] hover:text-[#BA4E25] text-xs font-semibold py-2.5 rounded-[3px] transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="bg-[#E0F2FE] text-[#0369A1] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            Under Review
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="bg-[#FEF3C7] text-[#B45309] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            In Progress
          </span>
        );
      case 'ANSWERED':
        return (
          <span className="bg-[#DCFCE7] text-[#15803D] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            Answered
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-[#F3E8FF] text-[#7E22CE] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Profile Header Banner */}
        <div className="bg-[#281C18] text-[#FAF4EC] rounded-[4px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#BA4E25] text-white font-serif font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {user?.name?.slice(0, 2).toUpperCase() || 'AQ'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold">
                  {user?.name}
                </h1>
                {user?.email_verified && (
                  <span className="bg-[#429599]/25 text-[#5AB3B7] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-[#429599]/40">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-[#C5B7AD] mt-1">
                {user?.email} {user?.country ? `· ${user.country}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="bg-[#429599] hover:bg-[#337C80] text-white text-xs font-semibold px-4 py-2 rounded-[3px] transition-all flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
            <button
              onClick={() => signOut()}
              className="border border-[#4A3B35] hover:border-[#BA4E25] text-[#FAF4EC] hover:text-[#BA4E25] text-xs font-semibold px-4 py-2 rounded-[3px] transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-[#E7E0D8] mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 pb-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap px-1 ${
              activeTab === 'inquiries'
                ? 'border-[#BA4E25] text-[#BA4E25]'
                : 'border-transparent text-[#6B5E55] hover:text-[#281C18]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries &amp; Orders ({inquiries.length + serviceRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 pb-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap px-1 ${
              activeTab === 'wishlist'
                ? 'border-[#BA4E25] text-[#BA4E25]'
                : 'border-transparent text-[#6B5E55] hover:text-[#281C18]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Artworks ({wishlistPaintings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 pb-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap px-1 ${
              activeTab === 'profile'
                ? 'border-[#BA4E25] text-[#BA4E25]'
                : 'border-transparent text-[#6B5E55] hover:text-[#281C18]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
        </div>

        {/* Tab 1: Inquiries & Service Requests */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8">
            {/* Painting Inquiries */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#281C18] mb-4">
                Painting Inquiries
              </h2>

              {inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map((inq) => {
                    let thumb = '/assets/p-arch.svg';
                    try {
                      const pImages = JSON.parse(inq.painting?.images || '[]');
                      if (pImages.length > 0) thumb = pImages[0];
                    } catch {}

                    return (
                      <div
                        key={inq.id}
                        className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[3px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-[2px] overflow-hidden relative border border-[#E7E0D8] shrink-0 bg-[#F4ECE1]">
                            <Image
                              src={thumb}
                              alt="Painting thumbnail"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/gallery/${inq.painting?.id}`}
                              className="font-serif font-semibold text-lg text-[#281C18] hover:text-[#BA4E25] flex items-center gap-1.5"
                            >
                              <span>{inq.painting?.title_en || 'Painting'}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-[#8F8178]" />
                            </Link>
                            <p className="text-xs text-[#726861] mt-0.5">
                              by {inq.painting?.artist?.name} · {formatPrice(inq.painting?.price || 0)}
                            </p>
                            <p className="text-xs text-[#554740] mt-1.5 italic bg-[#F7F3EE] p-2 rounded-[2px] max-w-lg">
                              "{inq.message}"
                            </p>
                            {inq.admin_reply && (
                              <div className="mt-2 text-xs text-[#15803D] bg-[#DCFCE7]/50 p-2 rounded-[2px] border border-[#BBF7D0]">
                                <strong>Curator Reply:</strong> {inq.admin_reply}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {getStatusBadge(inq.status)}
                          <span className="text-[11px] text-[#9E9086] mt-1">
                            {new Date(inq.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#726861] bg-[#FDFBF9] p-6 rounded-[3px] border border-[#E7E0D8]">
                  No painting inquiries submitted yet. Explore the{' '}
                  <Link href="/gallery" className="text-[#BA4E25] underline font-semibold">
                    Gallery
                  </Link>{' '}
                  to discover original pieces.
                </p>
              )}
            </div>

            {/* Service Requests */}
            <div className="pt-4">
              <h2 className="font-serif text-2xl font-semibold text-[#281C18] mb-4">
                Custom Commissions &amp; Murals
              </h2>

              {serviceRequests.length > 0 ? (
                <div className="space-y-4">
                  {serviceRequests.map((sr) => (
                    <div
                      key={sr.id}
                      className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[3px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold tracking-wider uppercase text-[#BA4E25]">
                            {sr.service_type}
                          </span>
                          <span className="text-[#A8988E]">·</span>
                          <span className="text-xs text-[#726861]">
                            Contact: {sr.guest_contact}
                          </span>
                        </div>
                        <p className="text-sm text-[#281C18]">{sr.description}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {getStatusBadge(sr.status)}
                        <span className="text-[11px] text-[#9E9086] mt-1">
                          {new Date(sr.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#726861] bg-[#FDFBF9] p-6 rounded-[3px] border border-[#E7E0D8]">
                  No custom service requests submitted yet. Check our{' '}
                  <Link href="/services" className="text-[#BA4E25] underline font-semibold">
                    Services
                  </Link>{' '}
                  for murals, ceramics, and custom commissions.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Saved Artworks (Wishlist) */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistPaintings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
                {wishlistPaintings.map((painting) => (
                  <div key={painting.id}>
                    <PaintingCard painting={painting as PaintingItem} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#FDFBF9] border border-[#E7E0D8] rounded-[3px] space-y-3">
                <Heart className="w-8 h-8 text-[#BA4E25] mx-auto opacity-75" />
                <h3 className="font-serif text-xl font-semibold text-[#281C18]">
                  No saved artworks yet
                </h3>
                <p className="text-xs text-[#726861] max-w-sm mx-auto">
                  Browse our collection and tap the heart icon on any canvas to keep it here.
                </p>
                <Link
                  href="/gallery"
                  className="inline-block bg-[#BA4E25] hover:bg-[#9C3E1B] text-white text-xs font-semibold px-5 py-2.5 rounded-[3px] transition-all mt-2"
                >
                  Explore Gallery
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile Details */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-[#FDFBF9] border border-[#E7E0D8] rounded-[3px] p-8 space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-[#281C18]">
              Account Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.name || ''}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-[#E7E0D8] rounded-[2px] text-[#4D3F38]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-[#E7E0D8] rounded-[2px] text-[#4D3F38]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.country || 'Uzbekistan'}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-[#E7E0D8] rounded-[2px] text-[#4D3F38]"
                />
              </div>

              <div className="pt-2">
                <span className="text-xs text-[#8F8178]">
                  Account Role: <strong className="text-[#281C18]">{user?.role}</strong>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
