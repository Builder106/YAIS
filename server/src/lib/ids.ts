import { randomBytes } from 'node:crypto';

export function newId(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${ts}${rand}`;
}
