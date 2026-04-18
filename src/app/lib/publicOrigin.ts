export function normalizePublicOrigin(raw: string | undefined): string {
  if (!raw?.trim()) return '';
  const u = raw.trim().replace(/\/+$/, '');
  try {
    new URL(u);
    return u;
  } catch {
    return '';
  }
}

export function resolvePublicOrigin(envValue: string | undefined, fallback: string): string {
  const fromEnv = normalizePublicOrigin(envValue);
  return fromEnv || fallback;
}

export function isLikelyUnreachableForQrScan(origin: string): boolean {
  try {
    const u = new URL(origin);
    const h = u.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return true;
    if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
    if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
    if (/^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(h)) return true;
    return false;
  } catch {
    return true;
  }
}
