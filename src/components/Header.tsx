'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp, Currency } from '@/context/AppContext';
import { Language } from '@/lib/i18n/translations';
import { Heart, Menu, X, Shield } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, currency, setCurrency, wishlist, t, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/artists', label: t.nav.artists },
    { href: '/services', label: t.nav.services },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF4EC]/95 backdrop-blur-md border-b border-[#E7E0D8] transition-all">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14 h-[76px] flex items-center justify-between">
        {/* Brand with Original Logo */}
        <Link href="/" className="flex items-center gap-3 group text-decoration-none">
          {/* CRITICAL: original logo from /assets/logo.png preserved */}
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Art Qala Gallery"
              width={140}
              height={46}
              priority
              className="brand-mark h-[46px] w-auto object-contain transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1"
            />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-[9.5px] tracking-[3px] text-[#BA4E25] font-semibold mt-1">
              {t.nav.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${active ? 'active text-[#BA4E25]' : 'text-[#3E332E]'}`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Admin link shortcut (only for authenticated admins) */}
          {user && user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-[#1D100B]/5 hover:bg-[#1D100B]/10 text-[#4D3F38] transition-colors"
              title="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-[#BA4E25]" />
              <span className="hidden xl:inline">Admin</span>
            </Link>
          )}

          {/* Wishlist Link */}
          <Link
            href="/gallery?wishlist=true"
            className="relative p-1.5 text-[#3E332E] hover:text-[#BA4E25] transition-colors"
            title={t.nav.wishlist}
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#BA4E25] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* User Account / Sign In */}
          {user ? (
            <Link
              href="/account"
              className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[#BA4E25] text-[#BA4E25] hover:bg-[#BA4E25] hover:text-white transition-all flex items-center gap-1.5"
            >
              <span className="w-4 h-4 rounded-full bg-[#BA4E25] text-white text-[9px] flex items-center justify-center font-bold">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              href="/signin"
              className="text-xs font-semibold text-[#554740] hover:text-[#BA4E25] transition-colors"
            >
              {t.nav.signIn}
            </Link>
          )}

          {/* Language and Currency Switchers */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#E7E0D8]">
            {(['en', 'ru', 'uz'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[11px] font-semibold tracking-wider px-2 py-1 rounded-full uppercase transition-all duration-200 ${
                  lang === l
                    ? 'bg-[#BA4E25] text-white shadow-sm'
                    : 'text-[#4D3F38] hover:text-[#BA4E25] border border-transparent hover:border-[#E7E0D8]'
                }`}
              >
                {l}
              </button>
            ))}

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="Select Currency"
              className="font-sans text-[11px] font-semibold px-2 py-1 rounded-full border border-[#E7E0D8] bg-transparent text-[#4D3F38] hover:border-[#429599] hover:text-[#429599] transition-colors cursor-pointer outline-none ml-1"
            >
              <option value="USD">$ USD</option>
              <option value="UZS">so'm UZS</option>
              <option value="RUB">₽ RUB</option>
              <option value="EUR">€ EUR</option>
            </select>
          </div>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/gallery?wishlist=true"
            className="relative p-1.5 text-[#3E332E]"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 text-[#BA4E25]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#BA4E25] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#281C18] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF4EC] border-b border-[#E7E0D8] px-6 py-6 space-y-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-1 transition-colors ${
                  isActive(item.href) ? 'text-[#BA4E25] font-semibold' : 'text-[#3E332E]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user && user.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-[#429599] flex items-center gap-2 pt-2 border-t border-[#E7E0D8]"
              >
                <Shield className="w-4 h-4" />
                {t.nav.admin}
              </Link>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E7E0D8]">
            <div className="flex gap-1.5">
              {(['en', 'ru', 'uz'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${
                    lang === l
                      ? 'bg-[#BA4E25] text-white'
                      : 'text-[#4D3F38] border border-[#E7E0D8]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="Select Currency Mobile"
              className="text-xs font-semibold px-2 py-1 rounded-full border border-[#E7E0D8] bg-transparent text-[#4D3F38]"
            >
              <option value="USD">$ USD</option>
              <option value="UZS">so'm UZS</option>
              <option value="RUB">₽ RUB</option>
              <option value="EUR">€ EUR</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
