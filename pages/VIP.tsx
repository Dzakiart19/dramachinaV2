import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama, VIPResponse } from '../types';
import MovieCard from '../components/MovieCard';
import { AlertCircle, RefreshCcw, LayoutDashboard } from 'lucide-react';

const VIP: React.FC = () => {
  const [vipData, setVipData] = useState<VIPResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVIP = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getVIPDramas();
      
      if (!data || !data.columnVoList || data.columnVoList.length === 0) {
        throw new Error('Tidak ada data VIP ditemukan');
      }

      setVipData(data);
      setSelectedCategory(0);
    } catch (err) {
      console.error('Failed to load VIP:', err);
      setError('Gagal memuat drama VIP. Silakan coba lagi.');
      setVipData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVIP();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-950 p-6 overflow-hidden">
        <div className="relative group scale-110 md:scale-125 mb-16">
          <div className="absolute inset-[-40px] bg-yellow-600/20 blur-[60px] rounded-full animate-pulse"></div>
          <div className="absolute inset-[-20px] bg-amber-600/10 blur-[40px] rounded-full animate-pulse delay-700"></div>
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-[3px] border-t-yellow-500 border-r-amber-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border border-yellow-500/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5">
              <LayoutDashboard className="text-yellow-500 animate-pulse" size={24} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="space-y-1 text-center">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Memuat VIP...
            </h2>
            <div className="flex justify-center gap-1.5 py-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </div>
          
          <div className="relative w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-600 to-amber-600 w-full -translate-x-[100%] animate-[progress_3s_ease-in-out_infinite]"></div>
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

  if (error || !vipData) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-yellow-500 mb-4" />
        <p className="text-slate-400 mb-6">{error || 'Tidak ada data VIP'}</p>
        <button 
          onClick={() => loadVIP()}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          <RefreshCcw size={20} />
          Coba Lagi
        </button>
      </div>
    );
  }

  const column = vipData.columnVoList[selectedCategory];
  const dramas = column?.bookList || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
          Drama <span className="text-yellow-500">VIP</span>
        </h1>
        <p className="text-slate-400">Pilihan eksklusif mingguan</p>
      </div>

      {vipData.columnVoList.length > 1 && (
        <div className="flex gap-2 mb-8 sm:mb-12 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0">
          {vipData.columnVoList.map((col, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(idx)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold whitespace-nowrap transition-colors text-xs sm:text-base ${
                selectedCategory === idx
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {col.title}
            </button>
          ))}
        </div>
      )}

      {dramas.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {dramas.filter(d => d && d.bookId).map((drama) => (
            <MovieCard key={drama.bookId} drama={drama} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">Tidak ada drama ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default VIP;
