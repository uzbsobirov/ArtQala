'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import PaintingCard, { PaintingItem } from '@/components/PaintingCard';
import WishlistInquiryModal from '@/components/WishlistInquiryModal';
import { Search, Heart, SlidersHorizontal, Send, ChevronDown, X } from 'lucide-react';
import AnimatedMadohil from '@/components/patterns/AnimatedMadohil';
import DandanaScrollTrack from '@/components/patterns/DandanaScrollTrack';
import Breadcrumbs from '@/components/Breadcrumbs';

interface GalleryClientProps {
  paintings: any[];
  categories: any[];
}

// Buckets a painting's largest dimension (normalized to cm) into small/medium/large.
function getSizeBucket(sizeStr?: string): 'small' | 'medium' | 'large' | null {
  if (!sizeStr) return null;
  const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*[×x*X]\s*(\d+(?:\.\d+)?)\s*(sm|cm|dyum|in)?/i);
  if (!match) return null;
  const w = parseFloat(match[1]);
  const h = parseFloat(match[2]);
  const unit = (match[3] || 'sm').toLowerCase();
  const toCm = unit === 'dyum' || unit === 'in' ? 2.54 : 1;
  const maxDim = Math.max(w, h) * toCm;
  if (maxDim < 50) return 'small';
  if (maxDim <= 90) return 'medium';
  return 'large';
}

export default function GalleryClient({ paintings, categories }: GalleryClientProps) {
  const { lang, t, wishlist } = useApp();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(false);
  const [showWishlistInquiry, setShowWishlistInquiry] = useState<boolean>(false);

  // Advanced filters: artist / year / size
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');

  const artistOptions = useMemo(() => {
    const map = new Map<string, string>();
    paintings.forEach((p) => {
      if (p.artist?.id && p.artist?.name) map.set(p.artist.id, p.artist.name);
    });
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [paintings]);

  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    paintings.forEach((p) => {
      if (p.year) years.add(p.year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [paintings]);

  const hasActiveAdvancedFilters =
    selectedArtistId !== 'all' || selectedYear !== 'all' || selectedSize !== 'all';

  const clearAdvancedFilters = () => {
    setSelectedArtistId('all');
    setSelectedYear('all');
    setSelectedSize('all');
  };

  useEffect(() => {
    if (searchParams.get('wishlist') === 'true') {
      setOnlyWishlist(true);
    }
  }, [searchParams]);

  const filteredPaintings = useMemo(() => {
    return paintings.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category?.slug !== selectedCategory) {
        return false;
      }

      // Wishlist filter
      if (onlyWishlist && !wishlist.includes(p.id)) {
        return false;
      }

      // Advanced filters
      if (selectedArtistId !== 'all' && p.artist?.id !== selectedArtistId) {
        return false;
      }
      if (selectedYear !== 'all' && String(p.year) !== selectedYear) {
        return false;
      }
      if (selectedSize !== 'all' && getSizeBucket(p.size) !== selectedSize) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle =
          p.title_en.toLowerCase().includes(q) ||
          p.title_ru.toLowerCase().includes(q) ||
          p.title_uz.toLowerCase().includes(q);
        const matchesArtist = p.artist?.name.toLowerCase().includes(q);
        const matchesTech = p.technique_en?.toLowerCase().includes(q);
        return matchesTitle || matchesArtist || matchesTech;
      }

      return true;
    });
  }, [
    paintings,
    selectedCategory,
    onlyWishlist,
    wishlist,
    searchQuery,
    selectedArtistId,
    selectedYear,
    selectedSize,
  ]);

  return (
    <div className="py-14 sm:py-16">
      <Breadcrumbs items={[{ label: t.nav.gallery }]} />
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Page Head */}
        <AnimatedMadohil />
        <div className="max-w-2xl mb-10 space-y-2">
          <span className="text-xs font-semibold tracking-[3px] text-[#429599] uppercase">
            {t.gallery.eyebrow}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#281C18]">
            {t.gallery.title}
          </h1>
          <p className="text-sm sm:text-base text-[#6E6057] leading-relaxed">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Filter Pills & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10 pb-6 border-b border-[#E7E0D8]">
          {/* Category Pills — horizontal scroll on mobile (touch), wraps to multiple lines on desktop (mouse has no easy way to scroll a hidden overflow) */}
          <div className="flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none min-w-0 md:flex-1">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setOnlyWishlist(false);
              }}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                selectedCategory === 'all' && !onlyWishlist
                  ? 'bg-[#281C18] text-[#FAF4EC] border-[#281C18]'
                  : 'bg-[#FDFBF9] text-[#554740] border-[#E7E0D8] hover:border-[#BA4E25] hover:text-[#BA4E25]'
              }`}
            >
              {t.gallery.filterAll}
            </button>

            {categories.map((cat) => {
              const catName =
                lang === 'ru'
                  ? cat.name_ru
                  : lang === 'uz'
                  ? cat.name_uz
                  : cat.name_en;

              const isSelected = selectedCategory === cat.slug && !onlyWishlist;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setOnlyWishlist(false);
                  }}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#281C18] text-[#FAF4EC] border-[#281C18]'
                      : 'bg-[#FDFBF9] text-[#554740] border-[#E7E0D8] hover:border-[#BA4E25] hover:text-[#BA4E25]'
                  }`}
                >
                  {catName}
                </button>
              );
            })}

            {/* Wishlist toggle pill */}
            <button
              onClick={() => setOnlyWishlist(!onlyWishlist)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border transition-all whitespace-nowrap ml-1 ${
                onlyWishlist
                  ? 'bg-[#BA4E25] text-white border-[#BA4E25]'
                  : 'bg-[#FDFBF9] text-[#BA4E25] border-[#E7E0D8] hover:border-[#BA4E25]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyWishlist ? 'fill-current' : ''}`} />
              <span>{t.nav.wishlist} ({wishlist.length})</span>
            </button>
          </div>

          {/* Search bar + Advanced Filters toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-[#8A7C73] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.gallery.searchPlaceholder}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FDFBF9] border border-[#E7E0D8] rounded-full focus:outline-none focus:border-[#BA4E25] text-[#281C18]"
              />
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap shrink-0 ${
                showAdvancedFilters || hasActiveAdvancedFilters
                  ? 'bg-[#281C18] text-[#FAF4EC] border-[#281C18]'
                  : 'bg-[#FDFBF9] text-[#554740] border-[#E7E0D8] hover:border-[#BA4E25] hover:text-[#BA4E25]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.gallery.advancedFilters}</span>
              {hasActiveAdvancedFilters && (
                <span className="bg-[#BA4E25] text-white text-[9.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {[selectedArtistId, selectedYear, selectedSize].filter((v) => v !== 'all').length}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="flex flex-wrap items-end gap-4 -mt-6 mb-10 p-4 bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px]">
            <div>
              <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                {t.gallery.filterByArtist}
              </label>
              <select
                value={selectedArtistId}
                onChange={(e) => setSelectedArtistId(e.target.value)}
                className="text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] min-w-[160px]"
              >
                <option value="all">{t.gallery.allArtists}</option>
                {artistOptions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                {t.gallery.filterByYear}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] min-w-[120px]"
              >
                <option value="all">{t.gallery.allYears}</option>
                {yearOptions.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                {t.gallery.filterBySize}
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] min-w-[130px]"
              >
                <option value="all">{t.gallery.allSizes}</option>
                <option value="small">{t.gallery.sizeSmall}</option>
                <option value="medium">{t.gallery.sizeMedium}</option>
                <option value="large">{t.gallery.sizeLarge}</option>
              </select>
            </div>

            {hasActiveAdvancedFilters && (
              <button
                onClick={clearAdvancedFilters}
                className="flex items-center gap-1 text-xs font-semibold text-[#BA4E25] hover:underline pb-2"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.gallery.clearFilters}</span>
              </button>
            )}
          </div>
        )}

        {/* Send inquiry about all wishlist pieces at once */}
        {onlyWishlist && filteredPaintings.length > 0 && (
          <div className="flex justify-end mb-5">
            <button
              onClick={() => setShowWishlistInquiry(true)}
              className="bg-[#281C18] hover:bg-[#BA4E25] text-white text-xs font-semibold px-4 py-2.5 rounded-[3px] transition flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.wishlistInquiry.sendAllBtn} ({filteredPaintings.length})</span>
            </button>
          </div>
        )}

        {/* Gallery Grid */}
        {filteredPaintings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {filteredPaintings.map((painting) => (
              <div key={painting.id}>
                <PaintingCard painting={painting as PaintingItem} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#FDFBF9] rounded-[4px] border border-[#E7E0D8] space-y-3">
            <SlidersHorizontal className="w-8 h-8 mx-auto text-[#A89990]" />
            <p className="text-base font-serif text-[#554740]">
              {onlyWishlist
                ? t.gallery.wishlistEmpty
                : t.gallery.noPaintingsFound}
            </p>
            {onlyWishlist && (
              <button
                onClick={() => setOnlyWishlist(false)}
                className="text-xs font-semibold text-[#BA4E25] hover:underline"
              >
                {t.gallery.viewAllPaintings}
              </button>
            )}
          </div>
        )}

        {/* Dandana — the gallery's bottom trim, echoing Ichan-Qala's wall crenellations */}
        <div className="mt-14">
          <DandanaScrollTrack />
        </div>
      </div>

      {showWishlistInquiry && (
        <WishlistInquiryModal
          paintings={paintings.filter((p) => wishlist.includes(p.id))}
          onClose={() => setShowWishlistInquiry(false)}
        />
      )}
    </div>
  );
}
