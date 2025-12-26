
import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, Volume2, VolumeX } from 'lucide-react';
import { Drama } from '../types';

interface MovieCardProps {
  drama: Drama;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ drama, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const imageUrl = drama.coverWap || drama.cover || `https://picsum.photos/seed/${drama.bookId}/300/450`;
  
  // Simulated preview video since the API doesn't provide one yet
  // Using a sample video for demonstration
  const videoUrl = drama.previewVideo || "https://assets.mixkit.co/videos/preview/mixkit-curvy-road-through-a-lush-forest-41388-large.mp4";

  useEffect(() => {
    if (isHovered) {
      hoverTimer.current = setTimeout(() => {
        setShowVideo(true);
      }, 800); // Show video after 800ms of hover
    } else {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      setShowVideo(false);
    }
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, [isHovered]);

  return (
    <a 
      href={`#/detail/${drama.bookId}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
      />

      {showVideo && (
        <div className="absolute inset-0 z-10 bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="absolute bottom-20 right-4 z-30 p-2 rounded-full bg-black/50 border border-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      )}
      
      {/* Premium Netflix-style hover overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 backdrop-blur-[1px]">
        <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-90 group-hover:scale-100 transition-transform duration-500 delay-100">
              <PlayCircle size={24} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-green-500 text-[10px] font-black tracking-widest uppercase drop-shadow-sm">98% Match</span>
              <span className="text-white text-[8px] font-black opacity-80 uppercase tracking-[0.2em]">Ultra HD 4K</span>
            </div>
          </div>
          <h3 className="text-white font-black text-sm md:text-base line-clamp-1 mb-2 uppercase tracking-tighter">
            {drama.bookName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-[9px] font-black px-2 py-0.5 border border-red-600/30 rounded-sm bg-red-600/10 uppercase tracking-widest">TOP 10</span>
            <div className="h-1 w-1 bg-zinc-600 rounded-full"></div>
            <span className="text-zinc-300 text-[9px] font-black uppercase tracking-widest">{drama.chapterCount} Episodes</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default MovieCard;
