
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { Loader2, AlertCircle, RefreshCcw, ChevronRight } from 'lucide-react';

const Trending: React.FC = () => {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await apiService.getTrendingDramas(nextPage);
      if (data && Array.isArray(data) && data.length > 0) {
        setDramas(prev => [...prev, ...data]);
        setPage(nextPage);
        if (data.length < 10) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error('Load more error:', e);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadTrending = async () => {
    setLoading(true);
    setPage(1);
    setHasMore(true);
    setError(null);
    try {
      const data = await apiService.getTrendingDramas(1);
      setDramas(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length < 10) setHasMore(false);
    } catch (err) {
      console.error('Failed to load trending:', err);
      setError('Gagal memuat drama trending. Silakan coba lagi.');
      setDramas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Loader2 className="animate-spin text-blue-500" size={56} />
        <p className="text-slate-400 font-medium">Tunggu sebentar maaf agak lama karena pakai gratisan 😅</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={loadTrending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all"
        >
          <RefreshCcw size={20} />
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
          Drama <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Trending</span>
        </h1>
        <p className="text-slate-400">Drama paling populer dan banyak ditonton minggu ini</p>
      </div>

      {dramas.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {dramas.map((drama, idx) => (
              <MovieCard key={`${drama.bookId}-${idx}`} drama={drama} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-12 pb-12">
              <button 
                onClick={loadMore}
                disabled={loadingMore}
                className="group relative flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-2xl font-black transition-all border border-slate-800 hover:border-red-500/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="animate-spin text-red-500" size={24} />
                    <span>MEMUAT...</span>
                  </>
                ) : (
                  <>
                    <span>TAMPILKAN LEBIH BANYAK</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">Belum ada data trending</p>
        </div>
      )}
    </div>
  );
};

export default Trending;
