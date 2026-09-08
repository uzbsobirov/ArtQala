import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    const record = await prisma.otpVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        code: code.trim(),
        expires_at: { gte: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Activate user
    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { email_verified: true },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        role: true,
        email_verified: true,
      },
    });

    // Clean up OTP record
    await prisma.otpVerification.delete({
      where: { id: record.id },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Email successfully verified!',
      user: updatedUser,
    });

    // Set auth cookie
    response.cookies.set('artqala_user', JSON.stringify(updatedUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
