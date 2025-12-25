/**
 * Redis caching layer
 * In production, use ioredis or @upstash/redis
 */

// For now, use in-memory cache (replace with Redis in production)
class MemoryCache {
  private cache: Map<string, { value: any; expiresAt: number }> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async delPattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
const cache = new MemoryCache();

// Redis implementation (uncomment when Redis is available)
/*
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async delPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};
*/

export { cache };

/**
 * Cache wrapper with automatic key generation
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  const value = await fn();
  await cache.set(key, value, ttlSeconds);
  return value;
}

/**
 * Cache search results
 */
export async function cacheSearchResults<T>(
  filters: Record<string, any>,
  fn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const cacheKey = `search:${JSON.stringify(filters)}`;
  return cached(cacheKey, fn, ttlSeconds);
}

/**
 * Invalidate cache patterns
 */
export async function invalidateCache(pattern: string): Promise<void> {
  await cache.delPattern(pattern);
}

