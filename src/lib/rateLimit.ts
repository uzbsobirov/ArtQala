import { Redis } from '@upstash/redis';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// Shared across all serverless instances when Upstash is configured — falls
// back to this process's own memory otherwise (fine for local dev, but on
// Vercel each warm instance would then enforce the limit independently, so
// the *effective* limit is looser than the number passed to checkRateLimit).
const memoryStore = new Map<string, RateLimitRecord>();

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (now > record.resetAt) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

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

export async function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds: number }> {
  const now = Date.now();

  if (redis) {
    const redisKey = `ratelimit:${key}`;
    const [count, ttlMs] = await Promise.all([
      redis.get<number>(redisKey),
      redis.pttl(redisKey),
    ]);
    // pttl is -2 (no such key) or -1 (no TTL set) when there's no active window.
    if (!count || ttlMs === -2 || ttlMs === -1) {
      return { allowed: true, remaining: maxAttempts, retryAfterSeconds: 0 };
    }
    if (count >= maxAttempts) {
      return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)) };
    }
    return { allowed: true, remaining: Math.max(0, maxAttempts - count), retryAfterSeconds: 0 };
  }

  const record = memoryStore.get(key);
  if (!record || now > record.resetAt) {
    return { allowed: true, remaining: maxAttempts, retryAfterSeconds: 0 };
  }
  if (record.count >= maxAttempts) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }
  return { allowed: true, remaining: Math.max(0, maxAttempts - record.count), retryAfterSeconds: 0 };
}

export async function recordFailedAttempt(
  key: string,
  windowMs: number = 15 * 60 * 1000
): Promise<number> {
  const now = Date.now();

  if (redis) {
    const redisKey = `ratelimit:${key}`;
    // INCR creates the key at 1 if absent; only (re)apply the expiry on that
    // first increment so an existing window's TTL isn't extended by later
    // attempts within it.
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.pexpire(redisKey, windowMs);
    }
    return count;
  }

  const record = memoryStore.get(key);
  if (!record || now > record.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return 1;
  }
  record.count += 1;
  return record.count;
}

export async function resetRateLimit(key: string): Promise<void> {
  if (redis) {
    await redis.del(`ratelimit:${key}`);
    return;
  }
  memoryStore.delete(key);
}
