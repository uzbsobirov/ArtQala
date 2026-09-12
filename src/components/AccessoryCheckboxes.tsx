'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';

export interface AccessoryOption {
  id: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  price: number;
  categories: { id: string }[];
}

export interface SelectedAccessory {
  id: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  price: number;
}

interface AccessoryCheckboxesProps {
  // Category ids relevant to the item(s) being inquired about. An accessory
  // with no categories of its own applies to everything.
  categoryIds: string[];
  onChange: (selected: SelectedAccessory[]) => void;
}

export default function AccessoryCheckboxes({ categoryIds, onChange }: AccessoryCheckboxesProps) {
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
    (a) => a.categories.length === 0 || a.categories.some((c) => categoryIds.includes(c.id))
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
        .map(({ id, name_en, name_ru, name_uz, price }) => ({ id, name_en, name_ru, name_uz, price }))
    );
  };

  if (loading || relevant.length === 0) return null;

  return (
    <div>
      <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1.5">
        {t.accessories.heading}
      </label>
      <div className="space-y-1.5">
        {relevant.map((a) => (
          <label
            key={a.id}
            className="flex items-center justify-between gap-2 text-xs bg-white border border-[#E7E0D8] rounded-[2px] px-3 py-2 cursor-pointer hover:border-[#BA4E25]/50"
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(a.id)}
                onChange={() => toggle(a)}
                className="w-3.5 h-3.5 accent-[#BA4E25]"
              />
              <span className="text-[#281C18]">{title(a)}</span>
            </span>
            <span className="text-[#BA4E25] font-semibold shrink-0">+${a.price}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
