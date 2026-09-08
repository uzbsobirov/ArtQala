'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { parsePhones, formatWorkingHours, getAboutText } from '@/lib/settingsUtils';

export default function Footer() {
  const { t, lang, settings } = useApp();

  const phones = parsePhones(settings?.phone);
  const workingHoursText = formatWorkingHours(settings?.working_hours, lang);
  const aboutText = getAboutText(settings, lang, t.footer.about);
  const addressText = settings?.address || 'Barakhon Madrasah, Tashkent, Uzbekistan';
  const locationMap = settings?.location_map || 'https://maps.app.goo.gl/FvSvu2kJ3Mqdwhzg8';
  const cityCountryText = settings?.address
    ? settings.address.split(',').slice(-2).map((s) => s.trim()).join(', ')
    : 'Tashkent, Uzbekistan';

  return (
    <footer className="bg-[#281C18] text-[#E8DFD8] pt-14 pb-8 border-t border-[#3D2C26]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-[#3D2C26]">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              {/* Original logo from /assets/logo.png preserved without modification */}
              <div className="p-1 rounded inline-block bg-[#FAF4EC]/5">
                <Image
                  src="/logo.png"
                  alt="Art Qala Gallery"
                  width={150}
                  height={52}
                  className="h-[52px] w-auto object-contain brightness-105"
                />
              </div>
            </Link>
            <p className="text-[13.5px] leading-relaxed text-[#B3A49B] max-w-sm">
              {aboutText}
            </p>
          </div>

          {/* Visit */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-[2px] text-[#429599] uppercase">
              {t.footer.visit}
            </h4>
            <div className="flex flex-col space-y-2 text-[13.5px] text-[#D8CDC5]">
              <span>{addressText}</span>
              <span className="text-[#A89990]">{workingHoursText}</span>
              <a
                href={locationMap}
                target="_blank"
                rel="noreferrer"
                className="text-[#429599] hover:underline text-xs pt-1 inline-flex items-center gap-1"
              >
                <span>{lang === 'uz' ? "Xaritada ko'rish" : lang === 'ru' ? 'На карте' : 'View on map'} →</span>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-[2px] text-[#429599] uppercase">
              {t.footer.contact}
            </h4>
            <div className="flex flex-col space-y-2 text-[13.5px] text-[#D8CDC5]">
              {phones.map((p, idx) => (
                <a
                  key={idx}
                  href={`tel:${p.replace(/[^\d+]/g, '')}`}
                  className="hover:text-[#429599] transition-colors"
                >
                  {p}
                </a>
              ))}
              {settings?.telegram && (
                <a
                  href={settings.telegram.startsWith('http') ? settings.telegram : `https://t.me/${settings.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#429599] transition-colors"
                >
                  Telegram · @{settings.telegram.split('/').pop()?.replace('@', '') || 'artqala'}
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#429599] transition-colors"
                >
                  Instagram · @{settings.instagram.split('/').pop()?.replace('@', '') || 'artqala'}
                </a>
              )}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-[2px] text-[#429599] uppercase">
              {t.footer.explore}
            </h4>
            <div className="flex flex-col space-y-2 text-[13.5px] text-[#D8CDC5]">
              <Link href="/gallery" className="hover:text-[#429599] transition-colors">
                {t.nav.gallery}
              </Link>
              <Link href="/artists" className="hover:text-[#429599] transition-colors">
                {t.nav.artists}
              </Link>
              <Link href="/services" className="hover:text-[#429599] transition-colors">
                {t.nav.services}
              </Link>
              <Link href="/contact" className="hover:text-[#429599] transition-colors">
                {t.nav.contact}
              </Link>
              <Link href="/reviews" className="hover:text-[#429599] transition-colors">
                Reviews
              </Link>
              <Link href="/admin" className="text-xs text-[#BA4E25] hover:underline pt-1">
                Admin Panel →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A7C73]">
          <div className="flex items-center gap-3">
            <span>{t.footer.rights}</span>
            <span>·</span>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
          <div className="flex items-center gap-4">
            <span>EN · RU · UZ (Lotin)</span>
            <span>•</span>
            <span>{cityCountryText}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
