import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { prisma } from '@/lib/prisma';
import { createSessionToken } from '@/lib/auth';
import { safeRedirectTarget } from '@/lib/safeRedirect';

interface RouteContext {
  params: Promise<{ provider: string }>;
}

const APPLE_JWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));

async function verifyAppleIdToken(idToken: string): Promise<{ email: string }> {
  const { payload } = await jwtVerify(idToken, APPLE_JWKS, {
    issuer: 'https://appleid.apple.com',
    audience: process.env.APPLE_CLIENT_ID,
  });

  if (!payload.email || typeof payload.email !== 'string') {
    throw new Error('Apple ID token did not include an email address');
  }

  return { email: payload.email };
}

async function upsertOAuthUser(email: string, name: string) {
  const user = await prisma.user.upsert({
    where: { email },
    update: { email_verified: true },
    create: {
      email,
      name,
      password_hash: 'OAUTH_EXTERNAL_LOGIN',
      role: 'CUSTOMER',
      email_verified: true,
      must_change_password: false,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    country: user.country,
    role: user.role,
    email_verified: user.email_verified,
    must_change_password: false,
  };
}

function withSessionCookie(response: NextResponse, sessionToken: string) {
  response.cookies.set('artqala_user', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
  return response;
}

// Google: redirected back with ?code=...&state=... in the query string.
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { provider } = await params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = safeRedirectTarget(searchParams.get('state'));

  if (provider !== 'google') {
    return NextResponse.redirect(new URL('/signin?error=oauth_failed', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/signin?error=oauth_cancelled', request.url));
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${origin}/api/auth/oauth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      throw new Error('Failed to obtain Google access token');
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    if (!userData.email) {
      throw new Error('No verified email returned by Google');
    }

    const userSession = await upsertOAuthUser(
      userData.email,
      userData.name || userData.email.split('@')[0]
    );
    const sessionToken = createSessionToken(userSession);
    const response = NextResponse.redirect(new URL(state, request.url));
    return withSessionCookie(response, sessionToken);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/signin?error=oauth_failed', request.url));
  }
}

// Apple: response_mode=form_post — Apple POSTs `id_token` (and `user` on first
// authorization only) as application/x-www-form-urlencoded body fields, not query params.
export async function POST(request: NextRequest, { params }: RouteContext) {
  const { provider } = await params;

  if (provider !== 'apple') {
    return NextResponse.redirect(new URL('/signin?error=oauth_failed', request.url));
  }

  try {
    const form = await request.formData();
    const idToken = form.get('id_token');
    const state = safeRedirectTarget(form.get('state') as string | null);
    const userField = form.get('user');

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.redirect(new URL('/signin?error=oauth_cancelled', request.url));
    }

    const { email } = await verifyAppleIdToken(idToken);

    let name = email.split('@')[0];
    if (typeof userField === 'string') {
      try {
        const parsed = JSON.parse(userField);
        const firstName = parsed?.name?.firstName;
        const lastName = parsed?.name?.lastName;
        if (firstName || lastName) {
          name = [firstName, lastName].filter(Boolean).join(' ');
        }
      } catch {
        // Apple only sends `user` on the first authorization; ignore if absent/malformed.
      }
    }

    const userSession = await upsertOAuthUser(email, name);
    const sessionToken = createSessionToken(userSession);
    const response = NextResponse.redirect(new URL(state, request.url));
    return withSessionCookie(response, sessionToken);
  } catch (error) {
    console.error('Apple OAuth callback error:', error);
    return NextResponse.redirect(new URL('/signin?error=oauth_failed', request.url));
  }
}
