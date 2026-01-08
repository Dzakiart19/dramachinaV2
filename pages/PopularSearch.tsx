import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Search as SearchIcon, TrendingUp } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';

const PopularSearch: React.FC = () => {
  const [searches, setSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadPopularSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getPopularSearch();
      
      if (!data || data.length === 0) {
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

  if (loading && searches.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-16 py-20 bg-black min-h-screen">
        <div className="mb-20 space-y-4">
          <Skeleton className="h-1 w-12" />
          <Skeleton className="h-16 w-1/2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || searches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center bg-black">
        <AlertCircle size={48} className="text-red-600 mb-4" />
        <p className="text-zinc-500 mb-6 font-medium uppercase tracking-widest">{error || 'Tidak ada pencarian populer ditemukan'}</p>
        <button 
          onClick={() => loadPopularSearch()}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-bold transition-all shadow-lg active:scale-95 uppercase tracking-widest"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-16 py-20 bg-black min-h-screen relative z-10">
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-red-600 rounded-full"></div>
          <span className="text-red-600 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Trending</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
          POPULAR <span className="text-zinc-700">TOPICS</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
          <TrendingUp size={14} className="text-red-600" />
          WHAT EVERYONE IS WATCHING RIGHT NOW
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        {searches.map((search, idx) => (
          <button
            key={`search-${idx}`}
            onClick={() => handleSearch(search)}
            className="group relative flex items-center justify-between p-8 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-zinc-800/50 rounded-xl hover:bg-[#141414] hover:border-red-600/30 transition-all duration-500 shadow-2xl overflow-hidden active:scale-95"
          >
            <div className="flex items-center gap-8 relative z-10">
              <span className="text-5xl font-black text-zinc-900 group-hover:text-red-600 transition-all duration-500 italic drop-shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                {(idx + 1).toString().padStart(2, '0')}
              </span>
              <div className="text-left">
                <p className="text-lg md:text-xl font-black text-zinc-100 group-hover:text-white transition-colors uppercase tracking-tighter leading-tight mb-2">
                  {search}
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Rising Search</span>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-800/50 p-3 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all duration-500 relative z-10">
              <SearchIcon className="text-zinc-600 group-hover:text-white" size={18} />
            </div>
            
            <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
              <TrendingUp size={120} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearch;
