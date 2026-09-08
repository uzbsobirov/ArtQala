'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Heart, ShieldCheck, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

interface PaintingDetailClientProps {
  painting: any;
}

export default function PaintingDetailClient({ painting }: PaintingDetailClientProps) {
  const { lang, formatPrice, wishlist, toggleWishlist, t } = useApp();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Track painting view once when client mounts
  useEffect(() => {
    if (painting?.id) {
      fetch(`/api/paintings/${painting.id}/view`, { method: 'POST' }).catch(() => {});
    }
  }, [painting?.id]);

  const title =
    lang === 'ru'
      ? painting.title_ru
      : lang === 'uz'
      ? painting.title_uz
      : painting.title_en;

  const description =
    lang === 'ru'
      ? painting.description_ru || painting.description_en
      : lang === 'uz'
      ? painting.description_uz || painting.description_en
      : painting.description_en;

  const technique =
    lang === 'ru'
      ? painting.technique_ru || painting.technique_en
      : lang === 'uz'
      ? painting.technique_uz || painting.technique_en
      : painting.technique_en;

  const categoryName =
    lang === 'ru'
      ? painting.category.name_ru
      : lang === 'uz'
      ? painting.category.name_uz
      : painting.category.name_en;

  let imageSrc = '/assets/p-arch.svg';
  try {
    const parsed = JSON.parse(painting.images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      imageSrc = parsed[0];
    }
  } catch {
    if (painting.images && !painting.images.startsWith('[')) {
      imageSrc = painting.images;
    }
  }

  const isFavorited = wishlist.includes(painting.id);
  const hasDiscount = !!painting.discount_price && painting.discount_price < painting.price;
  const discountPercent = hasDiscount
    ? Math.round(((painting.price - (painting.discount_price as number)) / painting.price) * 100)
    : 0;

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          painting_id: painting.id,
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setMessage('');
      }
    } catch (err) {
      console.error('Failed to submit inquiry', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 sm:py-14">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Breadcrumb */}
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#BA4E25] hover:underline mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.painting.backToGallery}</span>
        </Link>

        {/* 2-Column Split Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Art View */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square w-full rounded-[4px] overflow-hidden border border-[#E7E0D8] bg-[#F4ECE1] shadow-md">
              <Image
                src={imageSrc}
                alt={title}
                fill
                priority
                className="object-cover"
              />

              {/* Wishlist toggle button */}
              <button
                onClick={() => toggleWishlist(painting.id)}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-md ${
                  isFavorited
                    ? 'bg-[#BA4E25] text-white'
                    : 'bg-white/90 text-[#4D3F38] hover:text-[#BA4E25]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>

              {/* Sold Badge */}
              {painting.is_sold && (
                <div className="absolute bottom-4 left-4 bg-[#281C18]/90 text-white text-xs tracking-widest uppercase font-semibold px-3 py-1 rounded-[2px]">
                  {t.gallery.soldBadge}
                </div>
              )}
            </div>

            {/* Certificate of Authenticity Info Box */}
            <div className="bg-[#FAF4EC] border border-[#E7E0D8] rounded-[3px] p-5 flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-[#429599] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-semibold text-base text-[#281C18]">
                  {t.painting.authenticity}
                </h4>
                <p className="text-xs text-[#6B5E55] mt-1 leading-relaxed">
                  {t.painting.authenticityDesc}
                </p>
                <Link
                  href={`/certificate/${painting.id}`}
                  target="_blank"
                  className="inline-block mt-2 text-xs font-bold text-[#BA4E25] hover:underline"
                >
                  View official Certificate of Authenticity →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Details & Inquiry Form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Meta tags */}
            <div className="flex items-center gap-2">
              <span className="bg-[#FDFBF9] border border-[#E7E0D8] text-[#554740] text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                {categoryName}
              </span>
              {hasDiscount && (
                <span className="bg-[#BA4E25] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
                  -{discountPercent}% PROMOTION
                </span>
              )}
            </div>

            {/* Title & Artist */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#281C18] leading-tight">
                {title}
              </h1>
              <p className="text-sm text-[#726861] mt-1">
                {t.painting.artist}:{' '}
                <Link
                  href="/artists"
                  className="font-semibold text-[#BA4E25] hover:underline"
                >
                  {painting.artist.name}
                </Link>
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-[#FDFBF9] border border-[#E7E0D8] p-4 rounded-[3px] flex items-baseline justify-between">
              <span className="text-xs font-semibold text-[#726861] tracking-wider uppercase">
                {hasDiscount ? 'Special Offer' : 'Gallery Price'}
              </span>
              <div className="flex items-baseline gap-2.5">
                {hasDiscount && (
                  <span className="text-sm text-[#96877E] line-through">
                    {formatPrice(painting.price)}
                  </span>
                )}
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#BA4E25]">
                  {formatPrice(
                    hasDiscount ? (painting.discount_price as number) : painting.price
                  )}
                </span>
              </div>
            </div>

            {/* Artwork Specifications Table */}
            <div className="grid grid-cols-2 gap-3 text-xs border-y border-[#E7E0D8] py-4">
              <div>
                <span className="text-[#8F8178] uppercase tracking-wider block font-medium text-[10px]">
                  {t.painting.technique}
                </span>
                <span className="font-semibold text-[#281C18]">{technique}</span>
              </div>
              <div>
                <span className="text-[#8F8178] uppercase tracking-wider block font-medium text-[10px]">
                  {t.painting.size}
                </span>
                <span className="font-semibold text-[#281C18]">{painting.size}</span>
              </div>
              <div>
                <span className="text-[#8F8178] uppercase tracking-wider block font-medium text-[10px]">
                  {t.painting.year}
                </span>
                <span className="font-semibold text-[#281C18]">{painting.year}</span>
              </div>
              <div>
                <span className="text-[#8F8178] uppercase tracking-wider block font-medium text-[10px]">
                  Availability
                </span>
                <span
                  className={`font-semibold ${
                    painting.is_sold ? 'text-[#8F8178]' : 'text-[#2E7D32]'
                  }`}
                >
                  {painting.is_sold ? t.gallery.soldBadge : t.gallery.availableBadge}
                </span>
              </div>
            </div>

            {/* Artwork Description */}
            <p className="text-sm text-[#5F534C] leading-relaxed">{description}</p>

            {/* Direct Inquiry Form */}
            <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[3px] p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-xl font-semibold text-[#281C18]">
                {t.painting.inquireTitle}
              </h3>
              <p className="text-xs text-[#726861] leading-relaxed">
                {t.painting.inquireDesc}
              </p>

              {submitted ? (
                <div className="p-4 bg-[#E8F5E9] border border-[#A5D6A7] rounded-[3px] text-xs text-[#1B5E20] flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#2E7D32]" />
                  <span>{t.painting.inquirySuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                      {t.painting.yourName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                      {t.painting.yourEmail} *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                      {t.painting.yourPhone}
                    </label>
                    <input
                      type="text"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+998 ... or @telegram_handle"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                      {t.painting.yourMessage} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="I would like to inquire about reservation, delivery to my hotel in Tashkent, or international shipping..."
                      className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#BA4E25] hover:bg-[#9C3E1B] text-white font-semibold text-xs py-2.5 rounded-[3px] transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Sending...' : t.painting.sendInquiry}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
