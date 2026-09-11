// Only allow same-site relative paths as post-login redirect targets.
// Rejects absolute URLs and protocol-relative URLs (e.g. "https://evil.com",
// "//evil.com") which would otherwise let an attacker turn our own OAuth
// login flow into an open redirect for phishing.
export function safeRedirectTarget(target: string | null | undefined, fallback = '/account'): string {
  if (!target) return fallback;
  if (!target.startsWith('/') || target.startsWith('//') || target.includes('://')) {
    return fallback;
  }
  return target;
}
