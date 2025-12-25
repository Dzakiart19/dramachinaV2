import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCcw, LayoutDashboard, Search as SearchIcon, TrendingUp } from 'lucide-react';

const PopularSearch: React.FC = () => {
  const [searches, setSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadPopularSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getPopularSearch().catch(() => []);
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Tidak ada pencarian populer ditemukan');
      }

      setSearches(data);
    } catch (err) {
      console.error('Failed to load popular search:', err);
      setError('Gagal memuat pencarian populer. Silakan coba lagi.');
      setSearches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopularSearch();
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-950 p-6 overflow-hidden">
        <div className="relative group scale-110 md:scale-125 mb-16">
          <div className="absolute inset-[-40px] bg-green-600/20 blur-[60px] rounded-full animate-pulse"></div>
          <div className="absolute inset-[-20px] bg-emerald-600/10 blur-[40px] rounded-full animate-pulse delay-700"></div>
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-[3px] border-t-green-500 border-r-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border border-green-500/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5">
              <LayoutDashboard className="text-green-500 animate-pulse" size={24} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="space-y-1 text-center">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Memuat Tren...
            </h2>
            <div className="flex justify-center gap-1.5 py-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </div>
          
          <div className="relative w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-emerald-600 w-full -translate-x-[100%] animate-[progress_3s_ease-in-out_infinite]"></div>
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

  if (error || searches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-green-500 mb-4" />
        <p className="text-slate-400 mb-6">{error || 'Tidak ada pencarian populer ditemukan'}</p>
        <button 
          onClick={() => loadPopularSearch()}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl transition-colors"
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
          Pencarian <span className="text-green-500">Populer</span>
        </h1>
        <p className="text-slate-400">Temukan apa yang sedang trending sekarang</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searches.map((search, idx) => (
          <button
            key={idx}
            onClick={() => handleSearch(search)}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 hover:from-green-900/50 hover:to-emerald-900/50 transition-all duration-300 border border-slate-700 hover:border-green-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300"></div>
            
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0">
                <TrendingUp className="text-green-500 group-hover:scale-110 transition-transform duration-300" size={28} />
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-lg font-bold text-white group-hover:text-green-400 transition-colors truncate">
                  {search}
                </p>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  #{idx + 1} Trending
                </p>
              </div>
              
              <SearchIcon className="text-slate-400 group-hover:text-green-500 transition-colors flex-shrink-0" size={20} />
            </div>

            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 w-0 group-hover:w-full transition-all duration-300"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearch;
