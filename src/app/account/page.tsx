'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import PaintingCard, { PaintingItem } from '@/components/PaintingCard';
import ChatModal, { ThreadMessage } from '@/components/chat/ChatModal';
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
  MessageCircle,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, signOut, formatPrice, wishlist, lang, t } = useApp();

  const [activeTab, setActiveTab] = useState<'inquiries' | 'wishlist' | 'profile'>('inquiries');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [wishlistPaintings, setWishlistPaintings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active chat state
  const [activeChat, setActiveChat] = useState<{
    type: 'inquiry' | 'service';
    item: any;
  } | null>(null);

  const fetchInquiries = async () => {
    try {
      const inqRes = await fetch('/api/user/inquiries');
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        if (inqData.success) {
          setInquiries(inqData.inquiries || []);
          setServiceRequests(inqData.serviceRequests || []);
          setTotalUnread(inqData.totalUnreadCount || 0);

          // Update activeChat if currently open
          if (activeChat) {
            const updatedItem =
              activeChat.type === 'inquiry'
                ? (inqData.inquiries || []).find((i: any) => i.id === activeChat.item.id)
                : (inqData.serviceRequests || []).find((s: any) => s.id === activeChat.item.id);
            if (updatedItem) {
              setActiveChat({ type: activeChat.type, item: updatedItem });
            }
          }
        }
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchInquiries();

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

  // Handle opening chat
  const handleOpenChat = async (type: 'inquiry' | 'service', item: any) => {
    setActiveChat({ type, item });

    // If there were unread messages, mark as read
    if (item.unreadCount > 0) {
      try {
        await fetch(`/api/${type === 'inquiry' ? 'inquiries' : 'services'}/${item.id}/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ viewer: 'CUSTOMER' }),
        });

        // Update local state
        setTotalUnread((prev) => Math.max(0, prev - item.unreadCount));
        if (type === 'inquiry') {
          setInquiries((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    unreadCount: 0,
                    messages: i.messages.map((m: any) =>
                      m.sender === 'ADMIN' ? { ...m, is_read: true } : m
                    ),
                  }
                : i
            )
          );
        } else {
          setServiceRequests((prev) =>
            prev.map((s) =>
              s.id === item.id
                ? {
                    ...s,
                    unreadCount: 0,
                    messages: s.messages.map((m: any) =>
                      m.sender === 'ADMIN' ? { ...m, is_read: true } : m
                    ),
                  }
                : s
            )
          );
        }
      } catch (e) {
        console.error('Error marking messages as read:', e);
      }
    }
  };

  // Handle sending a reply in chat
  const handleSendMessage = async (text: string): Promise<boolean> => {
    if (!activeChat) return false;

    try {
      const url = `/api/${activeChat.type === 'inquiry' ? 'inquiries' : 'services'}/${activeChat.item.id}/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'CUSTOMER',
          message: text,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        // Append message to active chat item
        const updatedMessages = [...(activeChat.item.messages || []), data.message];
        const updatedItem = { ...activeChat.item, messages: updatedMessages, status: 'IN_PROGRESS' };
        setActiveChat({ type: activeChat.type, item: updatedItem });

        if (activeChat.type === 'inquiry') {
          setInquiries((prev) =>
            prev.map((i) => (i.id === activeChat.item.id ? updatedItem : i))
          );
        } else {
          setServiceRequests((prev) =>
            prev.map((s) => (s.id === activeChat.item.id ? updatedItem : s))
          );
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error sending message:', err);
      return false;
    }
  };

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
            <span>{t.chat.myInquiries} ({inquiries.length + serviceRequests.length})</span>
            {totalUnread > 0 && (
              <span className="bg-[#BA4E25] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                {totalUnread} {t.chat.unread}
              </span>
            )}
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

                    const messagesCount = inq.messages?.length || 0;
                    const lastMsg = inq.messages?.[messagesCount - 1];
                    const hasUnread = inq.unreadCount > 0;

                    return (
                      <div
                        key={inq.id}
                        className={`bg-[#FDFBF9] border rounded-[3px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs transition ${
                          hasUnread
                            ? 'border-[#BA4E25] ring-1 ring-[#BA4E25]/20 bg-[#FAF4EC]'
                            : 'border-[#E7E0D8]'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-4 flex-1">
                          <div className="w-16 h-16 rounded-[2px] overflow-hidden relative border border-[#E7E0D8] shrink-0 bg-[#F4ECE1]">
                            <Image
                              src={thumb}
                              alt="Painting thumbnail"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                href={`/gallery/${inq.painting?.id}`}
                                className="font-serif font-semibold text-lg text-[#281C18] hover:text-[#BA4E25] flex items-center gap-1.5 truncate"
                              >
                                <span>{inq.painting?.title_en || 'Painting'}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-[#8F8178]" />
                              </Link>
                              {hasUnread && (
                                <span className="bg-[#BA4E25] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {inq.unreadCount} {t.chat.newInquiryBadge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#726861]">
                              by {inq.painting?.artist?.name} · {formatPrice(inq.painting?.price || 0)}
                            </p>
                            {lastMsg && (
                              <p className="text-xs text-[#554740] bg-[#F7F3EE] p-2 rounded-[2px] line-clamp-2 max-w-xl border border-[#EFE8DE]">
                                <strong className="text-[#281C18]">
                                  {lastMsg.sender === 'ADMIN' ? `${t.chat.curator}: ` : `${t.chat.you}: `}
                                </strong>
                                {lastMsg.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#EFE8DE]">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(inq.status)}
                            <span className="text-[11px] text-[#9E9086]">
                              {new Date(inq.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <button
                            onClick={() => handleOpenChat('inquiry', inq)}
                            className="bg-[#281C18] hover:bg-[#BA4E25] text-white text-xs font-semibold px-4 py-2 rounded-[3px] transition flex items-center gap-1.5 shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>
                              {t.chat.openChat} ({messagesCount})
                            </span>
                          </button>
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
                  {serviceRequests.map((sr) => {
                    const messagesCount = sr.messages?.length || 0;
                    const lastMsg = sr.messages?.[messagesCount - 1];
                    const hasUnread = sr.unreadCount > 0;

                    return (
                      <div
                        key={sr.id}
                        className={`bg-[#FDFBF9] border rounded-[3px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs transition ${
                          hasUnread
                            ? 'border-[#BA4E25] ring-1 ring-[#BA4E25]/20 bg-[#FAF4EC]'
                            : 'border-[#E7E0D8]'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-bold tracking-wider uppercase text-[#BA4E25]">
                              {sr.service_type}
                            </span>
                            <span className="text-[#A8988E]">·</span>
                            <span className="text-xs text-[#726861]">
                              Contact: {sr.guest_contact}
                            </span>
                            {hasUnread && (
                              <span className="bg-[#BA4E25] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {sr.unreadCount} {t.chat.newInquiryBadge}
                              </span>
                            )}
                          </div>
                          {lastMsg && (
                            <p className="text-xs text-[#554740] bg-[#F7F3EE] p-2 rounded-[2px] line-clamp-2 max-w-xl border border-[#EFE8DE]">
                              <strong className="text-[#281C18]">
                                {lastMsg.sender === 'ADMIN' ? `${t.chat.curator}: ` : `${t.chat.you}: `}
                              </strong>
                              {lastMsg.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#EFE8DE]">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(sr.status)}
                            <span className="text-[11px] text-[#9E9086]">
                              {new Date(sr.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <button
                            onClick={() => handleOpenChat('service', sr)}
                            className="bg-[#281C18] hover:bg-[#BA4E25] text-white text-xs font-semibold px-4 py-2 rounded-[3px] transition flex items-center gap-1.5 shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>
                              {t.chat.openChat} ({messagesCount})
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
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

      {/* Interactive Chat Thread Modal */}
      {activeChat && (
        <ChatModal
          isOpen={Boolean(activeChat)}
          onClose={() => setActiveChat(null)}
          title={
            activeChat.type === 'inquiry'
              ? activeChat.item.painting?.title_en || 'Painting Inquiry'
              : `${activeChat.item.service_type} Service Request`
          }
          subtitle={
            activeChat.type === 'inquiry'
              ? `by ${activeChat.item.painting?.artist?.name || 'Art Qala Artist'}`
              : `Contact: ${activeChat.item.guest_contact}`
          }
          status={activeChat.item.status}
          statusBadge={getStatusBadge(activeChat.item.status)}
          messages={activeChat.item.messages || []}
          onSendMessage={handleSendMessage}
          imageSrc={
            activeChat.type === 'inquiry'
              ? (() => {
                  try {
                    const parsed = JSON.parse(activeChat.item.painting?.images || '[]');
                    return parsed[0] || '/assets/p-arch.svg';
                  } catch {
                    return '/assets/p-arch.svg';
                  }
                })()
              : undefined
          }
          priceText={
            activeChat.type === 'inquiry'
              ? formatPrice(activeChat.item.painting?.price || 0)
              : undefined
          }
        />
      )}
    </div>
  );
}
