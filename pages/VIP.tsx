import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama, VIPResponse } from '../types';
import MovieCard from '../components/MovieCard';
import { AlertCircle, RefreshCcw, LayoutDashboard, ChevronRight } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-black">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
        <p className="mt-6 text-red-600 font-bold tracking-[0.3em] uppercase animate-pulse">DZECK STREAM</p>
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
    <div className="container mx-auto px-4 md:px-10 py-12">
      <div className="mb-12 border-l-4 border-red-600 pl-4">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
          Exclusive <span className="text-red-600">VIP</span>
        </h1>
        <p className="text-gray-500 font-medium">Konten premium pilihan editor • {allDramas.length} Judul</p>
      </div>

      {vipData.columnVoList.length > 1 && (
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {vipData.columnVoList.map((col, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedCategory(idx);
                setPage(1);
              }}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === idx
                  ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500'
              }`}
            >
              {col.title}
            </button>
          ))}
        </div>
      )}

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

export default VIP;
