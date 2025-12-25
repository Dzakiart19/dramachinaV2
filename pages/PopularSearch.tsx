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
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-black">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
        <p className="mt-6 text-red-600 font-bold tracking-[0.3em] uppercase animate-pulse">DZECK STREAM</p>
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
    <div className="container mx-auto px-4 md:px-12 py-12 bg-black min-h-screen">
      <div className="mb-12 border-l-4 border-red-600 pl-4">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
          Popular <span className="text-zinc-600">Search</span>
        </h1>
        <p className="text-zinc-500 font-medium">Temukan apa yang sedang trending saat ini</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {searches.map((search, idx) => (
          <button
            key={`search-${idx}`}
            onClick={() => handleSearch(search)}
            className="group relative flex items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-300"
          >
            <div className="flex items-center gap-6">
              <span className="text-3xl font-black text-zinc-800 group-hover:text-red-600 transition-colors italic">
                {idx + 1}
              </span>
              <div className="text-left">
                <p className="text-lg font-bold text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">
                  {search}
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-500" size={12} />
                  <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Rising Search</span>
                </div>
              </div>
            </div>
            
            <SearchIcon className="text-zinc-700 group-hover:text-white transition-colors" size={20} />
            
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearch;
