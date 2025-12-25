
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { Search as SearchIcon, TrendingUp, X, ChevronRight } from 'lucide-react';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState<Drama[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

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
      // Load search results in PARALLEL (5 pages at once for speed)
      const promises = Array.from({ length: 5 }, (_, i) => 
        apiService.searchDramas(trimmedQuery, i + 1).catch(() => [])
      );
      
      const results = await Promise.all(promises);
      const allResultsData = results.flat();
      
      // Remove duplicates by bookId
      const uniqueResults = Array.from(new Map(allResultsData.map(d => [d.bookId, d])).values());
      
      setAllResults(uniqueResults);
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } catch (error) {
      console.error('Search error:', error);
      setAllResults([]);
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
    setAllResults([]);
    setSearched(false);
    setPage(1);
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || (newPage - 1) * itemsPerPage >= allResults.length) return;
    setPage(newPage);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const displayedResults = allResults.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(allResults.length / itemsPerPage);

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
            {popularSearches && Array.isArray(popularSearches) && popularSearches.slice(0, 6).map((tag, i) => (
              typeof tag === 'string' ? (
                <button
                  key={`popular-${i}`}
                  type="button"
                  onClick={() => handlePopularClick(tag)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-full text-sm border border-slate-700 transition-colors"
                >
                  {tag}
                </button>
              ) : null
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

            {searched && allResults && allResults.length > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-2">
                  <span className="text-slate-500 text-sm">Halaman {page} dari {totalPages}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-8 sm:mb-12">
                  {displayedResults.map((drama, idx) => (
                    <MovieCard key={`${drama.bookId}-${idx}`} drama={drama} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-16 pb-8 sm:pb-12 flex-wrap">
                    <button 
                      onClick={() => changePage(page - 1)}
                      disabled={page === 1}
                      className="flex items-center gap-1 sm:gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-base"
                    >
                      <ChevronRight size={16} className="rotate-180" /> <span className="hidden sm:inline">Sebelumnya</span>
                    </button>

                    <div className="flex gap-1 sm:gap-2 flex-wrap justify-center max-w-4xl">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => changePage(p)}
                          className={`font-bold py-2 px-2 sm:px-3 md:px-4 rounded-lg text-[10px] sm:text-xs md:text-base transition-colors ${
                            p === page
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
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
                      className="flex items-center gap-1 sm:gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-base"
                    >
                      <span className="hidden sm:inline">Selanjutnya</span> <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : searched && allResults && allResults.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-500 text-xl mb-4">Tidak ada drama yang sesuai dengan pencarian Anda.</p>
                <button 
                  onClick={clearSearch}
                  className="text-blue-500 hover:text-blue-400 font-semibold transition-colors"
                >
                  Coba cari drama lain
                </button>
              </div>
            ) : null}
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
