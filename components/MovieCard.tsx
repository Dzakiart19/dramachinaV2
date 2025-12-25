
import React from 'react';
import { PlayCircle } from 'lucide-react';
import { Drama } from '../types';

interface MovieCardProps {
  drama: Drama;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ drama, className = "" }) => {
  const imageUrl = drama.coverWap || drama.cover || `https://picsum.photos/seed/${drama.bookId}/300/450`;

  return (
    <a 
      href={`#/detail/${drama.bookId}`}
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900 transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.5)] ring-1 ring-white/5 hover:ring-blue-500/50 block ${className}`}
    >
      <div className="aspect-[2/3] relative w-full">
        <img 
          src={imageUrl} 
          alt={drama.bookName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glassmorphism Info Badge */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/10 backdrop-blur-md border border-white/10 px-2 sm:px-3 py-1 rounded-full">
           <span className="text-[8px] sm:text-[10px] font-black text-white tracking-widest">4K HD</span>
        </div>

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/50">
            <PlayCircle size={32} className="text-white ml-1" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <h3 className="text-white font-black text-xs sm:text-base md:text-lg lg:text-xl line-clamp-2 leading-none tracking-tighter mb-1 sm:mb-2 drop-shadow-2xl">
            {drama.bookName}
          </h3>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
             <div className="flex gap-0.5 sm:gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
             </div>
             <span className="text-[6px] sm:text-[8px] md:text-[10px] text-blue-400 font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">Live</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default MovieCard;
