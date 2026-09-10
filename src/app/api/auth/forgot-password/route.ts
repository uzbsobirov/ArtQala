import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit, recordFailedAttempt, getClientIp } from '@/lib/rateLimit';
import { validateEmail } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimitKey = `forgot-password:${ip}`;

    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      const minutesLeft = Math.ceil(rateCheck.retryAfterSeconds / 60);
      return NextResponse.json(
        {
          success: false,
          error: `Juda ko'p urinish. Iltimos, ${minutesLeft} daqiqadan so'ng qayta urinib ko'ring.`,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }
    recordFailedAttempt(rateLimitKey);

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email talab qilinadi' },
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

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Always respond with success regardless of whether the account exists —
    // this prevents attackers from using this endpoint to discover registered emails.
    // Skip accounts with no password (Google/Apple-only sign-in has nothing to reset).
    if (user && user.password_hash) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.otpVerification.create({
        data: {
          email: normalizedEmail,
          code: otpCode,
          purpose: 'PASSWORD_RESET',
          expires_at: expiresAt,
        },
      });

      const emailResult = await sendPasswordResetEmail(normalizedEmail, otpCode, user.name);
      if (!emailResult.success) {
        console.warn('Could not dispatch password reset email, code saved in DB:', emailResult.error);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Agar bu email ro'yxatdan o'tgan bo'lsa, tasdiqlash kodi yuborildi.",
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
