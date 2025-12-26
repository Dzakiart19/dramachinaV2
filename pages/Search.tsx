
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { Search as SearchIcon, TrendingUp, X, ChevronRight, Loader2 } from 'lucide-react';

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
    <div className="container mx-auto px-4 md:px-16 py-20 min-h-screen relative z-10">
      {/* Search Bar revamped */}
      <div className="max-w-4xl mx-auto mb-24">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-1 w-12 bg-red-600 rounded-full"></div>
          <span className="text-red-600 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Discovery</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-white text-center mb-12 uppercase tracking-tighter leading-none drop-shadow-2xl">
          FIND YOUR <span className="text-zinc-700">STORY</span>
        </h1>

        <form onSubmit={handleFormSubmit} className="relative group max-w-2xl mx-auto">
          <input 
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for titles, actors, or genres..."
            className="w-full bg-[#0a0a0a]/80 backdrop-blur-2xl border border-zinc-800 group-hover:border-red-600/30 rounded-xl py-6 px-8 pl-16 pr-40 text-white focus:outline-none focus:border-red-600 transition-all text-xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] placeholder:text-zinc-700 placeholder:font-black placeholder:uppercase placeholder:text-xs placeholder:tracking-[0.2em]"
          />
          
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-red-600 group-hover:scale-110 transition-transform duration-300" size={28} />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {query && (
              <button 
                type="button"
                onClick={clearSearch}
                className="text-zinc-600 hover:text-white transition-colors p-2"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
            
            <button 
              type="submit"
              disabled={!query.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-black px-8 py-3 rounded-lg transition-all shadow-xl uppercase tracking-widest text-[10px] active:scale-95"
            >
              Explore
            </button>
          </div>
        </form>

        {!searched && popularSearches && popularSearches.length > 0 && (
          <div className="mt-12">
            <p className="text-center text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Trending Searches</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches && Array.isArray(popularSearches) && popularSearches.slice(0, 8).map((tag, i) => (
                typeof tag === 'string' ? (
                  <button
                    key={`popular-${i}`}
                    type="button"
                    onClick={() => handlePopularClick(tag)}
                    className="bg-[#141414] hover:bg-red-600 text-zinc-400 hover:text-white px-6 py-2.5 rounded-md text-[10px] font-black border border-zinc-800 hover:border-red-500 transition-all uppercase tracking-widest active:scale-95"
                  >
                    {tag}
                  </button>
                ) : null
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results revamped */}
      <div className="min-h-[40vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Loader2 className="w-16 h-16 text-red-600 animate-spin mb-8" />
            <p className="text-red-600 font-black tracking-[0.4em] uppercase animate-pulse">Scanning Database...</p>
          </div>
        ) : searched ? (
          <div>
            <div className="flex items-center justify-between mb-12 border-b border-zinc-900/50 pb-6">
              <div className="flex items-end gap-4">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                  Results <span className="text-zinc-700 ml-2">Found</span>
                </h2>
                {query && <span className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-1">"{query}"</span>}
              </div>
              <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-900/80 px-4 py-1.5 rounded-full border border-zinc-800">{allResults.length} TITLES MATCHED</span>
            </div>

            {searched && allResults && allResults.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12 mb-24 animate-in fade-in slide-in-from-bottom-5 duration-700">
                  {displayedResults.map((drama, idx) => (
                    <MovieCard key={`${drama.bookId}-${idx}`} drama={drama} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-8 mb-20 pt-10 border-t border-zinc-900/50">
                    <button 
                      onClick={() => changePage(page - 1)}
                      disabled={page === 1}
                      className="group relative flex items-center justify-center bg-[#141414] hover:bg-red-600 disabled:opacity-20 text-white w-14 h-14 rounded-full transition-all duration-500 border border-zinc-800 hover:border-red-500 disabled:cursor-not-allowed active:scale-90"
                    >
                      <ChevronRight size={24} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-4 bg-[#141414] px-8 py-3 rounded-full border border-zinc-800 shadow-2xl">
                      <span className="text-white font-black text-lg tracking-tighter">{page.toString().padStart(2, '0')}</span>
                      <div className="h-6 w-[1px] bg-zinc-800"></div>
                      <span className="text-zinc-600 font-black text-lg tracking-tighter">{totalPages.toString().padStart(2, '0')}</span>
                    </div>

                    <button 
                      onClick={() => changePage(page + 1)}
                      disabled={page >= totalPages}
                      className="group relative flex items-center justify-center bg-[#141414] hover:bg-red-600 disabled:opacity-20 text-white w-14 h-14 rounded-full transition-all duration-500 border border-zinc-800 hover:border-red-500 disabled:cursor-not-allowed active:scale-90"
                    >
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-40">
                <p className="text-zinc-600 text-xl font-medium mb-4">No dramas found for your search.</p>
                <button 
                  onClick={clearSearch}
                  className="text-red-600 hover:text-red-500 font-bold uppercase tracking-wider transition-colors"
                >
                  Try another search
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <SearchIcon size={100} className="text-zinc-700 mb-6" />
            <p className="text-zinc-700 font-bold text-2xl uppercase tracking-tighter">Enter a title to explore</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
