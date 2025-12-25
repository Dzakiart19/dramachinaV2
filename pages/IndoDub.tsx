
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { AlertCircle, RefreshCcw, ChevronRight, LayoutDashboard } from 'lucide-react';

const IndoDub: React.FC = () => {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadIndoDub = async (p: number = 1) => {
    setLoading(true);
    setError(null);
    setPage(p);
    try {
      const data = await apiService.getIndoDubDramas('terpopuler', p);
      setDramas(Array.isArray(data) ? data : []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to load indo dub:', err);
      setError('Gagal memuat drama sulih suara Indonesia. Silakan coba lagi.');
      setDramas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndoDub(1);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-950 p-6 overflow-hidden">
        <div className="relative group scale-110 md:scale-125 mb-16">
          <div className="absolute inset-[-40px] bg-orange-600/20 blur-[60px] rounded-full animate-pulse"></div>
          <div className="absolute inset-[-20px] bg-amber-600/10 blur-[40px] rounded-full animate-pulse delay-700"></div>
          
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-[3px] border-t-orange-500 border-r-amber-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border border-orange-500/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
            
            <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5">
               <LayoutDashboard className="text-orange-500 animate-pulse" size={24} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-sm w-full">
           <div className="space-y-1 text-center">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Menyiapkan Dubbing...
              </h2>
              <div className="flex justify-center gap-1.5 py-2">
                 {[0, 1, 2].map((i) => (
                   <div key={i} className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
                 ))}
              </div>
           </div>
           
           <div className="relative w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 to-amber-600 w-full -translate-x-[100%] animate-[progress_3s_ease-in-out_infinite]"></div>
           </div>
           <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] animate-pulse">Bahasa Indonesia</p>
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={loadIndoDub}
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
          Drama <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Sulih Suara</span>
        </h1>
        <p className="text-slate-400">Drama dengan versi sulih suara Indonesia berkualitas tinggi</p>
      </div>

      {dramas.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {dramas.map((drama) => (
              <MovieCard key={drama.bookId} drama={drama} />
            ))}
          </div>

          {/* Numerical Pagination */}
          <div className="flex items-center justify-center gap-2 mt-16 pb-12">
            <button 
              onClick={() => loadIndoDub(page - 1)}
              disabled={page === 1}
              className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-600 transition-all"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
            
            {[page - 1, page, page + 1].map(p => {
              if (p < 1) return null;
              return (
                <button
                  key={p}
                  onClick={() => loadIndoDub(p)}
                  className={`w-14 h-14 rounded-2xl font-black transition-all ${
                    page === p 
                    ? 'bg-orange-600 text-white shadow-2xl shadow-orange-600/40' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button 
              onClick={() => loadIndoDub(page + 1)}
              className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white hover:bg-orange-600 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">Belum ada drama sulih suara</p>
        </div>
      )}
    </div>
  );
};

export default IndoDub;
