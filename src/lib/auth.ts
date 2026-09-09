import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  country?: string | null;
  role: string;
  email_verified: boolean;
  must_change_password?: boolean;
}

if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
  // The fallback below is public (checked into the repo) — running production
  // with it would let anyone forge an admin session token. Fail loudly instead.
  throw new Error(
    'NEXTAUTH_SECRET is not set. Set it in your production environment before deploying (see .env.example).'
  );
}

const SECRET = process.env.NEXTAUTH_SECRET || 'artqala-fallback-secret-2026-tashkent';

// Create a cryptographically signed session token: base64(payload) + "." + hmac_sha256(payload, secret)
export function createSessionToken(user: UserSession): string {
  const payloadStr = JSON.stringify({
    ...user,
    iat: Date.now(),
  });
  const encodedPayload = Buffer.from(payloadStr, 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

// Verify signature and extract session payload
export function verifySessionToken(token: string | undefined | null): UserSession | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return null; // Tampered token!
  }

  try {
    const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const data = JSON.parse(payloadStr);
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      country: data.country,
      role: data.role,
      email_verified: data.email_verified,
      must_change_password: !!data.must_change_password,
    };
  } catch {
    return null;
  }
}

// Read current user session on server
export async function getServerSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('artqala_user')?.value;
  return verifySessionToken(token);
}

// Protect API routes: Ensures requester is authenticated and has role === 'ADMIN'
export async function requireAdmin(): Promise<
  { user: UserSession; errorResponse?: never } | { user?: never; errorResponse: NextResponse }
> {
  const user = await getServerSession();

  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required' },
        { status: 401 }
      ),
    };
  }

  if (user.role !== 'ADMIN') {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: 'Forbidden: Admin privileges required' },
        { status: 403 }
      ),
    };
  }

  return { user };
}
