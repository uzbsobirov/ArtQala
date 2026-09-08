import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'default',
          gallery_name: 'Art Qala',
          phone: '+998 66 233 44 55',
          email: 'info@artqala.uz',
          address: 'Registan Street, 4, Samarkand, Uzbekistan',
          location_map: 'https://maps.google.com/?q=Registan,Samarkand',
          working_hours: 'Mon - Sun: 09:00 - 19:00',
          telegram: 'https://t.me/artqala',
          instagram: 'https://instagram.com/artqala',
          about_en: 'Art Qala is a premier art gallery and studio located in the historic heart of Samarkand, Uzbekistan, celebrating Central Asian heritage.',
          about_ru: 'Art Qala — ведущая художественная галерея и студия в историческом центре Самарканда.',
          about_uz: "Art Qala — Samarqand shahrining tarixiy markazida joylashgan yetakchi san'at galereyasi va studiyasi.",
          rate_usd: 12850,
          rate_eur: 13900,
          rate_rub: 140,
          manual_rates: false,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('artqala_user')?.value;

    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const user = JSON.parse(userCookie);
      if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const updated = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        gallery_name: body.gallery_name,
        phone: typeof body.phone === 'string' ? body.phone : JSON.stringify(body.phone || []),
        email: body.email,
        address: body.address,
        location_map: body.location_map,
        working_hours: typeof body.working_hours === 'string' ? body.working_hours : JSON.stringify(body.working_hours || ''),
        telegram: body.telegram,
        instagram: body.instagram,
        about_en: body.about_en,
        about_ru: body.about_ru,
        about_uz: body.about_uz,
        rate_usd: parseFloat(body.rate_usd) || 12850,
        rate_eur: parseFloat(body.rate_eur) || 13900,
        rate_rub: parseFloat(body.rate_rub) || 140,
        manual_rates: Boolean(body.manual_rates),
      },
      create: {
        id: 'default',
        gallery_name: body.gallery_name || 'Art Qala',
        phone: body.phone || '+998 66 233 44 55',
        email: body.email || 'info@artqala.uz',
        address: body.address || 'Registan Street, 4, Samarkand, Uzbekistan',
        location_map: body.location_map || 'https://maps.google.com/?q=Registan,Samarkand',
        working_hours: body.working_hours || 'Mon - Sun: 09:00 - 19:00',
        telegram: body.telegram || 'https://t.me/artqala',
        instagram: body.instagram || 'https://instagram.com/artqala',
        about_en: body.about_en || '',
        about_ru: body.about_ru || '',
        about_uz: body.about_uz || '',
        rate_usd: parseFloat(body.rate_usd) || 12850,
        rate_eur: parseFloat(body.rate_eur) || 13900,
        rate_rub: parseFloat(body.rate_rub) || 140,
        manual_rates: Boolean(body.manual_rates),
      },
    });

    return NextResponse.json({ settings: updated });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
