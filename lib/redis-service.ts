import Redis from 'ioredis';

// Redis configuration - requires external Redis service for production
const REDIS_URL = process.env.REDIS_URL;
const REDIS_TTL = parseInt(process.env.CACHE_TTL || '300'); // 5 minutes default

if (!REDIS_URL) {
  throw new Error('REDIS_URL environment variable is required for Redis connection');
}

// Redis client with production optimizations
export const redis = new Redis(REDIS_URL, {
  // Connection settings
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  
  // Performance optimizations
  enableOfflineQueue: false,
  
  // Cluster settings (if using Redis cluster)
  enableReadyCheck: true,
});

// Connection event handlers
redis.on('connect', () => {
  console.log('🔴 Redis connected successfully');
});

redis.on('ready', () => {
  console.log('✅ Redis ready for operations');
});

redis.on('error', (err: Error) => {
  console.error('❌ Redis error:', err);
});

redis.on('close', () => {
  console.log('⚠️ Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

// Cache helper functions
export class CacheService {
  private static instance: CacheService;
  private redis: Redis;

  constructor() {
    this.redis = redis;
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Set cache with TTL
  async set(key: string, value: any, ttl: number = REDIS_TTL): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.redis.setex(key, ttl, serialized);
    } catch (error) {
      console.error('❌ Cache set error:', error);
    }
  }

  // Get cache value
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('❌ Cache get error:', error);
      return null;
    }
  }

  // Delete cache key
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('❌ Cache delete error:', error);
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      await this.redis.flushdb();
      console.log('🧹 Cache cleared successfully');
    } catch (error) {
      console.error('❌ Cache clear error:', error);
    }
  }

  // Get cache statistics
  async getStats(): Promise<any> {
    try {
      const info = await this.redis.info();
      const keyspace = await this.redis.info('keyspace');
      
      return {
        info: this.parseRedisInfo(info),
        keyspace: this.parseRedisInfo(keyspace),
        keys: await this.redis.dbsize()
      };
    } catch (error) {
      console.error('❌ Cache stats error:', error);
      return null;
    }
  }

  // Pattern-based cache invalidation
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        console.log(`🗑️ Invalidated ${keys.length} cache keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      console.error('❌ Cache pattern invalidation error:', error);
    }
  }

  // Cache with fallback function
  async cacheWithFallback<T>(
    key: string, 
    fallback: () => Promise<T>, 
    ttl: number = REDIS_TTL
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Execute fallback function
      const result = await fallback();
      
      // Cache the result
      await this.set(key, result, ttl);
      
      return result;
    } catch (error) {
      console.error('❌ Cache with fallback error:', error);
      // Return fallback result even if caching fails
      return await fallback();
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; responseTime: number; error?: string }> {
    try {
      const start = Date.now();
      await this.redis.ping();
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Parse Redis INFO command output
  private parseRedisInfo(info: string): Record<string, any> {
    const lines = info.split('\r\n');
    const result: Record<string, any> = {};
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        if (key && value) {
          result[key] = value;
        }
      }
    }
    
    return result;
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

// Utility functions for common caching patterns
export async function cacheJson<T>(
  key: string, 
  ttlSec: number, 
  fn: () => Promise<T>
): Promise<T> {
  return cacheService.cacheWithFallback(key, fn, ttlSec);
}

export async function cacheStats(
  key: string, 
  ttlSec: number, 
  fn: () => Promise<any>
): Promise<any> {
  return cacheService.cacheWithFallback(key, fn, ttlSec);
}

export async function cacheSearch(
  key: string, 
  ttlSec: number, 
  fn: () => Promise<any>
): Promise<any> {
  return cacheService.cacheWithFallback(key, fn, ttlSec);
}

// Export for use in other modules
export default cacheService; 