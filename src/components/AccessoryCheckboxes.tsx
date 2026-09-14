'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { priceForSize, type SizeBucket } from '@/lib/paintingSize';

export interface AccessoryOption {
  id: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  price_small: number;
  price_medium: number | null;
  price_large: number | null;
  product_types: string[];
}

export interface SelectedAccessory {
  id: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  price: number;
}

interface AccessoryCheckboxesProps {
  // Product type(s) relevant to what's being inquired about — a painting's
  // Category slug(s) (e.g. "handicrafts"), or one of the Services types
  // ("MURAL" | "CERAMICS" | "CUSTOM"). An accessory with no product_types of
  // its own applies to everything.
  productTypes: string[];
  // The painting's size bucket, so a size-tiered accessory (case, framing…)
  // charges the right amount instead of one flat price for every size.
  // Omit when there's no known size yet (e.g. a Services commission) — the
  // small/base price is used as a sensible default.
  sizeBucket?: SizeBucket | null;
  onChange: (selected: SelectedAccessory[]) => void;
  // Use dark-form styling (matches the Services page's dark quote-request card).
  dark?: boolean;
}

export default function AccessoryCheckboxes({ productTypes, sizeBucket, onChange, dark = false }: AccessoryCheckboxesProps) {
  const { lang, t } = useApp();
  const [accessories, setAccessories] = useState<AccessoryOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/accessories')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) setAccessories(data.accessories);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const relevant = accessories.filter(
    (a) => !a.product_types || a.product_types.length === 0 || a.product_types.some((t) => productTypes.includes(t))
  );

  const title = (a: AccessoryOption) =>
    lang === 'ru' ? a.name_ru : lang === 'uz' ? a.name_uz : a.name_en;

  const toggle = (a: AccessoryOption) => {
    const next = selectedIds.includes(a.id)
      ? selectedIds.filter((id) => id !== a.id)
      : [...selectedIds, a.id];
    setSelectedIds(next);
    onChange(
      relevant
        .filter((acc) => next.includes(acc.id))
        .map((acc) => ({
          id: acc.id,
          name_en: acc.name_en,
          name_ru: acc.name_ru,
          name_uz: acc.name_uz,
          price: priceForSize(acc, sizeBucket),
        }))
    );
  };

  if (loading || relevant.length === 0) return null;

  return (
    <div>
      <label
        className={`block text-[10.5px] font-bold tracking-wider uppercase mb-1.5 ${
          dark ? 'text-[#A8988E]' : 'text-[#6B5E55]'
        }`}
      >
        {t.accessories.heading}
      </label>
      <div className="space-y-1.5">
        {relevant.map((a) => (
          <label
            key={a.id}
            className={`flex items-center justify-between gap-2 text-xs rounded-[2px] px-3 py-2 cursor-pointer border ${
              dark
                ? 'bg-[#362722] border-[#4D3932] hover:border-[#BA4E25]/50'
                : 'bg-white border-[#E7E0D8] hover:border-[#BA4E25]/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(a.id)}
                onChange={() => toggle(a)}
                className="w-3.5 h-3.5 accent-[#BA4E25]"
              />
              <span className={dark ? 'text-[#FAF4EC]' : 'text-[#281C18]'}>{title(a)}</span>
            </span>
            <span className="text-[#BA4E25] font-semibold shrink-0">+${priceForSize(a, sizeBucket)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
