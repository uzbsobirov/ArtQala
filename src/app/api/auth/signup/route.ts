import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password, country } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Barcha maydonlar to\'ldirilishi shart' },
        { status: 400 }
      );
    }

    // Password requirements: min 8 chars, 1 uppercase, 1 number
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parol kamida 8 ta belgi, 1 ta katta harf va 1 ta raqamdan iborat bo\'lishi shart',
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create inactive user pending OTP
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        country: country || null,
        role: 'USER',
        email_verified: false,
        auth_provider: 'EMAIL',
      },
    });

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.otpVerification.create({
      data: {
        email: email.toLowerCase(),
        code: otpCode,
        expires_at: expiresAt,
      },
    });

    console.log(`[Art Qala OTP] Verification code for ${email}: ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: 'Account created. Please verify with the 6-digit code sent to your email.',
      otpPreview: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
      email: user.email,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during signup' },
      { status: 500 }
    );
  }
}
