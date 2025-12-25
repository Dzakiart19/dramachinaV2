
import { Drama, Episode, VIPResponse } from '../types';

/**
 * Multi-proxy fallback system to handle 403 blocks or rate limits.
 * We rotate through different services to ensure the app stays functional.
 */
const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

const TARGET_BASE_URL = 'https://dramabox.sansekai.my.id/api';

const fetchWithProxy = async (path: string) => {
  const targetUrl = `${TARGET_BASE_URL}${path}`;
  let lastError: any = null;

  // Try each proxy in order until one works
  for (const getProxiedUrl of PROXIES) {
    const proxiedUrl = getProxiedUrl(targetUrl);
    
    try {
      const res = await fetch(proxiedUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!res.ok) {
        throw new Error(`Proxy returned status ${res.status}`);
      }

      const data = await res.json();
      
      // Basic validation that we got actual data and not an error page/HTML
      if (typeof data !== 'object' || data === null) {
        throw new Error('Invalid JSON response');
      }

      return data;
    } catch (error) {
      console.warn(`Proxy failed: ${proxiedUrl.split('?')[0]}`, error);
      lastError = error;
      continue; // Try next proxy
    }
  }

  console.error(`All proxies failed for ${path}. Last error:`, lastError);
  throw lastError || new Error('All connection attempts failed');
};

export const apiService = {
  async getVIPDramas(): Promise<VIPResponse> {
    return fetchWithProxy('/dramabox/vip');
  },

  async getLatestDramas(): Promise<Drama[]> {
    return fetchWithProxy('/dramabox/latest');
  },

  async getTrendingDramas(): Promise<Drama[]> {
    return fetchWithProxy('/dramabox/trending');
  },

  async getIndoDubDramas(classify: 'terpopuler' | 'terbaru' = 'terbaru', page: number = 1): Promise<Drama[]> {
    return fetchWithProxy(`/dramabox/dubindo?classify=${classify}&page=${page}`);
  },

  async searchDramas(query: string): Promise<Drama[]> {
    return fetchWithProxy(`/dramabox/search?query=${encodeURIComponent(query)}`);
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
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('Popular search fetch failed', e);
      return [];
    }
  }
};
