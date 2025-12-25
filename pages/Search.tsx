
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { Search as SearchIcon, Loader2, TrendingUp, X, ChevronRight } from 'lucide-react';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Drama[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadPopularSearches();
  }, []);

  const loadPopularSearches = async () => {
    try {
      const pops = await apiService.getPopularSearch();
      setPopularSearches(Array.isArray(pops) ? pops : []);
    } catch (e) {
      console.error('Popular search error:', e);
      setPopularSearches([]);
    }
  };

  const handleSearch = async (searchQuery: string, p: number = 1) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    setLoading(true);
    setSearched(true);
    setPage(p);
    try {
      const targetUrl = `https://dramabox.sansekai.my.id/api/dramabox/search?query=${encodeURIComponent(trimmedQuery)}&page=${p}`;
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handlePopularClick = (tag: string) => {
    setQuery(tag);
    handleSearch(tag);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-black text-white text-center mb-8">
          Cari drama <span className="text-blue-500">favorit</span> Anda
        </h1>

        <form onSubmit={handleFormSubmit} className="relative">
          <input 
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari berdasarkan judul, penulis, atau kata kunci..."
            className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-5 px-6 pl-14 pr-32 text-white focus:outline-none focus:border-blue-500 transition-all text-lg shadow-xl"
          />
          
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={24} />
          
          {query && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors z-10"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
          
          <button 
            type="submit"
            disabled={!query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl transition-colors z-10"
          >
            Cari
          </button>
        </form>

        {!searched && popularSearches && popularSearches.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="text-slate-500 flex items-center gap-1 text-sm">
              <TrendingUp size={16} /> Populer:
            </span>
            {popularSearches.slice(0, 6).map((tag, i) => (
              <button
                key={`popular-${i}`}
                type="button"
                onClick={() => handlePopularClick(tag)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-full text-sm border border-slate-700 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="min-h-[40vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] bg-transparent p-6 overflow-hidden">
            <div className="relative group scale-75 md:scale-100 mb-12">
              <div className="absolute inset-[-40px] bg-blue-600/20 blur-[60px] rounded-full animate-pulse"></div>
              
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-[3px] border-t-blue-500 border-r-indigo-500 rounded-full animate-spin"></div>
                
                <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5">
                   <SearchIcon className="text-blue-500 animate-pulse" size={24} />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 max-w-sm w-full">
               <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Mencari Koleksi...
                  </h2>
               </div>
               
               <div className="relative w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5 max-w-[200px]">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 w-full -translate-x-[100%] animate-[progress_3s_ease-in-out_infinite]"></div>
               </div>
            </div>

            <style>{`
              @keyframes progress {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
          </div>
        ) : searched ? (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-slate-800 pb-4 gap-4">
              <h2 className="text-2xl font-bold text-white">
                Hasil Pencarian {query && <span className="text-blue-400">"{query}"</span>}
              </h2>
              <span className="text-slate-500 text-sm">{results.length} hasil</span>
            </div>

            {results && results.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {results.map((drama) => (
                    <MovieCard key={drama.bookId} drama={drama} />
                  ))}
                </div>

                {/* Numerical Pagination */}
                <div className="flex items-center justify-center gap-2 mt-16 pb-12">
                  <button 
                    onClick={() => handleSearch(query, page - 1)}
                    disabled={page === 1}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-600 transition-all"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  
                  {[page - 1, page, page + 1].map(p => {
                    if (p < 1) return null;
                    return (
                      <button
                        key={p}
                        onClick={() => handleSearch(query, p)}
                        className={`w-14 h-14 rounded-2xl font-black transition-all ${
                          page === p 
                          ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' 
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button 
                    onClick={() => handleSearch(query, page + 1)}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white hover:bg-blue-600 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500 text-xl mb-4">Tidak ada drama yang sesuai dengan pencarian Anda.</p>
                <button 
                  onClick={clearSearch}
                  className="text-blue-500 hover:text-blue-400 font-semibold transition-colors"
                >
                  Coba cari drama lain
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <SearchIcon size={80} className="text-slate-700 mb-4" />
            <p className="text-slate-600 font-medium text-xl">Masukkan judul untuk menjelajahi koleksi kami</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
