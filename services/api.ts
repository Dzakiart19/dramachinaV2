
import { Drama, Episode, VIPResponse } from '../types';

/**
 * Multi-proxy fallback system to handle 403 blocks or rate limits.
 * We rotate through different services to ensure the app stays functional.
 * Proxy order matters for reliability with certain datasets.
 */
const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
];

const TARGET_BASE_URL = 'https://dramabox.sansekai.my.id/api';

// Cache to avoid repeated slow fetches in a single session
const apiCache = new Map<string, {data: any, timestamp: number}>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const fetchWithProxy = async (path: string) => {
    const targetUrl = `${TARGET_BASE_URL}${path}`;
    
    // Return cached data if available and fresh
    if (apiCache.has(path)) {
      const cached = apiCache.get(path)!;
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }
    }

    // Use a single, reliable proxy that handles CORS and retries better
    const PROXY_URL = 'https://api.allorigins.win/raw?url=';
    const controller = new AbortController();
    
    const fetchPromises = [
      // 1. Direct fetch
      fetch(targetUrl, { signal: controller.signal, headers: { 'Accept': 'application/json' } }).then(async r => {
        if (!r.ok) throw new Error('Direct failed');
        const text = await r.text();
        try { return JSON.parse(text); } catch (e) { throw new Error('Invalid JSON direct'); }
      }),
      // 2. AllOrigins
      fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`, { signal: controller.signal }).then(async r => {
        if (!r.ok) throw new Error('Proxy 1 failed');
        const d = await r.json();
        return JSON.parse(d.contents);
      }),
      // 3. CorsProxy.io
      fetch(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`, { signal: controller.signal }).then(async r => {
        if (!r.ok) throw new Error('Proxy 2 failed');
        const text = await r.text();
        return JSON.parse(text);
      })
    ];

    try {
      const data = await Promise.any(fetchPromises);
      controller.abort();
      apiCache.set(path, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      // Final sequential fallback
      for (const getProxiedUrl of PROXIES.slice(2)) {
        try {
          const res = await fetch(getProxiedUrl(targetUrl));
          if (res.ok) {
            const data = await res.json();
            apiCache.set(path, { data, timestamp: Date.now() });
            return data;
          }
        } catch (e) { continue; }
      }
      throw new Error('All connection attempts failed');
    }
  };

export const apiService = {
  async getVIPDramas(): Promise<VIPResponse> {
    return fetchWithProxy('/dramabox/vip');
  },

  async getLatestDramas(page: number = 1): Promise<Drama[]> {
    return fetchWithProxy(`/dramabox/latest?page=${page}`);
  },

  async getTrendingDramas(): Promise<Drama[]> {
    return fetchWithProxy(`/dramabox/trending`);
  },

  async getIndoDubDramas(classify: 'terpopuler' | 'terbaru' = 'terbaru', page: number = 1): Promise<Drama[]> {
    return fetchWithProxy(`/dramabox/dubindo?classify=${classify}&page=${page}`);
  },

  async searchDramas(query: string, page: number = 1): Promise<Drama[]> {
    return fetchWithProxy(`/dramabox/search?query=${encodeURIComponent(query)}&page=${page}`);
  },

  async getDramaDetail(bookId: string): Promise<{ data: { book: Drama } }> {
    return fetchWithProxy(`/dramabox/detail?bookId=${bookId}`);
  },

  async getAllEpisodes(bookId: string): Promise<Episode[]> {
    return fetchWithProxy(`/dramabox/allepisode?bookId=${bookId}`);
  },

  async getForYouDramas(): Promise<Drama[]> {
    return fetchWithProxy('/dramabox/foryou');
  },

  async getPopularSearch(): Promise<string[]> {
    try {
      const data = await fetchWithProxy('/dramabox/populersearch');
      if (!Array.isArray(data)) return [];
      
      // Extract bookName from Drama objects or use string directly
      return data
        .map((item: any) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object' && item.bookName) return item.bookName;
          return null;
        })
        .filter((name): name is string => name !== null && name.trim().length > 0);
    } catch (e) {
      console.warn('Popular search fetch failed', e);
      return [];
    }
  }
};
