'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string; // 'HH:MM', same format the native <input type="time"> used
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export default function TimePicker({ value, onChange, className = '', buttonClassName = '' }: TimePickerProps) {
  const [hh, mm] = value ? value.split(':') : ['09', '00'];
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLButtonElement>(null);
  const minuteRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        hourRef.current?.scrollIntoView({ block: 'center' });
        minuteRef.current?.scrollIntoView({ block: 'center' });
      });
    }
  }, [open]);

  const setHour = (h: string) => onChange(`${h}:${mm}`);
  const setMinute = (m: string) => onChange(`${hh}:${m}`);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-1.5 text-xs px-3 py-2.5 bg-white border border-[#E7E0D8] rounded-md hover:border-[#BA4E25]/50 focus:outline-none focus:ring-2 focus:ring-[#BA4E25]/20 focus:border-[#BA4E25] transition-colors text-left text-[#281C18] ${buttonClassName}`}
      >
        <Clock className="w-3.5 h-3.5 text-[#8A7C73] shrink-0" />
        <span className="truncate">{hh}:{mm}</span>
      </button>

      {open && (
        <div className="absolute z-30 left-0 mt-1.5 w-36 bg-white border border-[#E7E0D8] rounded-md shadow-lg animate-[fadeSlideIn_0.15s_ease-out] flex">
          <div className="flex-1 max-h-48 overflow-y-auto p-1 border-r border-[#F0EAE1]">
            {HOURS.map((h) => (
              <button
                key={h}
                ref={h === hh ? hourRef : undefined}
                type="button"
                onClick={() => setHour(h)}
                className={`w-full text-center text-xs px-2 py-1.5 rounded transition-colors ${
                  h === hh ? 'bg-[#BA4E25]/10 text-[#BA4E25] font-semibold' : 'text-[#554740] hover:bg-[#FAF4EC]'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <div className="flex-1 max-h-48 overflow-y-auto p-1">
            {MINUTES.map((m) => (
              <button
                key={m}
                ref={m === mm ? minuteRef : undefined}
                type="button"
                onClick={() => setMinute(m)}
                className={`w-full text-center text-xs px-2 py-1.5 rounded transition-colors ${
                  m === mm ? 'bg-[#BA4E25]/10 text-[#BA4E25] font-semibold' : 'text-[#554740] hover:bg-[#FAF4EC]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
