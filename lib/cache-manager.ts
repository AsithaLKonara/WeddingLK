// Advanced caching system for performance optimization
export interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
  accessCount: number
}

export class CacheManager {
  private static instance: CacheManager
  private cache: Map<string, CacheItem<any>> = new Map()
  private maxSize: number = 1000
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutes

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  // Set cache item
  set<T>(key: string, data: T, ttl?: number): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      accessCount: 0
    })
  }

  // Get cache item
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    // Update access count
    item.accessCount++
    
    return item.data
  }

  // Get or set cache item
  async getOrSet<T>(
    key: string,
    fetchFunc: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetchFunc()
    this.set(key, data, ttl)
    return data
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) {
      return false
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Delete cache item
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }

  // Get cache statistics
  getStats(): {
    size: number
    maxSize: number
    hitRate: number
    totalAccesses: number
  } {
    let totalAccesses = 0
    for (const item of this.cache.values()) {
      totalAccesses += item.accessCount
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalAccesses > 0 ? totalAccesses / this.cache.size : 0,
      totalAccesses
    }
  }

  // Evict oldest items (LRU)
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, item] of this.cache) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Set cache size limit
  setMaxSize(size: number): void {
    this.maxSize = size
    while (this.cache.size > this.maxSize) {
      this.evictOldest()
    }
  }

  // Set default TTL
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance()

// Utility functions for common caching patterns
export const cacheUtils = {
  // Cache API responses
  async cacheApiResponse<T>(
    key: string,
    fetchFunc: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    return cacheManager.getOrSet(key, fetchFunc, ttl)
  },

  // Cache with user-specific keys
  getUserCacheKey(userId: string, key: string): string {
    return `user:${userId}:${key}`
  },

  // Cache with expiration
  setWithExpiration<T>(key: string, data: T, expirationMinutes: number): void {
    cacheManager.set(key, data, expirationMinutes * 60 * 1000)
  },

  // Invalidate user cache
  invalidateUserCache(userId: string): void {
    const keysToDelete: string[] = []
    for (const key of cacheManager['cache'].keys()) {
      if (key.startsWith(`user:${userId}:`)) {
        keysToDelete.push(key)
      }
    }
    keysToDelete.forEach(key => cacheManager.delete(key))
  }
} 