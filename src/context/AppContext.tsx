'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language } from '@/lib/i18n/translations';

export type Currency = 'USD' | 'UZS' | 'RUB' | 'EUR';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  country?: string | null;
  role: string;
  email_verified: boolean;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceUSD: number) => string;
  wishlist: string[];
  toggleWishlist: (paintingId: string) => void;
  isInWishlist: (paintingId: string) => boolean;
  t: (typeof translations)['en'];
  user: UserSession | null;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  UZS: 12750,
  RUB: 92.5,
  EUR: 0.92,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [user, setUser] = useState<UserSession | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMounted(true);
    refreshUser();
    const savedLang = localStorage.getItem('artqala_lang') as Language;
    if (savedLang && ['en', 'ru', 'uz'].includes(savedLang)) {
      setLangState(savedLang);
    }

    const savedCurrency = localStorage.getItem('artqala_currency') as Currency;
    if (savedCurrency && ['USD', 'UZS', 'RUB', 'EUR'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }

    try {
      const savedWishlist = JSON.parse(localStorage.getItem('artqala_wishlist') || '[]');
      if (Array.isArray(savedWishlist)) {
        setWishlist(savedWishlist);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('artqala_lang', l);
    }
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    if (typeof window !== 'undefined') {
      localStorage.setItem('artqala_currency', c);
    }
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (typeof window !== 'undefined') {
        localStorage.setItem('artqala_wishlist', JSON.stringify(next));
      }
      return next;
    });
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  const formatPrice = (priceUSD: number): string => {
    const rate = EXCHANGE_RATES[currency] || 1;
    const converted = priceUSD * rate;

    switch (currency) {
      case 'USD':
        return `$${Math.round(converted).toLocaleString()}`;
      case 'UZS':
        return `${Math.round(converted).toLocaleString('uz-UZ')} so'm`;
      case 'RUB':
        return `${Math.round(converted).toLocaleString('ru-RU')} ₽`;
      case 'EUR':
        return `${Math.round(converted).toLocaleString()} €`;
      default:
        return `$${priceUSD}`;
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        currency,
        setCurrency,
        formatPrice,
        wishlist,
        toggleWishlist,
        isInWishlist,
        t,
        user,
        refreshUser,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
