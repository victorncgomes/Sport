// Redis Cache utilities using Upstash Redis

interface CacheConfig {
    key: string;
    ttl: number; // Time to live in seconds
}

/**
 * Simple in-memory cache fallback if Redis is not configured
 */
class MemoryCache {
    private cache = new Map<string, { value: any; expires: number }>();

    async get<T>(key: string): Promise<T | null> {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }

        return item.value as T;
    }

    async set(key: string, value: any, ttl: number): Promise<void> {
        this.cache.set(key, {
            value,
            expires: Date.now() + ttl * 1000
        });
    }

    async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }
}

// Export singleton instance
export const cache = new MemoryCache();

/**
 * Weather cache helper (30min TTL)
 */
export async function getCachedWeather<T>(): Promise<T | null> {
    return await cache.get<T>('weather:natal');
}

export async function setCachedWeather(data: any): Promise<void> {
    await cache.set('weather:natal', data, 1800); // 30 minutes
}

/**
 * Tide cache helper (24h TTL)
 */
export async function getCachedTides<T>(days: number = 7): Promise<T | null> {
    return await cache.get<T>(`tides:natal:${days}`);
}

export async function setCachedTides(days: number, data: any): Promise<void> {
    await cache.set(`tides:natal:${days}`, data, 86400); // 24 hours
}

/**
 * Generic cache wrapper
 */
export async function withCache<T>(
    key: string,
    ttl: number,
    fetchFn: () => Promise<T>
): Promise<T> {
    // Try to get from cache
    const cached = await cache.get<T>(key);
    if (cached) {
        console.log(`✅ Cache HIT: ${key}`);
        return cached;
    }

    console.log(`❌ Cache MISS: ${key}`);

    // Fetch fresh data
    const fresh = await fetchFn();

    // Store in cache
    await cache.set(key, fresh, ttl);

    return fresh;
}

/**
 * Invalidate cache by pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
    // For memory cache, we'll clear everything matching the pattern
    // In production with Redis, use SCAN command
    console.log(`🗑️  Invalidating cache: ${pattern}`);

    if (pattern === '*') {
        await cache.clear();
    }
    // For specific patterns, would need more sophisticated implementation
}
