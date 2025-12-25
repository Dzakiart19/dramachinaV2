
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama, Episode } from '../types';
import { Play, Star, Eye, Calendar, Tag, ChevronLeft, Loader2, List, LayoutDashboard, AlertCircle } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-black">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
        <p className="mt-6 text-red-600 font-bold tracking-[0.3em] uppercase animate-pulse">DZECK STREAM</p>
      </div>
    );
  }

  if (!drama) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center bg-black">
        <AlertCircle size={64} className="text-red-600 mb-6" />
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Content Not Found</h2>
        <p className="text-zinc-500 max-w-sm mb-10 font-medium">Drama mungkin tidak tersedia atau terjadi kesalahan jaringan.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-10 py-3 rounded-md font-bold transition-all hover:bg-red-700 active:scale-95 shadow-lg shadow-red-600/20 uppercase tracking-wider"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-black">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[75vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={drama.coverWap || drama.cover} 
            alt={drama.bookName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        </div>
        
        <div className="absolute top-6 left-6 md:left-12">
           <a href="#/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
             <ChevronLeft size={20} /> Back
           </a>
        </div>

        <div className="absolute bottom-10 left-6 md:left-12 max-w-4xl">
           <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none drop-shadow-2xl">
             {drama.bookName}
           </h1>
           
           <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-green-500 font-bold">
                <Star size={18} fill="currentColor" />
                <span>9.2 Rating</span>
              </div>
              <div className="text-zinc-400 font-bold">2024</div>
              <div className="text-white border border-white/40 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">4K Ultra HD</div>
              <div className="text-zinc-400 font-bold">{drama.chapterCount} Episodes</div>
           </div>

           {episodes.length > 0 && (
             <div className="flex gap-4">
               <a 
                 href={`#/player/${bookId}/${episodes[0].chapterId}`}
                 className="flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black font-black px-8 md:px-12 py-3 md:py-4 rounded-md transition-all scale-100 hover:scale-105 uppercase tracking-wider shadow-2xl"
               >
                 <Play size={24} fill="currentColor" />
                 Play
               </a>
               <button 
                 onClick={() => document.getElementById('synopsis-section')?.scrollIntoView({ behavior: 'smooth' })}
                 className="flex items-center justify-center gap-3 bg-zinc-500/30 hover:bg-zinc-500/50 backdrop-blur-md text-white font-black px-8 md:px-12 py-3 md:py-4 rounded-md transition-all uppercase tracking-wider border border-white/10"
               >
                 More Info
               </button>
             </div>
           )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="mb-12" id="synopsis-section">
              <h3 className="text-xl font-bold text-zinc-500 uppercase tracking-widest mb-4">Synopsis</h3>
              <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {drama.introduction}
              </p>
            </div>

            {drama.tags && (
              <div className="mb-12">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {drama.tags.map(tag => (
                    <span key={tag} className="bg-zinc-900 text-zinc-400 border border-zinc-800 px-4 py-1.5 rounded-full text-sm font-bold hover:text-white hover:border-zinc-600 transition-all cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Episode List */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Episodes</h3>
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{episodes.length} Items</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {episodes.map((ep, idx) => (
                  <a 
                    key={ep.chapterId}
                    href={`#/player/${bookId}/${ep.chapterId}`}
                    className="flex flex-col p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-md hover:bg-zinc-800 hover:border-zinc-600 group transition-all"
                  >
                    <span className="text-red-600 font-black text-[10px] mb-1 uppercase tracking-widest">EPS {ep.chapterName}</span>
                    <span className="text-white font-bold group-hover:text-red-500 transition-colors line-clamp-1">{drama.bookName}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
             <div className="bg-zinc-900/30 p-8 rounded-md border border-zinc-800/50">
               <h3 className="text-zinc-500 font-bold uppercase tracking-[0.2em] mb-6 text-sm">About {drama.bookName}</h3>
               <div className="space-y-6">
                 <div>
                   <span className="text-zinc-600 block text-xs uppercase font-black tracking-widest mb-1">Director</span>
                   <span className="text-white font-bold">Dzeck Production</span>
                 </div>
                 <div>
                   <span className="text-zinc-600 block text-xs uppercase font-black tracking-widest mb-1">Status</span>
                   <span className="text-green-500 font-bold uppercase tracking-wider">Completed</span>
                 </div>
                 <div>
                   <span className="text-zinc-600 block text-xs uppercase font-black tracking-widest mb-1">Language</span>
                   <span className="text-white font-bold">Mandarin, Indonesian</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
