
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
      onClick={(e) => {
        requestAnimationFrame(() => {
          window.location.hash = `/detail/${drama.bookId}`;
        });
      }}
      className={`group relative aspect-[2/3] overflow-hidden rounded-xl bg-[#141414] transition-all duration-500 hover:scale-110 hover:z-20 shadow-2xl hover:shadow-red-600/20 block border border-white/5 hover:border-red-600/30 ${className}`}
    >
      <img 
        src={imageUrl} 
        alt={drama.bookName}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Premium Netflix-style hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 backdrop-blur-[2px]">
        <div className="translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-xl scale-90 group-hover:scale-100 transition-transform duration-500 delay-100">
              <PlayCircle size={24} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-green-500 text-[10px] font-black tracking-widest uppercase">98% Match</span>
              <span className="text-white text-[8px] font-black opacity-60 uppercase tracking-[0.2em]">Ultra HD 4K</span>
            </div>
          </div>
          <h3 className="text-white font-black text-sm md:text-lg line-clamp-1 mb-2 uppercase tracking-tighter">
            {drama.bookName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-white text-[9px] font-black px-2 py-0.5 border border-white/30 rounded-sm bg-black/40 uppercase tracking-widest">13+</span>
            <div className="h-1 w-1 bg-zinc-600 rounded-full"></div>
            <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">Premium</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default MovieCard;
