import crypto from 'crypto';

/**
 * Generates a secure random hex token
 */
export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generates a SHA-256 hash of a given token string
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
