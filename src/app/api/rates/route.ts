import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Check SiteSettings from DB
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    // If manual rates are enabled, return them directly
    if (settings?.manual_rates) {
      const usdUzs = settings.rate_usd || 12850;
      const eurUzs = settings.rate_eur || 13900;
      const rubUzs = settings.rate_rub || 140;

      return NextResponse.json({
        source: 'manual',
        rates: {
          USD: 1,
          UZS: usdUzs,
          EUR: +(usdUzs / eurUzs).toFixed(4),
          RUB: +(usdUzs / rubUzs).toFixed(2),
        },
        raw_uzs: {
          USD: usdUzs,
          EUR: eurUzs,
          RUB: rubUzs,
        },
      });
    }

    // 2. Fetch official Central Bank of Uzbekistan (cbu.uz) rates
    try {
      const cbuRes = await fetch('https://cbu.uz/oz/arkhiv-kursov-valyut/json/', {
        next: { revalidate: 3600 }, // Cache 1 hour
      });

      if (cbuRes.ok) {
        const cbuData = await cbuRes.json();
        
        let usdRate = 12850;
        let eurRate = 13900;
        let rubRate = 140;

        for (const item of cbuData) {
          if (item.Ccy === 'USD') usdRate = parseFloat(item.Rate);
          if (item.Ccy === 'EUR') eurRate = parseFloat(item.Rate);
          if (item.Ccy === 'RUB') rubRate = parseFloat(item.Rate);
        }

        // Optionally update cached rates in settings for fallback
        await prisma.siteSettings.upsert({
          where: { id: 'default' },
          update: {
            rate_usd: usdRate,
            rate_eur: eurRate,
            rate_rub: rubRate,
          },
          create: {
            id: 'default',
            rate_usd: usdRate,
            rate_eur: eurRate,
            rate_rub: rubRate,
          },
        }).catch(() => null);

        return NextResponse.json({
          source: 'cbu.uz',
          rates: {
            USD: 1,
            UZS: usdRate,
            EUR: +(usdRate / eurRate).toFixed(4),
            RUB: +(usdRate / rubRate).toFixed(2),
          },
          raw_uzs: {
            USD: usdRate,
            EUR: eurRate,
            RUB: rubRate,
          },
        });
      }
    } catch (e) {
      console.warn('CBU API unreachable, using database settings fallback:', e);
    }

    // Fallback to settings in DB or defaults
    const usdUzs = settings?.rate_usd || 12850;
    const eurUzs = settings?.rate_eur || 13900;
    const rubUzs = settings?.rate_rub || 140;

    return NextResponse.json({
      source: 'fallback',
      rates: {
        USD: 1,
        UZS: usdUzs,
        EUR: +(usdUzs / eurUzs).toFixed(4),
        RUB: +(usdUzs / rubUzs).toFixed(2),
      },
      raw_uzs: {
        USD: usdUzs,
        EUR: eurUzs,
        RUB: rubUzs,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        source: 'default',
        rates: { USD: 1, UZS: 12850, EUR: 0.92, RUB: 92 },
        raw_uzs: { USD: 12850, EUR: 13900, RUB: 140 },
      },
      { status: 200 }
    );
  }
}
