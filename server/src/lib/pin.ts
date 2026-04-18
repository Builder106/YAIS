import { createHash, timingSafeEqual } from 'node:crypto';

const SALT = 'medcore-demo-salt-v1';

export function hashPin(pin: string): string {
  return createHash('sha256').update(`${SALT}:${pin}`).digest('hex');
}

export function verifyPin(pin: string, hash: string | null | undefined): boolean {
  if (!hash) return false;
  const a = Buffer.from(hashPin(pin), 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function pinNeedsRotation(rotatedAt: number | null | undefined): boolean {
  if (!rotatedAt) return true;
  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
  return Date.now() - rotatedAt > THIRTY_DAYS;
}
