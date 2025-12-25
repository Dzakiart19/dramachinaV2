
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
    <div className="container mx-auto px-4 md:px-10 py-12 min-h-screen">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl md:text-5xl font-black text-white text-center mb-8 uppercase tracking-tighter">
          Find Your <span className="text-red-600">Drama</span>
        </h1>

        <form onSubmit={handleFormSubmit} className="relative group">
          <input 
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau kata kunci..."
            className="w-full bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 rounded-md py-4 px-6 pl-14 pr-32 text-white focus:outline-none focus:border-red-600 transition-all text-lg shadow-2xl"
          />
          
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={24} />
          
          {query && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors z-10"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
          
          <button 
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-bold px-6 py-2 rounded-md transition-all z-10 shadow-lg"
          >
            Search
          </button>
        </form>

        {!searched && popularSearches && popularSearches.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {popularSearches && Array.isArray(popularSearches) && popularSearches.slice(0, 6).map((tag, i) => (
              typeof tag === 'string' ? (
                <button
                  key={`popular-${i}`}
                  type="button"
                  onClick={() => handlePopularClick(tag)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-4 py-1.5 rounded-full text-sm border border-zinc-800 transition-all"
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
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-red-600 font-bold tracking-widest uppercase animate-pulse">Searching...</p>
          </div>
        ) : searched ? (
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                Search Results {query && <span className="text-zinc-500 ml-2">"{query}"</span>}
              </h2>
              <span className="text-zinc-600 text-sm font-medium">{allResults.length} Found</span>
            </div>

            {searched && allResults && allResults.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-16">
                  {displayedResults.map((drama, idx) => (
                    <MovieCard key={`${drama.bookId}-${idx}`} drama={drama} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mb-12">
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
