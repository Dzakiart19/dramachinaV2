
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
      className={`group relative aspect-[2/3] overflow-hidden rounded-md bg-zinc-900 transition-all duration-300 hover:scale-110 hover:z-10 shadow-lg hover:shadow-2xl block ${className}`}
    >
      <img 
        src={imageUrl} 
        alt={drama.bookName}
        className="w-full h-full object-cover transition-transform duration-500"
        loading="lazy"
      />
      
      {/* Netflix-style hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
              <PlayCircle size={20} fill="currentColor" />
            </div>
            <span className="text-white text-[10px] font-bold border border-white/40 px-1.5 py-0.5 rounded uppercase tracking-wider">4K Ultra HD</span>
          </div>
          <h3 className="text-white font-bold text-sm md:text-base line-clamp-1 mb-1">
            {drama.bookName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-xs font-bold">98% Match</span>
            <span className="text-white text-[10px] px-1 border border-white/50 rounded-sm">13+</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default MovieCard;
