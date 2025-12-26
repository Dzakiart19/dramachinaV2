
import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle } from 'lucide-react';
import { Drama, Episode } from '../types';
import { apiService } from '../services/api';

interface MovieCardProps {
  drama: Drama;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ drama, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const imageUrl = drama.coverWap || drama.cover || `https://picsum.photos/seed/${drama.bookId}/300/450`;

  useEffect(() => {
    if (isHovered && !previewUrl) {
      const loadPreview = async () => {
        try {
          const episodes = await apiService.getAllEpisodes(drama.bookId);
          if (episodes && episodes.length > 0) {
            const firstEp = episodes[0];
            const videoPath = firstEp.cdnList?.[0]?.videoPathList?.[0]?.videoPath;
            if (videoPath) setPreviewUrl(videoPath);
          }
        } catch (err) {
          console.warn("Failed to load preview:", err);
        }
      };
      loadPreview();
    }
  }, [isHovered, drama.bookId, previewUrl]);

  useEffect(() => {
    if (isHovered && videoRef.current && previewUrl) {
      const video = videoRef.current;
      if (previewUrl.includes('.m3u8')) {
        if (window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls();
          hls.loadSource(previewUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
          return () => hls.destroy();
        }
      } else {
        video.src = previewUrl;
        video.play().catch(() => {});
      }
    }
  }, [isHovered, previewUrl]);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsHovered(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  };

  return (
    <a 
      href={`#/detail/${drama.bookId}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative aspect-[2/3] overflow-hidden rounded-xl bg-[#141414] transition-all duration-500 hover:scale-110 hover:z-20 shadow-2xl hover:shadow-red-600/20 block border border-white/5 hover:border-red-600/30 ${className}`}
    >
      <img 
        src={imageUrl} 
        alt={drama.bookName}
        className={`w-full h-full object-cover transition-all duration-700 ${isHovered && previewUrl ? 'opacity-0 scale-110' : 'opacity-100 group-hover:scale-110'}`}
        loading="lazy"
      />

      {isHovered && previewUrl && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500"
        />
      )}
      
      {/* Premium Netflix-style hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-all duration-500 flex flex-col justify-end p-6 backdrop-blur-[1px] ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <div className={`transition-all duration-500 ease-out ${isHovered ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'}`}>
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
