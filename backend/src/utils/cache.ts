import { Redis } from 'ioredis';
import { env } from '../config/env.js';

interface CacheMetrics {
  hitCount: number;
  missCount: number;
  invalidationCount: number;
  redisResponseTimes: number[];
  dbResponseTimes: number[];
}

class CacheService {
  private client: Redis | null = null;
  private metrics: CacheMetrics = {
    hitCount: 0,
    missCount: 0,
    invalidationCount: 0,
    redisResponseTimes: [],
    dbResponseTimes: [],
  };

  constructor() {
    if (env.REDIS_URL) {
      console.log('[Redis Init] Initializing Redis client for lazy connection...');
      this.client = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        retryStrategy(times) {
          const delay = Math.min(times * 100, 3000);
          return delay;
        },
      });

      this.client.on('connect', () => {
        console.log('[Redis Connected] Client connection to server established');
      });

      this.client.on('ready', () => {
        console.log('[Redis Ready] Client is ready to receive commands');
      });

      this.client.on('reconnecting', (delay: number) => {
        console.log(`[Redis Reconnecting] Reconnecting to Redis in ${delay}ms`);
      });

      this.client.on('error', (err) => {
        console.error('[Redis Error] Connection problem detected:', err.message);
      });

      this.client.on('end', () => {
        console.log('[Redis End] Redis connection has ended');
      });
    } else {
      console.log('[Redis Info] REDIS_URL not configured. Running without Redis performance layer.');
    }
  }

  /**
   * Acquire a distributed lock using SET NX PX
   */
  async acquireLock(key: string, ttlMs = 4000): Promise<boolean> {
    if (!this.client) return false;
    try {
      const lockKey = `lock:${key}`;
      const result = await this.client.set(lockKey, 'locked', 'PX', ttlMs, 'NX');
      return result === 'OK';
    } catch (error) {
      console.error(`[Redis Error] Failed to acquire lock for "${key}":`, (error as Error).message);
      return false;
    }
  }

  /**
   * Release lock key
   */
  async releaseLock(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.del(`lock:${key}`);
    } catch (error) {
      console.error(`[Redis Error] Failed to release lock for "${key}":`, (error as Error).message);
    }
  }

  /**
   * Fetch item version suffix
   */
  async getVersionedKey(baseKey: string): Promise<string> {
    if (!this.client) return `${baseKey}:v1`;
    try {
      const versionKey = `version:${baseKey}`;
      let version = await this.client.get(versionKey);
      if (!version) {
        version = '1';
        await this.client.set(versionKey, '1');
      }
      return `${baseKey}:v${version}`;
    } catch (error) {
      console.error(`[Redis Error] Failed to retrieve version for key "${baseKey}":`, (error as Error).message);
      return `${baseKey}:v1`;
    }
  }

  /**
   * Bump version key to invalidate older keys automatically
   */
  async incrementVersion(baseKey: string): Promise<void> {
    if (!this.client) return;
    try {
      const versionKey = `version:${baseKey}`;
      await this.client.incr(versionKey);
      this.metrics.invalidationCount++;
      console.log(`[Cache Evicted / Version Bumped] Base Key: ${baseKey}`);
    } catch (error) {
      console.error(`[Redis Error] Failed to bump version for key "${baseKey}":`, (error as Error).message);
    }
  }

  /**
   * Fetch direct string value (cached JSON)
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    const start = performance.now();
    try {
      const value = await this.client.get(key);
      const latency = performance.now() - start;
      this.metrics.redisResponseTimes.push(latency);

      if (value) {
        this.metrics.hitCount++;
        console.log(`[Cache Hit] Key: ${key}`);
        return JSON.parse(value) as T;
      } else {
        this.metrics.missCount++;
        console.log(`[Cache Miss] Key: ${key}`);
        return null;
      }
    } catch (error) {
      console.error(`[Redis Error] GET failure for "${key}":`, (error as Error).message);
      return null;
    }
  }

  /**
   * Set JSON cache string
   */
  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    if (!this.client) return;
    if (value === null || value === undefined) return;
    try {
      const serialized = JSON.stringify(value);
      await this.client.set(key, serialized, 'EX', ttlSeconds);
      console.log(`[Cache Set] Key: ${key} (TTL: ${ttlSeconds}s)`);
    } catch (error) {
      console.error(`[Redis Error] SET failure for "${key}":`, (error as Error).message);
    }
  }

  /**
   * Delete specific key
   */
  async del(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.del(key);
      this.metrics.invalidationCount++;
      console.log(`[Cache Evicted] Key: ${key}`);
    } catch (error) {
      console.error(`[Redis Error] DEL failure for "${key}":`, (error as Error).message);
    }
  }

  /**
   * Pipeline read multiple keys simultaneously
   */
  async getMany<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.client || keys.length === 0) {
      return keys.map(() => null);
    }
    const start = performance.now();
    try {
      const pipeline = this.client.pipeline();
      keys.forEach((key) => pipeline.get(key));
      const results = await pipeline.exec();
      const latency = performance.now() - start;
      this.metrics.redisResponseTimes.push(latency);

      if (!results) return keys.map(() => null);

      return results.map(([err, val]) => {
        if (err || !val) {
          this.metrics.missCount++;
          return null;
        }
        try {
          this.metrics.hitCount++;
          return JSON.parse(val as string) as T;
        } catch {
          return null;
        }
      });
    } catch (error) {
      console.error('[Redis Error] Pipeline GET failure:', (error as Error).message);
      return keys.map(() => null);
    }
  }

  /**
   * Read-through cache with Distributed Stampede Lock protection
   */
  async getOrFetch<T>(
    key: string,
    ttlSeconds: number,
    fetchFn: () => Promise<T | null>
  ): Promise<T | null> {
    // 1. Try to read cache first
    let cached = await this.get<T>(key);
    if (cached) {
      return cached;
    }

    // 2. Cache Miss - If Redis is unconfigured, return DB query directly
    if (!this.client) {
      const dbStart = performance.now();
      const dbResult = await fetchFn();
      this.metrics.dbResponseTimes.push(performance.now() - dbStart);
      return dbResult;
    }

    // 3. Stampede Protection: Try to acquire distributed lock
    const acquired = await this.acquireLock(key);
    if (acquired) {
      try {
        console.log(`[Cache Stampede Win] Current request is fetching from DB for key: ${key}`);
        const dbStart = performance.now();
        const dbResult = await fetchFn();
        this.metrics.dbResponseTimes.push(performance.now() - dbStart);

        if (dbResult !== null && dbResult !== undefined) {
          await this.set(key, dbResult, ttlSeconds);
        }
        return dbResult;
      } finally {
        await this.releaseLock(key);
      }
    } else {
      console.log(`[Cache Stampede Wait] Another request is fetching. Polling cache for key: ${key}`);
      // Poll cache every 150ms up to 10 times (1.5 seconds maximum wait)
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        cached = await this.get<T>(key);
        if (cached) {
          return cached;
        }
      }
      console.warn(`[Cache Stampede Timeout] Lock wait timed out. Querying PostgreSQL directly for key: ${key}`);
      const dbStart = performance.now();
      const dbResult = await fetchFn();
      this.metrics.dbResponseTimes.push(performance.now() - dbStart);
      return dbResult;
    }
  }

  /**
   * Export internal metrics
   */
  getMetrics() {
    const hits = this.metrics.hitCount;
    const misses = this.metrics.missCount;
    const total = hits + misses;
    const hitRatio = total > 0 ? (hits / total) * 100 : 0;

    const avgRedis = this.metrics.redisResponseTimes.length > 0
      ? this.metrics.redisResponseTimes.reduce((a, b) => a + b, 0) / this.metrics.redisResponseTimes.length
      : 0;

    const avgDb = this.metrics.dbResponseTimes.length > 0
      ? this.metrics.dbResponseTimes.reduce((a, b) => a + b, 0) / this.metrics.dbResponseTimes.length
      : 0;

    return {
      hitCount: hits,
      missCount: misses,
      hitRatio: `${hitRatio.toFixed(2)}%`,
      invalidationCount: this.metrics.invalidationCount,
      avgRedisResponseTimeMs: `${avgRedis.toFixed(2)}ms`,
      avgDbResponseTimeMs: `${avgDb.toFixed(2)}ms`,
    };
  }
}

export const cacheService = new CacheService();
