
import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { Drama, VIPResponse } from '../types';
import MovieCard from '../components/MovieCard';
import { ChevronRight, Play, Info, Loader2, AlertCircle, RefreshCcw, LayoutDashboard, X } from 'lucide-react';

const Home: React.FC = () => {
  const [vipData, setVipData] = useState<VIPResponse | null>(null);
  const [latest, setLatest] = useState<Drama[]>([]);
  const [page, setPage] = useState(1);
  const [forYou, setForYou] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGreeting, setShowGreeting] = useState(false);

  const changePage = async (newPage: number) => {
    if (newPage < 1) return;
    setLoading(true);
    setPage(newPage);
    try {
      const data = await apiService.getLatestDramas(newPage);
      setLatest(Array.isArray(data) ? data : []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('Page change error:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all data in parallel for much faster initial load
      const [latestData, vip, recommended] = await Promise.all([
        apiService.getLatestDramas(page).catch(() => []),
        apiService.getVIPDramas().catch(() => null),
        apiService.getForYouDramas().catch(() => []),
      ]);

      setLatest(latestData);
      setVipData(vip);
      setForYou(recommended);

      if (latestData.length === 0 && !vip && recommended.length === 0) {
        throw new Error('Semua sumber data gagal dimuat.');
      }

      // Show greeting after successful load
      const hasGreeted = sessionStorage.getItem('hasGreeted');
      if (!hasGreeted) {
        setShowGreeting(true);
        sessionStorage.setItem('hasGreeted', 'true');
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
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-950 p-6 overflow-hidden">
        <div className="relative group scale-110 md:scale-125 mb-16">
          {/* Animated Glow Rings */}
          <div className="absolute inset-[-40px] bg-blue-600/20 blur-[60px] rounded-full animate-pulse"></div>
          <div className="absolute inset-[-20px] bg-indigo-600/10 blur-[40px] rounded-full animate-pulse delay-700"></div>
          
          {/* Main Loader Ring */}
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-[3px] border-t-blue-500 border-r-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border border-blue-500/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
            
            {/* Center Icon */}
            <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
               <LayoutDashboard className="text-blue-500 animate-pulse" size={24} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-sm w-full">
           <div className="space-y-1 text-center">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent animate-in slide-in-from-bottom-2 duration-700">
                Memuat Pengalaman...
              </h2>
              <div className="flex justify-center gap-1.5 py-2">
                 {[0, 1, 2].map((i) => (
                   <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
                 ))}
              </div>
           </div>
           
           <div className="relative w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 w-full -translate-x-[100%] animate-[progress_3s_ease-in-out_infinite]"></div>
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
      {/* Greeting Modal */}
      {showGreeting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setShowGreeting(false)}
          />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_100px_-20px_rgba(59,130,246,0.3)] animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <button 
              onClick={() => setShowGreeting(false)}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/20 rotate-12">
                <LayoutDashboard size={40} className="text-white -rotate-12" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                Selamat Datang di <br/>
                <span className="text-blue-500">Dzeck Stream!</span>
              </h2>
              
              <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                Nikmati ribuan drama China dan Asia terlengkap dengan kualitas terbaik. Selamat menonton!
              </p>
              
              <button 
                onClick={() => setShowGreeting(false)}
                className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
              >
                <LayoutDashboard size={24} />
                MASUK KE DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {featured && (
        <section className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={featured.coverWap || featured.cover} 
              alt={featured.bookName}
              className="w-full h-full object-cover object-center scale-105 animate-[subtle-zoom_30s_infinite_alternate]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-slate-950/20" />
          </div>

          <div className="absolute inset-0 flex items-end pb-24 md:pb-32">
            <div className="container mx-auto px-6 md:px-12">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full shadow-2xl shadow-blue-600/40 tracking-wider">PREMIUM SELECTION</span>
                  <span className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Trending Now</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-white mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] line-clamp-2 leading-[0.9] tracking-tighter">
                  {featured.bookName}
                </h1>
                <p className="text-slate-200 text-base md:text-xl mb-12 line-clamp-3 md:line-clamp-4 max-w-2xl leading-relaxed font-medium drop-shadow-md">
                  {featured.introduction}
                </p>
                <div className="flex flex-wrap gap-5">
                  <a 
                    href={`#/detail/${featured.bookId}`}
                    className="flex items-center gap-4 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] hover:scale-105 active:scale-95 group"
                  >
                    <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                    MULAI MENONTON
                  </a>
                  <a 
                    href={`#/detail/${featured.bookId}`}
                    className="flex items-center gap-4 bg-white/10 backdrop-blur-2xl text-white px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-all border border-white/20 hover:scale-105 active:scale-95"
                  >
                    <Info size={24} />
                    DETAIL DRAMA
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

          {/* Numerical Pagination */}
          <div className="flex items-center justify-center gap-2 mt-16">
            <button 
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-600 transition-all"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
            
            {[page - 1, page, page + 1].filter(p => p >= 1).map(p => (
              <button
                key={`page-${p}`}
                onClick={() => changePage(p)}
                className={`w-14 h-14 rounded-2xl font-black transition-all ${
                  page === p 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}

            <button 
              onClick={() => changePage(page + 1)}
              className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white hover:bg-blue-600 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>
      )}

      {/* Dynamic Sections from VIP API */}
      {vipData?.columnVoList.slice(1).map((section, idx) => (
        <section key={`${section.columnId}-${idx}`} className="container mx-auto px-4 mt-16">
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
