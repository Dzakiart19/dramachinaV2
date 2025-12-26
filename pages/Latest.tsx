import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { ChevronRight, Loader2, AlertCircle, RefreshCcw, LayoutDashboard } from 'lucide-react';

const Latest: React.FC = () => {
  const [latest, setLatest] = useState<Drama[]>([]);
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

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load first 5 pages in parallel for instant display
      const promises = Array.from({ length: 5 }, (_, i) => 
        apiService.getLatestDramas(i + 1).catch(() => [])
      );
      
      const results = await Promise.all(promises);
      const allLatest: Drama[] = results.flat();

      // Remove duplicates by bookId
      const dramaMaps = new Map<string, Drama>();
      allLatest.forEach(d => dramaMaps.set(d.bookId, d));
      const uniqueDramas = Array.from(dramaMaps.values());
      
      setLatest(uniqueDramas);
      setPage(1);

      if (uniqueDramas.length === 0) {
        throw new Error('Tidak ada drama terbaru ditemukan.');
      }
    } catch (err) {
      console.error('Failed to load latest:', err);
      setError('Gagal memuat drama terbaru. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && latest.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-black">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
        <p className="mt-6 text-red-600 font-bold tracking-[0.3em] uppercase animate-pulse">DZECK STREAM</p>
      </div>
    );
  }

  if (error && latest.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-red-600 mb-4" />
        <p className="text-gray-400 mb-6 font-medium">{error}</p>
        <button 
          onClick={() => loadData()}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-bold transition-all shadow-lg active:scale-95"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(latest.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedDramas = latest.slice(startIdx, endIdx).filter(d => d && d.bookId);

  return (
    <div className="container mx-auto px-4 md:px-16 py-20 relative z-10">
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-red-600 rounded-full"></div>
          <span className="text-red-600 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Fresh Releases</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
          LATEST <span className="text-zinc-700">COLLECTION</span>
        </h1>
        <div className="flex items-center gap-6">
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
             <LayoutDashboard size={14} className="text-red-600" />
             {latest.length} TITLES AVAILABLE
           </p>
           <div className="h-4 w-[1px] bg-zinc-800"></div>
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">PREMIUM STREAMING</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12 mb-24 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {displayedDramas.map((drama) => (
          <MovieCard key={drama.bookId} drama={drama} />
        ))}
      </div>

      {/* Modern Pagination UI */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-20 pt-10 border-t border-zinc-900/50">
          <button
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
            className="group relative flex items-center justify-center bg-[#141414] hover:bg-red-600 disabled:opacity-20 text-white w-12 h-12 rounded-full transition-all duration-500 border border-zinc-800 hover:border-red-500 disabled:cursor-not-allowed active:scale-90"
          >
            <ChevronRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => changePage(p)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-black text-xs transition-all duration-500 flex items-center justify-center border ${
                  page === p 
                    ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-110' 
                    : 'bg-[#141414] border-zinc-800 text-zinc-500 hover:border-red-600/50 hover:text-white'
                }`}
              >
                {p.toString().padStart(2, '0')}
              </button>
            ))}
          </div>

          <button
            onClick={() => changePage(page + 1)}
            disabled={page >= totalPages}
            className="group relative flex items-center justify-center bg-[#141414] hover:bg-red-600 disabled:opacity-20 text-white w-12 h-12 rounded-full transition-all duration-500 border border-zinc-800 hover:border-red-500 disabled:cursor-not-allowed active:scale-90"
          >
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Latest;
