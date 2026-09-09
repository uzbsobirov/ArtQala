import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { validateEmail } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const staff = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
        must_change_password: true,
        created_at: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error('Fetch staff error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Ism, email va parol to'ldirilishi shart" },
        { status: 400 }
      );
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json({ success: false, error: emailValidation.error }, { status: 400 });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        {
          success: false,
          error: "Parol kamida 8 ta belgi, 1 ta katta harf va 1 ta raqamdan iborat bo'lishi shart",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Bu email manzili bilan hisob allaqachon mavjud' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'ADMIN',
        email_verified: true,
        auth_provider: 'EMAIL',
        must_change_password: true, // Force the new admin to set their own password on first login
      },
      select: {
        id: true,
        name: true,
        email: true,
        must_change_password: true,
        created_at: true,
      },
    });

    return NextResponse.json({ success: true, staff: newAdmin });
  } catch (error) {
    console.error('Create staff error:', error);
    return NextResponse.json({ success: false, error: 'Xodim qo\'shishda xatolik yuz berdi' }, { status: 500 });
  }
}
