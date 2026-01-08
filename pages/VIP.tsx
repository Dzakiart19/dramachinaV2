import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama, VIPResponse } from '../types';
import MovieCard from '../components/MovieCard';
import { AlertCircle, RefreshCcw, LayoutDashboard, ChevronRight } from 'lucide-react';
import { PageLoading, Skeleton, MovieCardSkeleton } from '../components/Skeleton';

const VIP: React.FC = () => {
  const [vipData, setVipData] = useState<VIPResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const changePage = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    // Instant scroll without delay
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const loadVIP = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getVIPDramas();
      
      if (!data || !data.columnVoList || data.columnVoList.length === 0) {
        throw new Error('Tidak ada data VIP ditemukan');
      }

      setVipData(data);
      setSelectedCategory(0);
      setPage(1);
    } catch (err) {
      console.error('Failed to load VIP:', err);
      setError('Gagal memuat drama VIP. Silakan coba lagi.');
      setVipData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVIP();
  }, []);

  if (loading && !vipData) {
    return (
      <div className="container mx-auto px-4 md:px-16 py-20 bg-black min-h-screen">
        <div className="mb-16 space-y-4">
          <Skeleton className="h-1 w-12" />
          <Skeleton className="h-12 w-1/3" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !vipData) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-red-600 mb-4" />
        <p className="text-gray-400 mb-6 font-medium">{error || 'Tidak ada data VIP'}</p>
        <button 
          onClick={() => loadVIP()}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-bold transition-all shadow-lg active:scale-95"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const column = vipData.columnVoList[selectedCategory];
  const allDramas = column?.bookList || [];
  const totalPages = Math.ceil(allDramas.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedDramas = allDramas.slice(startIdx, endIdx).filter(d => d && d.bookId);

  return (
    <div className="container mx-auto px-4 md:px-16 py-20 relative z-10">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-red-600 rounded-full"></div>
          <span className="text-red-600 text-xs font-black uppercase tracking-[0.5em] animate-pulse">VIP Exclusive</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-8 drop-shadow-2xl">
          PREMIUM <span className="text-zinc-700">COLLECTION</span>
        </h1>
        
        {vipData.columnVoList.length > 1 && (
          <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar border-b border-zinc-900/50">
            {vipData.columnVoList.map((col, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedCategory(idx);
                  setPage(1);
                }}
                className={`px-8 py-3 rounded-md font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 border relative overflow-hidden group ${
                  selectedCategory === idx
                    ? 'bg-red-600 border-red-600 text-white shadow-[0_10px_30px_rgba(220,38,38,0.3)]'
                    : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:border-zinc-600 hover:text-white'
                }`}
              >
                <span className="relative z-10">{col.title}</span>
                {selectedCategory === idx && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                )}
              </button>
            ))}
          </div>
        )}
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

export default VIP;
