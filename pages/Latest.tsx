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

  if (loading) {
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
    <div className="container mx-auto px-4 md:px-10 py-12">
      <div className="mb-12 border-l-4 border-red-600 pl-4">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
          Latest <span className="text-gray-400 font-light">Releases</span>
        </h1>
        <p className="text-gray-500 font-medium">Drama terbaru yang baru saja rilis • {latest.length} Judul</p>
      </div>

      {displayedDramas.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-16">
            {displayedDramas.map((drama) => (
              <MovieCard key={drama.bookId} drama={drama} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
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

export default Latest;
