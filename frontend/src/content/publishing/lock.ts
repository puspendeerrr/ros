/**
 * Lightweight File Lock for Publishing Engine
 * Prevents concurrent builds from creating race conditions.
 * Includes automatic stale lock detection (> 5 minutes).
 */

import fs from 'fs';
import path from 'path';

export class BuildLock {
  private static readonly STALE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

  public static acquire(lockFilePath: string, buildId: string): boolean {
    const dir = path.dirname(lockFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(lockFilePath)) {
      try {
        const raw = fs.readFileSync(lockFilePath, 'utf-8');
        const lockInfo = JSON.parse(raw);
        const lockAge = Date.now() - new Date(lockInfo.timestamp).getTime();

        if (lockAge < this.STALE_TIMEOUT_MS) {
          console.error(`[BuildLock] Lock currently held by build "${lockInfo.buildId}" acquired at ${lockInfo.timestamp} (${Math.round(lockAge / 1000)}s ago).`);
          return false;
        }

        console.warn(`[BuildLock] Stale lock detected (age: ${Math.round(lockAge / 1000)}s). Forcing acquisition for build "${buildId}".`);
      } catch {
        console.warn('[BuildLock] Corrupted lock file found. Overwriting.');
      }
    }

    const payload = {
      buildId,
      timestamp: new Date().toISOString(),
      pid: process.pid,
    };

    fs.writeFileSync(lockFilePath, JSON.stringify(payload, null, 2), 'utf-8');
    return true;
  }

  public static release(lockFilePath: string): void {
    if (fs.existsSync(lockFilePath)) {
      try {
        fs.unlinkSync(lockFilePath);
      } catch (err) {
        console.warn(`[BuildLock] Failed to cleanly unlink lock file: ${err}`);
      }
    }
  }
}
