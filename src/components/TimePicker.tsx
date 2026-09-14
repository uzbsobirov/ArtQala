'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string; // 'HH:MM' in 24h, same format the native <input type="time"> used
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1)); // '1'..'12'
const MINUTES = ['00', '15', '30', '45'];

function to12Hour(h24: number): { hour12: string; period: 'AM' | 'PM' } {
  const period: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM';
  let hour = h24 % 12;
  if (hour === 0) hour = 12;
  return { hour12: String(hour), period };
}

function to24Hour(hour12: string, period: 'AM' | 'PM'): string {
  let h = parseInt(hour12, 10) % 12;
  if (period === 'PM') h += 12;
  return String(h).padStart(2, '0');
}

export default function TimePicker({ value, onChange, className = '', buttonClassName = '' }: TimePickerProps) {
  const [hh24, mm] = value ? value.split(':') : ['09', '00'];
  const { hour12, period } = to12Hour(parseInt(hh24, 10) || 0);
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

  const setHour = (h: string) => onChange(`${to24Hour(h, period)}:${mm}`);
  const setMinute = (m: string) => onChange(`${hh24}:${m}`);
  const setPeriod = (p: 'AM' | 'PM') => onChange(`${to24Hour(hour12, p)}:${mm}`);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-1.5 text-xs px-3 py-2.5 bg-white border border-[#E7E0D8] rounded-md hover:border-[#BA4E25]/50 focus:outline-none focus:ring-2 focus:ring-[#BA4E25]/20 focus:border-[#BA4E25] transition-colors text-left text-[#281C18] ${buttonClassName}`}
      >
        <Clock className="w-3.5 h-3.5 text-[#8A7C73] shrink-0" />
        <span className="truncate">{hour12}:{mm} {period}</span>
      </button>

      {open && (
        <div className="absolute z-30 left-0 mt-1.5 w-44 bg-white border border-[#E7E0D8] rounded-md shadow-lg animate-[fadeSlideIn_0.15s_ease-out]">
          <div className="flex gap-1 p-1.5 border-b border-[#F0EAE1]">
            {(['AM', 'PM'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`flex-1 text-[11px] font-semibold py-1 rounded transition-colors ${
                  p === period ? 'bg-[#BA4E25] text-white' : 'text-[#554740] hover:bg-[#FAF4EC]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex">
            <div className="flex-1 max-h-48 overflow-y-auto p-1 border-r border-[#F0EAE1]">
              {HOURS_12.map((h) => (
                <button
                  key={h}
                  ref={h === hour12 ? hourRef : undefined}
                  type="button"
                  onClick={() => setHour(h)}
                  className={`w-full text-center text-xs px-2 py-1.5 rounded transition-colors ${
                    h === hour12 ? 'bg-[#BA4E25]/10 text-[#BA4E25] font-semibold' : 'text-[#554740] hover:bg-[#FAF4EC]'
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
        </div>
      )}
    </div>
  );
}
