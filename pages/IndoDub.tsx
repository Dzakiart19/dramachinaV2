
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama } from '../types';
import MovieCard from '../components/MovieCard';
import { Loader2, AlertCircle, RefreshCcw, ChevronRight } from 'lucide-react';

const IndoDub: React.FC = () => {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIndoDub = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getIndoDubDramas('terpopuler', 1);
      setDramas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load indo dub:', err);
      setError('Gagal memuat drama sulih suara Indonesia. Silakan coba lagi.');
      setDramas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndoDub();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Loader2 className="animate-spin text-blue-500" size={56} />
        <p className="text-slate-400 font-medium">Tunggu sebentar maaf agak lama karena pakai gratisan 😅</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={loadIndoDub}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all"
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
          Drama <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Sulih Suara</span>
        </h1>
        <p className="text-slate-400">Drama dengan versi sulih suara Indonesia berkualitas tinggi</p>
      </div>

      {dramas.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {dramas.map((drama) => (
            <MovieCard key={drama.bookId} drama={drama} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">Belum ada drama sulih suara</p>
        </div>
      )}
    </div>
  );
};

export default IndoDub;
