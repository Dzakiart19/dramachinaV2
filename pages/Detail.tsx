import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Drama, Episode } from '../types';
import { Play, Star, ChevronLeft, AlertCircle } from 'lucide-react';
import { PageHeroSkeleton, Skeleton } from '../components/Skeleton';

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
        
        console.log('Detail API Response:', detailData);
        
        if (detailData) {
          // Handle various response formats
          const book = detailData.data?.book || detailData.book || detailData;
          if (book && (book.bookId || book.id)) {
            setDrama(book);
          }
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
      <div className="bg-black min-h-screen">
        <PageHeroSkeleton />
        <div className="container mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mt-8 md:mt-0">
          <div className="md:col-span-8 space-y-12">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
          <div className="md:col-span-4">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
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
      <div className="relative h-[65vh] md:h-[90vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={drama.coverWap || drama.cover} 
            alt={drama.bookName}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent,rgba(0,0,0,0.4))]" />
        </div>
        
        <div className="absolute top-4 left-4 md:top-8 md:left-16 z-20">
           <a href="#/" className="group flex items-center gap-2 text-white hover:text-white transition-all bg-black/40 backdrop-blur-2xl px-4 py-2 md:px-6 md:py-2.5 rounded-full border border-white/10 hover:border-white/30 hover:bg-black/60 shadow-2xl">
             <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
             <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Back to Browse</span>
           </a>
        </div>

        <div className="absolute bottom-10 md:bottom-20 left-4 md:left-16 right-4 max-w-5xl z-10 animate-in slide-in-from-bottom-10 duration-1000">
           <div className="flex items-center gap-3 mb-4 md:mb-6">
             <div className="h-0.5 w-8 md:w-12 bg-red-600"></div>
             <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">DZECK ORIGINALS</span>
           </div>
           <h1 className="text-3xl md:text-8xl font-black text-white mb-6 md:mb-8 uppercase tracking-tighter leading-[0.9] drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
             {drama.bookName}
           </h1>
           
           <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8 md:mb-10">
              <div className="flex items-center gap-2 text-green-500 font-black tracking-widest text-[10px] md:text-sm">
                <Star size={16} fill="currentColor" />
                <span>98% MATCH</span>
              </div>
              <div className="text-zinc-200 font-black text-[10px] md:text-sm tracking-widest">2024</div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-1.5 py-0.5 rounded text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white">4K ULTRA HD</div>
              <div className="text-zinc-300 font-black text-[10px] md:text-sm tracking-widest border-l border-zinc-700 pl-4 md:pl-6">{drama.chapterCount} EPISODES</div>
           </div>

           {episodes.length > 0 && (
             <div className="flex flex-col sm:flex-row gap-4">
               <a 
                 href={`#/player/${bookId}/${episodes[0].chapterId}`}
                 className="flex items-center justify-center gap-4 bg-white hover:bg-zinc-200 text-black font-black px-10 md:px-16 py-3.5 md:py-5 rounded-md transition-all scale-100 hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-[12px] md:text-sm shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
               >
                 <Play size={20} fill="currentColor" />
                 Play Now
               </a>
               <button 
                 onClick={() => document.getElementById('synopsis-section')?.scrollIntoView({ behavior: 'smooth' })}
                 className="flex items-center justify-center gap-4 bg-zinc-500/20 hover:bg-zinc-500/40 backdrop-blur-2xl text-white font-black px-10 md:px-16 py-3.5 md:py-5 rounded-md transition-all uppercase tracking-[0.2em] text-[12px] md:text-sm border border-white/10 active:scale-95 shadow-2xl"
               >
                 Episodes & Info
               </button>
             </div>
           )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-16 mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="mb-20" id="synopsis-section">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-6 w-1.5 bg-red-600 rounded-full"></div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Storyline</h3>
              </div>
              <p className="text-zinc-400 text-xl leading-relaxed whitespace-pre-wrap font-medium first-letter:text-5xl first-letter:font-black first-letter:text-red-600 first-letter:mr-3 first-letter:float-left">
                {drama.introduction}
              </p>
            </div>

            {drama.tags && (
              <div className="mb-20">
                <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Explore Genres</h3>
                <div className="flex flex-wrap gap-3">
                  {drama.tags.map(tag => (
                    <span key={tag} className="bg-[#141414] text-zinc-400 border border-zinc-800 px-6 py-2 rounded-md text-xs font-black hover:text-white hover:border-red-600/50 hover:bg-red-600/5 transition-all cursor-default uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-20">
              <div className="flex items-center justify-between mb-10 border-b border-zinc-900/50 pb-6">
                <div className="flex items-end gap-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Episodes</h3>
                  <span className="text-red-600 font-black uppercase tracking-[0.2em] text-[10px] mb-1.5">Full Collection</span>
                </div>
                <span className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-[10px] bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">{episodes.length} EPISODES TOTAL</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
                {episodes.map((ep) => (
                  <a 
                    key={ep.chapterId}
                    href={`#/player/${bookId}/${ep.chapterId}`}
                    className="flex flex-col items-center justify-center py-4 bg-[#0f0f0f] border border-zinc-800/50 rounded-lg hover:bg-red-600 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] group transition-all duration-300 active:scale-90"
                  >
                    <span className="text-zinc-600 group-hover:text-red-200 text-[9px] mb-1 uppercase tracking-widest font-black">EP</span>
                    <span className="text-white font-black text-lg group-hover:scale-110 transition-transform">{ep.chapterName}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
             <div className="bg-[#0a0a0a]/50 backdrop-blur-2xl p-10 rounded-xl border border-white/5 sticky top-32">
               <h3 className="text-white font-black uppercase tracking-[0.3em] mb-10 text-xs border-b border-zinc-900 pb-4">Production Info</h3>
               <div className="space-y-10">
                 <div>
                   <span className="text-zinc-600 block text-[10px] uppercase font-black tracking-[0.3em] mb-2">Director & Studio</span>
                   <span className="text-zinc-200 font-black text-sm uppercase tracking-widest">Dzeck Premium Studio</span>
                 </div>
                 <div>
                   <span className="text-zinc-600 block text-[10px] uppercase font-black tracking-[0.3em] mb-2">Release Status</span>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     <span className="text-green-500 font-black uppercase tracking-widest text-xs">Now Streaming</span>
                   </div>
                 </div>
                 <div>
                   <span className="text-zinc-600 block text-[10px] uppercase font-black tracking-[0.3em] mb-2">Available Languages</span>
                   <div className="flex gap-2">
                     <span className="bg-zinc-800/50 px-2 py-1 rounded text-[10px] font-black text-zinc-400">EN</span>
                     <span className="bg-zinc-800/50 px-2 py-1 rounded text-[10px] font-black text-zinc-400">ID</span>
                     <span className="bg-zinc-800/50 px-2 py-1 rounded text-[10px] font-black text-zinc-400">CN</span>
                   </div>
                 </div>
                 <div className="pt-8 border-t border-zinc-900">
                    <button className="w-full py-4 bg-zinc-800/50 hover:bg-zinc-800 text-white rounded-md font-black text-[10px] uppercase tracking-[0.4em] transition-all border border-white/5">
                      Add to My List
                    </button>
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
