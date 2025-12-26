
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
  (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
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

  let lastError: any = null;

  // Try top 3 proxies in parallel for speed, use the first successful one
  const controller = new AbortController();
  const promises = PROXIES.map(async (getProxiedUrl) => {
    const proxiedUrl = getProxiedUrl(targetUrl);
    try {
      const res = await fetch(proxiedUrl, {
        signal: controller.signal,
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Proxy error');
      const data = await res.json();
      if (typeof data !== 'object' || data === null) throw new Error('Invalid JSON');
      
      controller.abort(); // Cancel other requests once we have data
      apiCache.set(path, { data, timestamp: Date.now() });
      return data;
    } catch (e) {
      throw e;
    }
  });

  try {
    return await Promise.any(promises);
  } catch (error) {
    // Fallback to sequential if parallel fails (legacy behavior)
    console.warn('Parallel fetch failed, retrying sequentially...', error);
    for (const getProxiedUrl of PROXIES) {
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
