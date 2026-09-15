import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSessionToken } from '@/lib/auth';
import { checkRateLimit, recordFailedAttempt, getClientIp } from '@/lib/rateLimit';
import { validateEmail } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const signupKey = `signup:${ip}`;

    const rateCheck = await checkRateLimit(signupKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      const minutesLeft = Math.ceil(rateCheck.retryAfterSeconds / 60);
      return NextResponse.json(
        {
          success: false,
          error: `Juda ko'p ro'yxatdan o'tish urinishlari. Iltimos, ${minutesLeft} daqiqadan so'ng qayta urinib ko'ring.`,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }
    await recordFailedAttempt(signupKey);

    const { name, email, password, country, agreedToTerms } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Barcha maydonlar to'ldirilishi shart" },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json(
        { success: false, error: 'Foydalanish shartlari va Maxfiylik siyosatiga rozilik bildirishingiz kerak' },
        { status: 400 }
      );
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { success: false, error: emailValidation.error },
        { status: 400 }
      );
    }

    // Password requirements: min 8 chars, 1 uppercase, 1 number
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

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Email OTP verification is temporarily bypassed: Resend is still in
    // sandbox mode (can only deliver to the account owner's own inbox), so
    // requiring a code would lock every real signup out with no way in.
    // Account is activated immediately, same as Google/Apple sign-in.
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password_hash: passwordHash,
        country: country || null,
        role: 'USER',
        email_verified: true,
        auth_provider: 'EMAIL',
      },
    });

    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      country: user.country,
      role: user.role,
      email_verified: user.email_verified,
      must_change_password: false,
    };

    const sessionToken = createSessionToken(userSession);
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully.',
      user: userSession,
    });

    response.cookies.set('artqala_user', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during signup' },
      { status: 500 }
    );
  }
}
