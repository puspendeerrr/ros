import { Redis } from 'ioredis';
import zlib from 'zlib';
import { env } from '../config/env';
import { CacheConfig } from '../config/cache';
import { requestContextStore } from './context';

interface CacheMetrics {
  hitCount: number;
  missCount: number;
  invalidationCount: number;
  errorCount: number;
  fallbackCount: number;
  stampedeLockCount: number;
  warmCount: number;
  refreshCount: number;
  redisResponseTimes: number[];
  dbResponseTimes: number[];
}

interface CacheEnvelope<T> {
  data: T;
  cachedAt: number;
  ttlMs: number;
}

class CacheService {
  private client: Redis | null = null;
  private metrics: CacheMetrics = {
    hitCount: 0,
    missCount: 0,
    invalidationCount: 0,
    errorCount: 0,
    fallbackCount: 0,
    stampedeLockCount: 0,
    warmCount: 0,
    refreshCount: 0,
    redisResponseTimes: [],
    dbResponseTimes: [],
  };

  constructor() {
    if (env.REDIS_URL) {
      this.logStructured('Redis Init', '', 0, { message: 'Initializing ioredis client with lazy connection' });
      this.client = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        retryStrategy(times) {
          const delay = Math.min(times * 100, 3000);
          return delay;
        },
      });

      this.client.on('connect', () => {
        this.logStructured('Redis Connected', '', 0);
      });

      this.client.on('ready', () => {
        this.logStructured('Redis Ready', '', 0);
      });

      this.client.on('reconnecting', (delay: number) => {
        this.logStructured('Redis Reconnect', '', 0, { delayMs: delay });
      });

      this.client.on('error', (err) => {
        this.metrics.errorCount++;
        this.logStructured('Redis Error', '', 0, { error: err.message });
      });

      this.client.on('end', () => {
        this.logStructured('Redis End', '', 0);
      });
    } else {
      this.logStructured('Redis Info', '', 0, { message: 'REDIS_URL not configured. Running without Redis performance layer.' });
    }
  }

  /**
   * Run redis commands inside timeout race
   */
  private async executeWithTimeout<T>(
    operationName: string,
    keyForLog: string,
    redisPromise: Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    let timeoutId: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Redis command timeout [${operationName}]`));
      }, CacheConfig.redisTimeout);
    });

    try {
      const result = await Promise.race([redisPromise, timeoutPromise]);
      const duration = performance.now() - startTime;
      this.metrics.redisResponseTimes.push(duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.metrics.errorCount++;
      const err = error as Error;
      if (err.message.includes('timeout')) {
        this.logStructured('Redis Timeout', keyForLog, duration, { operation: operationName });
      } else {
        this.logStructured('Redis Error', keyForLog, duration, { operation: operationName, error: err.message });
      }
      throw error;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  /**
   * Log utility for consistent, structured console logs
   */
  private logStructured(
    event: string,
    cacheKey: string,
    durationMs: number,
    extra: Record<string, any> = {}
  ) {
    const ctx = requestContextStore.getStore();
    const logObj = {
      timestamp: new Date().toISOString(),
      requestId: ctx?.requestId || 'system',
      event,
      cacheKey: cacheKey || undefined,
      durationMs: durationMs > 0 ? parseFloat(durationMs.toFixed(2)) : undefined,
      ...extra,
    };
    console.log(JSON.stringify(logObj));
  }

  /**
   * Acquire a distributed lock using SET NX PX
   */
  async acquireLock(key: string, ttlMs = CacheConfig.lockTimeout): Promise<boolean> {
    if (!this.client) return false;
    const lockKey = `lock:${key}`;
    try {
      const result = await this.executeWithTimeout(
        'acquireLock',
        lockKey,
        this.client.set(lockKey, 'locked', 'PX', ttlMs, 'NX')
      );
      this.metrics.stampedeLockCount++;
      return result === 'OK';
    } catch (error) {
      return false;
    }
  }

  /**
   * Release lock key
   */
  async releaseLock(key: string): Promise<void> {
    if (!this.client) return;
    const lockKey = `lock:${key}`;
    try {
      await this.executeWithTimeout(
        'releaseLock',
        lockKey,
        this.client.del(lockKey)
      );
    } catch (error) {
      // Ignored for release errors
    }
  }

  /**
   * Fetch item version suffix
   */
  async getVersionedKey(baseKey: string): Promise<string> {
    if (!this.client) return `${baseKey}:v1`;
    const start = performance.now();
    try {
      const versionKey = `version:${baseKey}`;
      let version = await this.executeWithTimeout('getVersion', versionKey, this.client.get(versionKey));
      if (!version) {
        version = '1';
        await this.executeWithTimeout('setVersion', versionKey, this.client.set(versionKey, '1'));
      }
      return `${baseKey}:v${version}`;
    } catch (error) {
      this.logStructured('DB Fallback', baseKey, performance.now() - start, { error: (error as Error).message });
      return `${baseKey}:v1`;
    }
  }

  /**
   * Bump version key to invalidate older keys automatically
   */
  async incrementVersion(baseKey: string): Promise<void> {
    if (!this.client) return;
    const start = performance.now();
    const versionKey = `version:${baseKey}`;
    try {
      await this.executeWithTimeout('incrementVersion', versionKey, this.client.incr(versionKey));
      this.metrics.invalidationCount++;
      this.logStructured('Cache Version Bump', baseKey, performance.now() - start);
    } catch (error) {
      this.logStructured('Redis Error', baseKey, performance.now() - start, { error: (error as Error).message });
    }
  }

  /**
   * Fetch direct value with decompression support
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    const start = performance.now();
    try {
      const buffer = await this.executeWithTimeout(
        'getBuffer',
        key,
        this.client.getBuffer(key)
      );
      const duration = performance.now() - start;

      if (buffer) {
        let strValue: string;
        // Gzip signature check: 0x1f8b
        if (buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b) {
          strValue = zlib.gunzipSync(buffer).toString('utf-8');
        } else {
          strValue = buffer.toString('utf-8');
        }

        const envelope = JSON.parse(strValue) as CacheEnvelope<T>;
        this.metrics.hitCount++;
        this.logStructured('Cache Hit', key, duration, { compressed: buffer.length >= 2 && buffer[0] === 0x1f });
        return envelope.data;
      } else {
        this.metrics.missCount++;
        this.logStructured('Cache Miss', key, duration);
        return null;
      }
    } catch (error) {
      this.logStructured('Redis Error', key, performance.now() - start, { error: (error as Error).message });
      return null;
    }
  }

  /**
   * Set cache with transparent gzip compression
   */
  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    if (!this.client) return;
    if (value === null || value === undefined) return;
    const start = performance.now();
    try {
      const envelope: CacheEnvelope<any> = {
        data: value,
        cachedAt: Date.now(),
        ttlMs: ttlSeconds * 1000,
      };

      const serialized = JSON.stringify(envelope);
      let payload: Buffer | string = serialized;
      let compressed = false;

      if (serialized.length > CacheConfig.compressionThreshold) {
        payload = zlib.gzipSync(Buffer.from(serialized, 'utf-8'));
        compressed = true;
      }

      await this.executeWithTimeout(
        'set',
        key,
        this.client.set(key, payload as any, 'EX', ttlSeconds)
      );

      this.logStructured('Cache Set', key, performance.now() - start, {
        ttlSeconds,
        compressed,
        sizeBytes: serialized.length,
      });
    } catch (error) {
      this.logStructured('Redis Error', key, performance.now() - start, { error: (error as Error).message });
    }
  }

  /**
   * Delete specific key
   */
  async del(key: string): Promise<void> {
    if (!this.client) return;
    const start = performance.now();
    try {
      await this.executeWithTimeout('del', key, this.client.del(key));
      this.metrics.invalidationCount++;
      this.logStructured('Cache Evicted', key, performance.now() - start);
    } catch (error) {
      this.logStructured('Redis Error', key, performance.now() - start, { error: (error as Error).message });
    }
  }

  /**
   * Read-through cache with Distributed Lock & Stale-While-Revalidate (SWR) protection
   */
  async getOrFetch<T>(
    key: string,
    ttlSeconds: number,
    fetchFn: () => Promise<T | null>
  ): Promise<T | null> {
    // 1. Try to read cache first
    const start = performance.now();
    if (!this.client) {
      this.metrics.fallbackCount++;
      const dbStart = performance.now();
      const dbResult = await fetchFn();
      this.metrics.dbResponseTimes.push(performance.now() - dbStart);
      this.logStructured('DB Fallback', key, performance.now() - start, { reason: 'redis_unconfigured' });
      return dbResult;
    }

    try {
      const buffer = await this.executeWithTimeout('getBuffer', key, this.client.getBuffer(key));
      if (buffer) {
        let strValue: string;
        if (buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b) {
          strValue = zlib.gunzipSync(buffer).toString('utf-8');
        } else {
          strValue = buffer.toString('utf-8');
        }

        const envelope = JSON.parse(strValue) as CacheEnvelope<T>;
        this.metrics.hitCount++;
        this.logStructured('Cache Hit', key, performance.now() - start);

        // --- STALE-WHILE-REVALIDATE (SWR) TRIGGER ---
        const ageMs = Date.now() - envelope.cachedAt;
        const triggerThresholdMs = 0.8 * envelope.ttlMs;

        if (ageMs > triggerThresholdMs) {
          this.metrics.refreshCount++;
          this.logStructured('Cache Refresh', key, 0, { ageMs, ttlMs: envelope.ttlMs });
          // Trigger revalidation in background
          fetchFn().then(async (freshData) => {
            if (freshData !== null && freshData !== undefined) {
              await this.set(key, freshData, ttlSeconds);
            }
          }).catch((err) => {
            console.error(`[Background Refresh Error] Failed to refresh key "${key}":`, err.message);
          });
        }

        return envelope.data;
      }
    } catch (error) {
      // Graceful failover to DB on Redis GET or parse failure
      this.metrics.fallbackCount++;
      const dbStart = performance.now();
      const dbResult = await fetchFn();
      this.metrics.dbResponseTimes.push(performance.now() - dbStart);
      this.logStructured('DB Fallback', key, performance.now() - start, { reason: 'redis_read_failed', error: (error as Error).message });
      return dbResult;
    }

    // 2. Cache Miss: Acq lock & fetch DB
    const acquired = await this.acquireLock(key);
    if (acquired) {
      try {
        this.logStructured('Cache Miss', key, performance.now() - start, { message: 'Acquired stampede lock. Querying DB.' });
        const dbStart = performance.now();
        const dbResult = await fetchFn();
        this.metrics.dbResponseTimes.push(performance.now() - dbStart);

        if (dbResult !== null && dbResult !== undefined) {
          await this.set(key, dbResult, ttlSeconds);
        }
        return dbResult;
      } catch (dbErr) {
        this.metrics.fallbackCount++;
        return null;
      } finally {
        await this.releaseLock(key);
      }
    } else {
      // Queue & poll
      this.logStructured('Cache Miss', key, performance.now() - start, { message: 'Lock busy. Waiting to poll cache.' });
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        try {
          const buffer = await this.executeWithTimeout('getBuffer', key, this.client.getBuffer(key));
          if (buffer) {
            let strValue: string;
            if (buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b) {
              strValue = zlib.gunzipSync(buffer).toString('utf-8');
            } else {
              strValue = buffer.toString('utf-8');
            }
            const envelope = JSON.parse(strValue) as CacheEnvelope<T>;
            this.metrics.hitCount++;
            return envelope.data;
          }
        } catch {
          // Continue loop
        }
      }

      // Lock wait timeout -> Fallback directly to DB
      this.metrics.fallbackCount++;
      const dbStart = performance.now();
      const dbResult = await fetchFn();
      this.metrics.dbResponseTimes.push(performance.now() - dbStart);
      this.logStructured('DB Fallback', key, performance.now() - start, { reason: 'stampede_lock_timeout' });
      return dbResult;
    }
  }

  /**
   * Health metrics check wrapper
   */
  async getHealth() {
    if (!this.client) {
      return { status: 'unconfigured' };
    }
    const start = performance.now();
    try {
      await this.executeWithTimeout('ping', 'ping', this.client.ping());
      const latency = `${(performance.now() - start).toFixed(1)}ms`;

      // Fetch REDIS INFO
      const infoStr = await this.executeWithTimeout('info', 'info', this.client.info());
      const uptimeSec = infoStr.match(/uptime_in_seconds:(\d+)/)?.[1] || '0';
      const memoryUsage = infoStr.match(/used_memory_human:([^\r\n]+)/)?.[1] || '0';
      const connectedClients = infoStr.match(/connected_clients:(\d+)/)?.[1] || '0';

      const uptimeDays = Math.floor(parseInt(uptimeSec) / 86400);
      const uptimeHrs = Math.floor((parseInt(uptimeSec) % 86400) / 3600);
      const uptimeStr = `${uptimeDays}d ${uptimeHrs}h`;

      return {
        status: 'connected',
        latency,
        uptime: uptimeStr,
        memoryUsage,
        connectedClients: parseInt(connectedClients),
      };
    } catch (err) {
      return {
        status: 'disconnected',
        error: (err as Error).message,
      };
    }
  }

  /**
   * Increment warm count for reporting metrics
   */
  incrementWarmCount() {
    this.metrics.warmCount++;
  }

  /**
   * Export cache performance stats
   */
  getMetrics() {
    const hits = this.metrics.hitCount;
    const misses = this.metrics.missCount;
    const total = hits + misses;
    const hitRatio = total > 0 ? `${((hits / total) * 100).toFixed(2)}%` : '0.00%';

    const avgRedis = this.metrics.redisResponseTimes.length > 0
      ? this.metrics.redisResponseTimes.reduce((a, b) => a + b, 0) / this.metrics.redisResponseTimes.length
      : 0;

    const avgDb = this.metrics.dbResponseTimes.length > 0
      ? this.metrics.dbResponseTimes.reduce((a, b) => a + b, 0) / this.metrics.dbResponseTimes.length
      : 0;

    return {
      hitCount: hits,
      missCount: misses,
      hitRatio,
      errorCount: this.metrics.errorCount,
      dbFallbackCount: this.metrics.fallbackCount,
      stampedeLockCount: this.metrics.stampedeLockCount,
      cacheWarmCount: this.metrics.warmCount,
      backgroundRefreshCount: this.metrics.refreshCount,
      invalidationCount: this.metrics.invalidationCount,
      avgRedisResponseTimeMs: `${avgRedis.toFixed(2)}ms`,
      avgDbResponseTimeMs: `${avgDb.toFixed(2)}ms`,
    };
  }
}

export const cacheService = new CacheService();
