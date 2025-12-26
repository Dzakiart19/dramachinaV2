import { Drama, Episode } from '../types';

export interface WatchHistoryItem {
  bookId: string;
  bookName: string;
  cover: string;
  episodeId: string;
  episodeName: string;
  timestamp: number;
}

const HISTORY_KEY = 'dzeck_watch_history';
const MAX_HISTORY = 10;

export const historyService = {
  saveProgress: (drama: Drama, episode: Episode) => {
    try {
      const history = historyService.getHistory();
      const newItem: WatchHistoryItem = {
        bookId: drama.bookId,
        bookName: drama.bookName,
        cover: drama.coverWap || drama.cover,
        episodeId: episode.chapterId,
        episodeName: episode.chapterName,
        timestamp: Date.now(),
      };

      // Remove existing entry for this drama if it exists
      const filteredHistory = history.filter(item => item.bookId !== drama.bookId);
      
      // Add to front and limit size
      const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY);
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save watch history:', e);
    }
  },

  getHistory: (): WatchHistoryItem[] => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get watch history:', e);
      return [];
    }
  },

  removeFromHistory: (bookId: string) => {
    try {
      const history = historyService.getHistory();
      const updatedHistory = history.filter(item => item.bookId !== bookId);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to remove from history:', e);
    }
  }
};
