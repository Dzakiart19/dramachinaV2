
import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { Drama, VIPResponse } from '../types';
import MovieCard from '../components/MovieCard';
import { ChevronRight, Play, Info, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';

const Home: React.FC = () => {
  const [vipData, setVipData] = useState<VIPResponse | null>(null);
  const [latest, setLatest] = useState<Drama[]>([]);
  const [forYou, setForYou] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // We fetch them individually so one failure doesn't block others
    try {
      // Fetch Latest first as it's the primary content
      const latestData = await apiService.getLatestDramas().catch(e => {
        console.error('Failed to fetch latest:', e);
        return [] as Drama[];
      });
      setLatest(latestData);

      // Fetch VIP
      const vip = await apiService.getVIPDramas().catch(e => {
        console.error('Failed to fetch VIP:', e);
        return null;
      });
      setVipData(vip);

      // Fetch Recommendations
      const recommended = await apiService.getForYouDramas().catch(e => {
        console.error('Failed to fetch recommendations:', e);
        return [] as Drama[];
      });
      setForYou(recommended);

      // If everything is empty, then we show a global error
      if (latestData.length === 0 && !vip && recommended.length === 0) {
        throw new Error('Semua sumber data gagal dimuat.');
      }
    } catch (err) {
      console.error('Failed to load home data:', err);
      setError('Gagal menghubungkan ke server drama. Silakan coba lagi nanti atau periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-500" size={56} />
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
        </div>
        <p className="text-slate-400 font-medium animate-pulse tracking-wide">Tunggu sebentar maaf agak lama karena pakai gratisan 😅</p>
      </div>
    );
  }

  if (error && latest.length === 0 && !vipData) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/20">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Ups! Koneksi Terputus</h2>
        <p className="text-slate-400 max-w-md mb-8">{error}</p>
        <button 
          onClick={loadData}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/30"
        >
          <RefreshCcw size={20} />
          Segarkan Halaman
        </button>
      </div>
    );
  }

  const featured = vipData?.columnVoList?.[0]?.bookList?.[0] || latest[0];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      {featured && (
        <section className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={featured.coverWap || featured.cover} 
              alt={featured.bookName}
              className="w-full h-full object-cover object-top scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shadow-lg shadow-blue-600/20">VIP CHOICE</span>
                  <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Paling Populer</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl line-clamp-2 leading-tight">
                  {featured.bookName}
                </h1>
                <p className="text-slate-300 text-sm md:text-lg mb-10 line-clamp-3 md:line-clamp-4 max-w-xl leading-relaxed">
                  {featured.introduction}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={`#/detail/${featured.bookId}`}
                    className="flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
                  >
                    <Play size={22} fill="currentColor" />
                    NONTON SEKARANG
                  </a>
                  <a 
                    href={`#/detail/${featured.bookId}`}
                    className="flex items-center gap-3 bg-slate-800/40 backdrop-blur-xl text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-700/60 transition-all border border-slate-700/50"
                  >
                    <Info size={22} />
                    INFO DETAIL
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <style>{`
            @keyframes subtle-zoom {
              from { transform: scale(1); }
              to { transform: scale(1.1); }
            }
          `}</style>
        </section>
      )}

      {/* Recommended For You */}
      {forYou && forYou.length > 0 && (
        <section className="container mx-auto px-4 mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              Rekomendasi <span className="text-blue-500">Pilihan</span>
            </h2>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 snap-x -mx-4 px-4">
            {forYou.map((drama) => (
              <div key={drama.bookId} className="min-w-[180px] md:min-w-[240px] snap-start">
                <MovieCard drama={drama} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest Releases */}
      {latest && latest.length > 0 && (
        <section className="container mx-auto px-4 mt-16">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              Rilis Terbaru
            </h2>
            <a href="#/search" className="text-blue-500 text-sm font-bold flex items-center gap-1 hover:text-blue-400 transition-colors bg-blue-500/10 px-4 py-2 rounded-full">
              LIHAT SEMUA <ChevronRight size={18} />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {latest.slice(0, 12).map((drama) => (
              <MovieCard key={drama.bookId} drama={drama} />
            ))}
          </div>
        </section>
      )}

      {/* Dynamic Sections from VIP API */}
      {vipData?.columnVoList.slice(1).map((section) => (
        <section key={section.columnId} className="container mx-auto px-4 mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-slate-700 rounded-full"></div>
              {section.title}
            </h2>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 snap-x -mx-4 px-4">
            {section.bookList.map((drama) => (
              <div key={drama.bookId} className="min-w-[180px] md:min-w-[240px] snap-start">
                <MovieCard drama={drama} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
