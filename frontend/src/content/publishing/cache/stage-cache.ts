/**
 * Granular Stage-Specific Build Cache Manager
 * Deconstructs caches into isolated files under .cache/
 * Auto-invalidates entries when CACHE_SCHEMA_VERSION changes.
 */

import fs from 'fs';
import path from 'path';

export const CACHE_SCHEMA_VERSION = '1.0.0';

export interface StageCachePayload<T = unknown> {
  schemaVersion: string;
  updatedAt: string;
  entries: Record<string, T>;
}

export class StageCacheManager<T = unknown> {
  private cacheFilePath: string;
  private entries: Map<string, T> = new Map();
  private isLoaded = false;

  constructor(cacheDir: string, stageName: string) {
    this.cacheFilePath = path.join(cacheDir, `${stageName}.cache.json`);
  }

  public load(): void {
    if (this.isLoaded) return;

    if (fs.existsSync(this.cacheFilePath)) {
      try {
        const raw = fs.readFileSync(this.cacheFilePath, 'utf-8');
        const data: StageCachePayload<T> = JSON.parse(raw);

        if (data.schemaVersion === CACHE_SCHEMA_VERSION && data.entries) {
          this.entries = new Map(Object.entries(data.entries));
        } else {
          console.warn(`[StageCache] Outdated cache schema in "${path.basename(this.cacheFilePath)}". Invalidation triggered.`);
          this.entries.clear();
        }
      } catch (err) {
        console.warn(`[StageCache] Failed to parse "${path.basename(this.cacheFilePath)}". Starting clean. Error: ${err}`);
        this.entries.clear();
      }
    }
    this.isLoaded = true;
  }

  public get(key: string): T | undefined {
    this.load();
    return this.entries.get(key);
  }

  public set(key: string, value: T): void {
    this.load();
    this.entries.set(key, value);
  }

  public has(key: string): boolean {
    this.load();
    return this.entries.has(key);
  }

  public save(): void {
    const dir = path.dirname(this.cacheFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const payload: StageCachePayload<T> = {
      schemaVersion: CACHE_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      entries: Object.fromEntries(this.entries.entries()),
    };

    fs.writeFileSync(this.cacheFilePath, JSON.stringify(payload, null, 2), 'utf-8');
  }

  public clear(): void {
    this.entries.clear();
    if (fs.existsSync(this.cacheFilePath)) {
      try {
        fs.unlinkSync(this.cacheFilePath);
      } catch {}
    }
  }

  public size(): number {
    this.load();
    return this.entries.size;
  }
}
