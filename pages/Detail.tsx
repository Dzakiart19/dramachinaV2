
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama, Episode } from '../types';
import { Play, Star, Eye, Calendar, Tag, ChevronLeft, Loader2, List, LayoutDashboard } from 'lucide-react';

interface DetailProps {
  bookId: string;
}

const Detail: React.FC<DetailProps> = ({ bookId }) => {
  const [drama, setDrama] = useState<Drama | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const [detailData, epsData] = await Promise.all([
          apiService.getDramaDetail(bookId),
          apiService.getAllEpisodes(bookId).catch(() => [])
        ]);
        if (detailData && detailData.data) {
          setDrama(detailData.data.book);
        }
        setEpisodes(epsData);
      } catch (error) {
        console.error('Failed to load detail:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [bookId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-950 p-6 overflow-hidden">
        <div className="relative group scale-110 md:scale-125 mb-16">
          <div className="absolute inset-[-40px] bg-indigo-600/20 blur-[60px] rounded-full animate-pulse"></div>
          
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-[3px] border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-[3px] border-t-indigo-500 border-r-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border border-blue-500/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
            
            <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/5">
               <LayoutDashboard className="text-indigo-500 animate-pulse" size={24} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-sm w-full">
           <div className="space-y-1 text-center">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent animate-in slide-in-from-bottom-2 duration-700">
                Membuka Arsip...
              </h2>
              <div className="flex justify-center gap-1.5 py-2">
                 {[0, 1, 2].map((i) => (
                   <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
                 ))}
              </div>
           </div>
           
           <div className="relative w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-blue-600 w-full -translate-x-[100%] animate-[progress_3s_ease-in-out_infinite]"></div>
           </div>
           <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] animate-pulse">Data Sinopsis & Episode</p>
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

  if (!drama) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
        <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/20">
          <Play size={48} className="text-red-500 rotate-45" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Drama Tidak Ditemukan</h2>
        <p className="text-slate-400 max-w-sm mb-10">Data drama mungkin telah dihapus atau server sedang mengalami gangguan koneksi.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-white text-black px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          COBA LAGI
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Background/Banner */}
      <div className="relative h-[40vh] md:h-[60vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={drama.coverWap || drama.cover} 
            alt={drama.bookName}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>
        
        <div className="absolute bottom-4 left-4">
           <a href="#/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
             <ChevronLeft size={24} /> Back
           </a>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-slate-900">
              <img 
                src={drama.coverWap || drama.cover} 
                alt={drama.bookName}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>
            
            {episodes.length > 0 && (
              <a 
                href={`#/player/${bookId}/${episodes[0].chapterId}`}
                className="mt-6 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-105"
              >
                <Play size={24} fill="currentColor" />
                Start Watching
              </a>
            )}
          </div>

          {/* Info */}
          <div className="flex-grow">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{drama.bookName}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                <Star size={16} className="text-yellow-400" />
                <span>4.8 Rating</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                <Eye size={16} className="text-blue-400" />
                <span>{drama.viewCount?.toLocaleString() || '1M+'} Views</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                <List size={16} className="text-purple-400" />
                <span>{drama.chapterCount} Episodes</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-3">Synopsis</h3>
              <p className="text-slate-400 leading-relaxed max-w-3xl whitespace-pre-wrap">
                {drama.introduction}
              </p>
            </div>

            {drama.tags && (
              <div className="mb-10">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Tag size={18} /> Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {drama.tags.map(tag => (
                    <span key={tag} className="bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded text-sm hover:border-blue-500 hover:text-blue-500 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Episode List */}
            <div className="mt-12 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Episodes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {episodes.map((ep, idx) => (
                  <a 
                    key={ep.chapterId}
                    href={`#/player/${bookId}/${ep.chapterId}`}
                    className="flex flex-col items-center justify-center p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-blue-600 hover:border-blue-400 group transition-all"
                  >
                    <span className="text-slate-300 group-hover:text-white text-xs mb-1">Chapter {ep.chapterIndex + 1}</span>
                    <span className="text-white font-bold">{ep.chapterName}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
