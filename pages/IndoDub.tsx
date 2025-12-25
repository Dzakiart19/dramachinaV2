
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
    <div className="container mx-auto px-4 md:px-10 py-12">
      <div className="mb-12 border-l-4 border-red-600 pl-4">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
          Indo <span className="text-gray-400 font-light">Dub</span>
        </h1>
        <p className="text-gray-500 font-medium">Drama dengan sulih suara Indonesia terbaik • {allDramas.length} Judul</p>
      </div>

      {displayedDramas.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {displayedDramas.map((drama) => (
              <MovieCard key={drama.bookId} drama={drama} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-16 mb-12">
            <button 
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white p-3 rounded-full transition-all"
            >
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <div className="flex gap-2">
                <span className="text-white font-bold">{page}</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-600">{totalPages}</span>
            </div>
            <button 
              onClick={() => changePage(page + 1)}
              disabled={page >= totalPages}
              className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white p-3 rounded-full transition-all"
            >
              <ChevronRight size={24} />
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
