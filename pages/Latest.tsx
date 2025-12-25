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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allLatest: Drama[] = [];
      let p = 1;
      while (true) {
        const data = await apiService.getLatestDramas(p).catch(() => []);
        if (!Array.isArray(data) || data.length === 0) break;
        allLatest.push(...data);
        p++;
        if (allLatest.length > 300) break;
      }

      setLatest(allLatest);
      setPage(1);

      if (allLatest.length === 0) {
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
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-950 p-6 overflow-hidden">
        <div className="relative group scale-110 md:scale-125 mb-16">
          <div className="absolute inset-[-40px] bg-blue-600/20 blur-[60px] rounded-full animate-pulse"></div>
          <div className="absolute inset-[-20px] bg-indigo-600/10 blur-[40px] rounded-full animate-pulse delay-700"></div>
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-[3px] border-t-blue-500 border-r-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border border-blue-500/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5">
              <LayoutDashboard className="text-blue-500 animate-pulse" size={24} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="space-y-1 text-center">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Memuat Terbaru...
            </h2>
            <div className="flex justify-center gap-1.5 py-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </div>
          
          <div className="relative w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 w-full -translate-x-[100%] animate-[progress_3s_ease-in-out_infinite]"></div>
          </div>
          
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] animate-pulse">
            Sinkronisasi Server Utama
          </p>
        </div>

        <style>{`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  if (error && latest.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-blue-500 mb-4" />
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={() => loadData()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          <RefreshCcw size={20} />
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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
          Drama <span className="text-blue-500">Terbaru</span>
        </h1>
        <p className="text-slate-400">Total: {latest.length} drama terbaru</p>
      </div>

      {displayedDramas.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-12">
            {displayedDramas.map((drama) => (
              <MovieCard key={drama.bookId} drama={drama} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12 flex-wrap">
              <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                ← Sebelumnya
              </button>

              <div className="flex gap-2 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className={`font-bold py-2 px-4 rounded-lg transition-colors ${
                      p === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => changePage(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Selanjutnya <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">Tidak ada drama ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default Latest;
