import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
  // The fallback below is public (checked into the repo) — running production
  // with it would let anyone forge an admin session token. Fail loudly instead.
  throw new Error(
    'NEXTAUTH_SECRET is not set. Set it in your production environment before deploying (see .env.example).'
  );
}

const SECRET = process.env.NEXTAUTH_SECRET || 'artqala-fallback-secret-2026-tashkent';

async function verifyToken(token: string | undefined): Promise<{ role: string } | null> {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(encodedPayload)
    );

    const expectedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuffer))
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    if (expectedSignature !== signature) {
      return null;
    }

    const payloadStr = atob(
      encodedPayload.replace(/-/g, '+').replace(/_/g, '/')
    );
    return JSON.parse(payloadStr);
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminApi = pathname.startsWith('/api/admin');
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isAdminApi || isAdminPage) {
    const token = request.cookies.get('artqala_user')?.value;
    const session = await verifyToken(token);

    if (!session || session.role !== 'ADMIN') {
      if (isAdminApi) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Admin privileges required' },
          { status: 401 }
        );
      } else {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
