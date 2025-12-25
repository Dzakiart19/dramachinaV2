import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { AlertCircle, RefreshCcw, LayoutDashboard } from 'lucide-react';

const ForYou: React.FC = () => {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadForYou = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getForYouDramas().catch(() => []);
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Tidak ada rekomendasi ditemukan');
      }

      // Remove duplicates by bookId
      const dramaMaps = new Map<string, Drama>();
      data.forEach(d => dramaMaps.set(d.bookId, d));
      const uniqueDramas = Array.from(dramaMaps.values());
      setDramas(uniqueDramas);
    } catch (err) {
      console.error('Failed to load for you:', err);
      setError('Gagal memuat rekomendasi. Silakan coba lagi.');
      setDramas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForYou();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-950 p-6 overflow-hidden">
        <div className="relative group scale-110 md:scale-125 mb-16">
          <div className="absolute inset-[-40px] bg-purple-600/20 blur-[60px] rounded-full animate-pulse"></div>
          <div className="absolute inset-[-20px] bg-pink-600/10 blur-[40px] rounded-full animate-pulse delay-700"></div>
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-[3px] border-t-purple-500 border-r-pink-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border border-purple-500/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5">
              <LayoutDashboard className="text-purple-500 animate-pulse" size={24} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="space-y-1 text-center">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Menyiapkan Rekomendasi...
            </h2>
            <div className="flex justify-center gap-1.5 py-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </div>
          
          <div className="relative w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600 w-full -translate-x-[100%] animate-[progress_3s_ease-in-out_infinite]"></div>
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

  if (error || dramas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-purple-500 mb-4" />
        <p className="text-slate-400 mb-6">{error || 'Tidak ada rekomendasi ditemukan'}</p>
        <button 
          onClick={() => loadForYou()}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-colors"
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
          Untuk <span className="text-purple-500">Anda</span>
        </h1>
        <p className="text-slate-400">Rekomendasi pilihan spesial: {dramas.length} drama</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {dramas.filter(d => d && d.bookId).map((drama) => (
          <MovieCard key={drama.bookId} drama={drama} />
        ))}
      </div>
    </div>
  );
};

export default ForYou;
