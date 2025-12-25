
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
      className={`group relative overflow-hidden rounded-xl bg-slate-800 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/10 block ${className}`}
    >
      <div className="aspect-[2/3] relative">
        <img 
          src={imageUrl} 
          alt={drama.bookName}
          className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
          <div className="mb-2">
            <PlayCircle size={40} className="text-blue-500 mb-2" />
          </div>
          <h3 className="text-white font-bold leading-tight line-clamp-2">
            {drama.bookName}
          </h3>
          {drama.chapterCount && (
            <p className="text-slate-300 text-xs mt-1">
              {drama.chapterCount} Episodes
            </p>
          )}
        </div>

        {/* Info Badge */}
        {drama.playCount && (
          <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-blue-400 border border-slate-700">
            {drama.playCount} Views
          </div>
        )}
      </div>
      
      {/* Fallback title for always-on display on smaller screens */}
      <div className="p-2 md:hidden">
        <h3 className="text-white text-xs font-medium truncate">{drama.bookName}</h3>
      </div>
    </a>
  );
};

export default MovieCard;
