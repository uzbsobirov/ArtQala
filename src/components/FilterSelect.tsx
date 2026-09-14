'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  allValue: string;
  allLabel: string;
  // Shown instead of the dropdown when `options` is empty (e.g. no artist
  // has a piece in the currently selected category) — a short, friendly
  // message rather than a select box with nothing but "All" in it.
  emptyMessage: string;
}

export default function FilterSelect({ value, onChange, options, allValue, allLabel, emptyMessage }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (options.length === 0) {
    return (
      <div className="w-full text-xs px-3 py-2.5 bg-[#F5EFE7] border border-dashed border-[#D9CDBF] rounded-md text-[#A89990] italic">
        {emptyMessage}
      </div>
    );
  }

  const selectedLabel =
    value === allValue ? allLabel : options.find((o) => o.value === value)?.label || allLabel;

  const Row = ({ optValue, label }: { optValue: string; label: string }) => (
    <button
      type="button"
      onClick={() => {
        onChange(optValue);
        setOpen(false);
      }}
      className={`w-full flex items-center justify-between gap-2 text-xs px-3 py-2 text-left rounded transition-colors ${
        value === optValue ? 'text-[#BA4E25] font-semibold bg-[#BA4E25]/5' : 'text-[#554740] hover:bg-[#FAF4EC]'
      }`}
    >
      <span className="truncate">{label}</span>
      {value === optValue && <Check className="w-3.5 h-3.5 shrink-0" />}
    </button>
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 text-xs px-3 py-2.5 bg-white border border-[#E7E0D8] rounded-md hover:border-[#BA4E25]/50 focus:outline-none focus:ring-2 focus:ring-[#BA4E25]/20 focus:border-[#BA4E25] transition-colors text-left text-[#281C18]"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#8A7C73] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-20 left-0 right-0 mt-1.5 max-h-56 overflow-y-auto bg-white border border-[#E7E0D8] rounded-md shadow-lg p-1 animate-[fadeSlideIn_0.15s_ease-out]">
          <Row optValue={allValue} label={allLabel} />
          {options.map((o) => (
            <Row key={o.value} optValue={o.value} label={o.label} />
          ))}
        </div>
      )}
    </div>
  );
}
