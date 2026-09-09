interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting
const store = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetAt) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    return {
      allowed: true,
      remaining: maxAttempts,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxAttempts - record.count),
    retryAfterSeconds: 0,
  };
}

export function recordFailedAttempt(
  key: string,
  windowMs: number = 15 * 60 * 1000
): number {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return 1;
  }

  record.count += 1;
  return record.count;
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}
