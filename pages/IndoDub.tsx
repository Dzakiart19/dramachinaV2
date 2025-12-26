
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { Loader2, AlertCircle, RefreshCcw, ChevronRight, LayoutDashboard } from 'lucide-react';

const IndoDub: React.FC = () => {
  const [allDramas, setAllDramas] = useState<Drama[]>([]);
  const [displayedDramas, setDisplayedDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const loadAllIndoDub = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load both categories in parallel (3 pages each)
      const terpopulerPromises = Array.from({ length: 3 }, (_, i) => 
        apiService.getIndoDubDramas('terpopuler', i + 1).catch(() => [])
      );
      const terbaruPromises = Array.from({ length: 3 }, (_, i) => 
        apiService.getIndoDubDramas('terbaru', i + 1).catch(() => [])
      );
      
      const [terpopulerResults, terbaruResults] = await Promise.all([
        Promise.all(terpopulerPromises),
        Promise.all(terbaruPromises)
      ]);
      
      const allData = [...terpopulerResults.flat(), ...terbaruResults.flat()];

      // Remove duplicates by bookId
      const dramaMap = new Map<string, Drama>();
      allData.forEach(d => dramaMap.set(d.bookId, d));
      const uniqueDramas = Array.from(dramaMap.values());
      
      setAllDramas(uniqueDramas);
      setPage(1);
      setDisplayedDramas(uniqueDramas.slice(0, itemsPerPage));
      
      if (uniqueDramas.length === 0) {
        throw new Error('Tidak ada data ditemukan');
      }
    } catch (err) {
      console.error('Failed to load indo dub:', err);
      setError('Gagal memuat drama sulih suara Indonesia. Silakan coba lagi.');
      setAllDramas([]);
      setDisplayedDramas([]);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (p: number) => {
    if (p < 1 || (p - 1) * itemsPerPage >= allDramas.length) return;
    setPage(p);
    const start = (p - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setDisplayedDramas(allDramas.slice(start, end));
    // Instant scroll without delay
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  useEffect(() => {
    loadAllIndoDub();
  }, []);

  if (loading && allDramas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-black">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
        <p className="mt-6 text-red-600 font-bold tracking-[0.3em] uppercase animate-pulse">DZECK STREAM</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-red-600 mb-4" />
        <p className="text-gray-400 mb-6 font-medium">{error}</p>
        <button 
          onClick={loadAllIndoDub}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-bold transition-all shadow-lg active:scale-95"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(allDramas.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 md:px-16 py-20 relative z-10">
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-red-600 rounded-full"></div>
          <span className="text-red-600 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Local Voice</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
          INDO <span className="text-zinc-700">DUBBED</span>
        </h1>
        <div className="flex items-center gap-6">
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
             <LayoutDashboard size={14} className="text-red-600" />
             {allDramas.length} DUBS AVAILABLE
           </p>
           <div className="h-4 w-[1px] bg-zinc-800"></div>
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">LOCALIZED EXPERIENCE</p>
        </div>
      </div>

      {displayedDramas.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {displayedDramas.map((drama) => (
              <MovieCard key={drama.bookId} drama={drama} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-24 pt-10 border-t border-zinc-900/50">
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
        </>
      ) : (
        <div className="text-center py-40">
          <p className="text-zinc-600 text-xl font-medium">Belum ada konten tersedia</p>
        </div>
      )}
    </div>
  );
};

export default IndoDub;
