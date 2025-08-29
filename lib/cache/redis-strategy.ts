import Redis from 'ioredis';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  ttl: number;
  maxRetries: number;
  retryDelay: number;
}

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

export class RedisCacheStrategy {
  private redis: Redis;
  private config: CacheConfig;
  private version: string = '1.0.0';

  constructor(config: CacheConfig) {
    this.config = config;
    this.redis = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
      keyPrefix: config.keyPrefix,
      maxRetriesPerRequest: config.maxRetries,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 5000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    this.redis.on('error', error => {
      console.error('❌ Redis connection error:', error);
    });

    this.redis.on('ready', () => {
      console.log('🚀 Redis ready for operations');
    });

    this.redis.on('close', () => {
      console.log('🔌 Redis connection closed');
    });
  }

  // Session storage
  async storeSession(
    sessionId: string,
    sessionData: any,
    ttl: number = 3600
  ): Promise<void> {
    try {
      const key = `session:${sessionId}`;
      const item: CacheItem = {
        data: sessionData,
        timestamp: Date.now(),
        ttl: ttl,
        version: this.version,
      };

      await this.redis.setex(key, ttl, JSON.stringify(item));
      console.log(`💾 Session stored: ${sessionId}`);
    } catch (error) {
      console.error('❌ Error storing session:', error);
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<any | null> {
    try {
      const key = `session:${sessionId}`;
      const data = await this.redis.get(key);

      if (!data) return null;

      const item: CacheItem = JSON.parse(data);

      // Check if expired
      if (Date.now() - item.timestamp > item.ttl * 1000) {
        await this.redis.del(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('❌ Error retrieving session:', error);
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const key = `session:${sessionId}`;
      await this.redis.del(key);
      console.log(`🗑️  Session deleted: ${sessionId}`);
    } catch (error) {
      console.error('❌ Error deleting session:', error);
    }
  }

  // Frequently queried data caching
  async cacheVenueData(
    venueId: string,
    venueData: any,
    ttl: number = 1800
  ): Promise<void> {
    try {
      const key = `venue:${venueId}`;
      const item: CacheItem = {
        data: venueData,
        timestamp: Date.now(),
        ttl: ttl,
        version: this.version,
      };

      await this.redis.setex(key, ttl, JSON.stringify(item));
      console.log(`💾 Venue cached: ${venueId}`);
    } catch (error) {
      console.error('❌ Error caching venue:', error);
    }
  }

  async getCachedVenue(venueId: string): Promise<any | null> {
    try {
      const key = `venue:${venueId}`;
      const data = await this.redis.get(key);

      if (!data) return null;

      const item: CacheItem = JSON.parse(data);

      // Check if expired
      if (Date.now() - item.timestamp > item.ttl * 1000) {
        await this.redis.del(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('❌ Error retrieving cached venue:', error);
      return null;
    }
  }

  // Search results caching
  async cacheSearchResults(
    searchKey: string,
    results: any[],
    ttl: number = 900
  ): Promise<void> {
    try {
      const key = `search:${this.hashString(searchKey)}`;
      const item: CacheItem = {
        data: results,
        timestamp: Date.now(),
        ttl: ttl,
        version: this.version,
      };

      await this.redis.setex(key, ttl, JSON.stringify(item));
      console.log(`💾 Search results cached: ${searchKey}`);
    } catch (error) {
      console.error('❌ Error caching search results:', error);
    }
  }

  async getCachedSearchResults(searchKey: string): Promise<any[] | null> {
    try {
      const key = `search:${this.hashString(searchKey)}`;
      const data = await this.redis.get(key);

      if (!data) return null;

      const item: CacheItem = JSON.parse(data);

      // Check if expired
      if (Date.now() - item.timestamp > item.ttl * 1000) {
        await this.redis.del(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('❌ Error retrieving cached search results:', error);
      return null;
    }
  }

  // AI recommendations caching
  async cacheRecommendations(
    userId: string,
    recommendations: any[],
    ttl: number = 3600
  ): Promise<void> {
    try {
      const key = `recommendations:${userId}`;
      const item: CacheItem = {
        data: recommendations,
        timestamp: Date.now(),
        ttl: ttl,
        version: this.version,
      };

      await this.redis.setex(key, ttl, JSON.stringify(item));
      console.log(`💾 Recommendations cached: ${userId}`);
    } catch (error) {
      console.error('❌ Error caching recommendations:', error);
    }
  }

  async getCachedRecommendations(userId: string): Promise<any[] | null> {
    try {
      const key = `recommendations:${userId}`;
      const data = await this.redis.get(key);

      if (!data) return null;

      const item: CacheItem = JSON.parse(data);

      // Check if expired
      if (Date.now() - item.timestamp > item.ttl * 1000) {
        await this.redis.del(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('❌ Error retrieving cached recommendations:', error);
      return null;
    }
  }

  // Social feed caching
  async cacheFeedData(
    feedType: string,
    data: any[],
    ttl: number = 300
  ): Promise<void> {
    try {
      const key = `feed:${feedType}`;
      const item: CacheItem = {
        data: data,
        timestamp: Date.now(),
        ttl: ttl,
        version: this.version,
      };

      await this.redis.setex(key, ttl, JSON.stringify(item));
      console.log(`💾 Feed cached: ${feedType}`);
    } catch (error) {
      console.error('❌ Error caching feed:', error);
    }
  }

  async getCachedFeed(feedType: string): Promise<any[] | null> {
    try {
      const key = `feed:${feedType}`;
      const data = await this.redis.get(key);

      if (!data) return null;

      const item: CacheItem = JSON.parse(data);

      // Check if expired
      if (Date.now() - item.timestamp > item.ttl * 1000) {
        await this.redis.del(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('❌ Error retrieving cached feed:', error);
      return null;
    }
  }

  // Cache invalidation
  async invalidateCache(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        console.log(`🗑️  Invalidated ${keys.length} cache keys: ${pattern}`);
      }
    } catch (error) {
      console.error('❌ Error invalidating cache:', error);
    }
  }

  async invalidateUserCache(userId: string): Promise<void> {
    try {
      const patterns = [
        `session:${userId}`,
        `recommendations:${userId}`,
        `user:${userId}:*`,
        `bookings:user:${userId}`,
      ];

      for (const pattern of patterns) {
        await this.invalidateCache(pattern);
      }
    } catch (error) {
      console.error('❌ Error invalidating user cache:', error);
    }
  }

  async invalidateVenueCache(venueId: string): Promise<void> {
    try {
      const patterns = [
        `venue:${venueId}`,
        `search:*`,
        `feed:*`,
        `recommendations:*`,
      ];

      for (const pattern of patterns) {
        await this.invalidateCache(pattern);
      }
    } catch (error) {
      console.error('❌ Error invalidating venue cache:', error);
    }
  }

  // Cache statistics and monitoring
  async getCacheStats(): Promise<any> {
    try {
      const info = await this.redis.info();
      const memory = await this.redis.memory('USAGE', '');
      const keyspace = await this.redis.info('keyspace');

      return {
        info: this.parseRedisInfo(info),
        memory: this.parseMemoryUsage(memory || ''),
        keyspace: this.parseKeyspaceInfo(keyspace),
        version: this.version,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('❌ Error getting cache stats:', error);
      return null;
    }
  }

  private parseRedisInfo(info: string): any {
    const lines = info.split('\r\n');
    const parsed: any = {};

    lines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        parsed[key] = value;
      }
    });

    return parsed;
  }

  private parseMemoryUsage(memory: string | number | null): any {
    return { usage: memory || 'N/A' };
  }

  private parseKeyspaceInfo(keyspace: string): any {
    const lines = keyspace.split('\r\n');
    const parsed: any = {};

    lines.forEach(line => {
      if (line.startsWith('db')) {
        const [db, stats] = line.split(':');
        parsed[db] = stats;
      }
    });

    return parsed;
  }

  // Utility methods
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      console.error('❌ Redis health check failed:', error);
      return false;
    }
  }

  // Cleanup
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
      console.log('🔌 Redis disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting Redis:', error);
    }
  }
}

// Default configuration
const defaultConfig: CacheConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  keyPrefix: 'weddinglk:',
  ttl: 3600,
  maxRetries: 3,
  retryDelay: 1000,
};

// Export singleton instance
export const redisCache = new RedisCacheStrategy(defaultConfig);
