type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
};

const globalForCache = globalThis as unknown as {
  appCacheStore: Map<string, CacheEntry<any>> | undefined;
};

const cacheStore = globalForCache.appCacheStore ?? new Map<string, CacheEntry<any>>();
if (process.env.NODE_ENV !== "production") {
  globalForCache.appCacheStore = cacheStore;
}

/**
 * Retrieves data from cache or computes it using fetcher.
 * Supports stale-while-revalidate: if stale data exists, returns it immediately
 * and revalidates in the background so user requests are never blocked by slow network/db queries.
 */
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  const now = Date.now();
  const existing = cacheStore.get(key);

  if (existing && now - existing.timestamp < existing.ttl) {
    return existing.data as T;
  }

  // Stale-while-revalidate: return stale data instantly and refresh in background
  if (existing) {
    fetcher()
      .then((fresh) => {
        cacheStore.set(key, { data: fresh, timestamp: Date.now(), ttl: ttlSeconds * 1000 });
      })
      .catch((err) => {
        console.error(`[Cache] Background revalidation failed for ${key}:`, err);
      });
    return existing.data as T;
  }

  // Cold cache: fetch synchronously and populate
  try {
    const fresh = await fetcher();
    cacheStore.set(key, { data: fresh, timestamp: Date.now(), ttl: ttlSeconds * 1000 });
    return fresh;
  } catch (error) {
    console.error(`[Cache] Fetch failed for ${key}:`, error);
    throw error;
  }
}

/**
 * Invalidates cache entries matching the given prefix, or all entries if no prefix given.
 */
export function invalidateCache(prefix?: string) {
  if (!prefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}
