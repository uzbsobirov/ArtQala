import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSessionToken } from '@/lib/auth';
import { checkRateLimit, recordFailedAttempt, resetRateLimit, getClientIp } from '@/lib/rateLimit';
import { validateEmail } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
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

    const normalizedEmail = email.toLowerCase().trim();
    const rateLimitKey = `signin:${ip}:${normalizedEmail}`;

    // 1. Check rate limit (Max 5 attempts in 15 minutes)
    const rateCheck = await checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      const minutesLeft = Math.ceil(rateCheck.retryAfterSeconds / 60);
      return NextResponse.json(
        {
          success: false,
          error: `Juda ko'p noto'g'ri urinishlar. Xavfsizlik yuzasidan hisob ${minutesLeft} daqiqaga vaqtincha bloklandi.`,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds),
          },
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.password_hash) {
      await recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      await recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Successful login: reset failed attempts
    await resetRateLimit(rateLimitKey);

    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      country: user.country,
      role: user.role,
      email_verified: user.email_verified,
      must_change_password: user.must_change_password,
    };

    const sessionToken = createSessionToken(userSession);

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
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
    console.error('Signin error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during sign in' },
      { status: 500 }
    );
  }
}
