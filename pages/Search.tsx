
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { Search as SearchIcon, Loader2, TrendingUp, X } from 'lucide-react';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Drama[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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

  const handleSearch = async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    setLoading(true);
    setSearched(true);
    try {
      const data = await apiService.searchDramas(trimmedQuery);
      setResults(Array.isArray(data) ? data : []);
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
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-slate-400">Tunggu sebentar maaf agak lama karena pakai gratisan 😅</p>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {results.map((drama) => (
                  <MovieCard key={drama.bookId} drama={drama} />
                ))}
              </div>
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
