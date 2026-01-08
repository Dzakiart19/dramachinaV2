
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { AlertCircle, RefreshCcw, LayoutDashboard, ChevronRight, TrendingUp } from 'lucide-react';
import { Skeleton, MovieCardSkeleton } from '../components/Skeleton';

const Trending: React.FC = () => {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  const changePage = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    // Instant scroll without delay
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const loadTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      // Trending API returns all trending data in one request
      const data = await apiService.getTrendingDramas().catch(() => []);
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Tidak ada data ditemukan');
      }
      
      // Remove duplicates by bookId
      const dramatMap = new Map<string, Drama>();
      data.forEach(d => dramatMap.set(d.bookId, d));
      const uniqueDramas = Array.from(dramatMap.values());
      setDramas(uniqueDramas);
      setPage(1);
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
      <div className="container mx-auto px-4 md:px-16 py-20 bg-black min-h-screen">
        <div className="mb-20 space-y-4">
          <Skeleton className="h-1 w-12" />
          <Skeleton className="h-16 w-1/2" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-red-600 mb-4" />
        <p className="text-gray-400 mb-6 font-medium">{error}</p>
        <button 
          onClick={loadTrending}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-bold transition-all shadow-lg active:scale-95"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(dramas.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedDramas = dramas.slice(startIdx, endIdx).filter(d => d && d.bookId);

  return (
    <div className="container mx-auto px-4 md:px-16 py-20 relative z-10">
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-red-600 rounded-full"></div>
          <span className="text-red-600 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Now Trending</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
          POPULAR <span className="text-zinc-700">STREAMS</span>
        </h1>
        <div className="flex items-center gap-6">
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
             <TrendingUp size={14} className="text-red-600" />
             {dramas.length} TITLES TRENDING
           </p>
           <div className="h-4 w-[1px] bg-zinc-800"></div>
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">TOP RATED CONTENT</p>
        </div>
      </div>

      {displayedDramas.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12 mb-24 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {displayedDramas.map((drama) => (
              <MovieCard key={drama.bookId} drama={drama} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-8 mt-20 pt-10 border-t border-zinc-900/50">
              <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className="group relative flex items-center justify-center bg-[#141414] hover:bg-red-600 disabled:opacity-20 text-white w-14 h-14 rounded-full transition-all duration-500 border border-zinc-800 hover:border-red-500 disabled:cursor-not-allowed active:scale-90"
              >
                <ChevronRight size={24} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-4 bg-[#141414] px-8 py-3 rounded-full border border-zinc-800 shadow-2xl">
                <span className="text-white font-black text-lg tracking-tighter">{page.toString().padStart(2, '0')}</span>
                <div className="h-6 w-[1px] bg-zinc-800"></div>
                <span className="text-zinc-600 font-black text-lg tracking-tighter">{totalPages.toString().padStart(2, '0')}</span>
              </div>

              <button
                onClick={() => changePage(page + 1)}
                disabled={page >= totalPages}
                className="group relative flex items-center justify-center bg-[#141414] hover:bg-red-600 disabled:opacity-20 text-white w-14 h-14 rounded-full transition-all duration-500 border border-zinc-800 hover:border-red-500 disabled:cursor-not-allowed active:scale-90"
              >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-40">
          <p className="text-zinc-600 text-xl font-medium">Belum ada konten tersedia</p>
        </div>
      )}
    </div>
  );
};

export default Trending;
