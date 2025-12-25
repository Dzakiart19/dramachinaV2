
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { apiService } from '../services/api';
import { Episode, Drama } from '../types';
import { ChevronLeft, ChevronRight, Settings, Loader2, AlertCircle, RefreshCcw, ExternalLink, Play, Monitor, ShieldAlert } from 'lucide-react';

interface PlayerProps {
  bookId: string;
  episodeId: string;
}

declare global {
  interface Window {
    Hls: any;
  }
}

const Player: React.FC<PlayerProps> = ({ bookId, episodeId }) => {
  const [drama, setDrama] = useState<Drama | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [isBlockedByGoogle, setIsBlockedByGoogle] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<number>(1080);
  const [selectedCdnIndex, setSelectedCdnIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const connectionTimeoutRef = useRef<number | null>(null);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    setVideoError(false);
    setIsBlockedByGoogle(false);
    
    try {
      const [dramaData, epsData] = await Promise.all([
        apiService.getDramaDetail(bookId).catch(() => null),
        apiService.getAllEpisodes(bookId).catch(() => [])
      ]);

      if (dramaData && dramaData.data) {
        setDrama(dramaData.data.book);
      }
      
      if (epsData && Array.isArray(epsData) && epsData.length > 0) {
        setEpisodes(epsData);
      } else {
        throw new Error("Daftar episode tidak ditemukan.");
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat data video.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [bookId]);

  const currentEpisode = useMemo(() => {
    if (!episodes || episodes.length === 0) return null;
    return episodes.find(ep => ep.chapterId === episodeId) || episodes[0];
  }, [episodes, episodeId]);

  const currentVideoSource = useMemo(() => {
    if (!currentEpisode || !currentEpisode.cdnList || currentEpisode.cdnList.length === 0) return null;
    const validIndex = Math.min(selectedCdnIndex, currentEpisode.cdnList.length - 1);
    const pathList = currentEpisode.cdnList[validIndex]?.videoPathList || [];
    return pathList.find(v => v.quality === selectedQuality) || pathList[0];
  }, [currentEpisode, selectedQuality, selectedCdnIndex]);

  useEffect(() => {
    if (!currentVideoSource || !videoRef.current || loading) return;

    const video = videoRef.current;
    const url = currentVideoSource.videoPath;
    
    // Set a timeout to detect if the connection is refused by Google/Sandbox
    if (connectionTimeoutRef.current) window.clearTimeout(connectionTimeoutRef.current);
    
    // Reset state when source changes
    setIsBlockedByGoogle(false);
    
    connectionTimeoutRef.current = window.setTimeout(() => {
      // Check if video is stuck in initial state
      if (video.networkState === 3 || (video.readyState === 0 && !video.paused)) {
        setIsBlockedByGoogle(true);
      }
    }, 4000);

    const handleError = () => {
      console.error("Video error detected");
      setIsBlockedByGoogle(true);
    };

    video.addEventListener('error', handleError);

    if (url.includes('.m3u8')) {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, (event: any, data: any) => {
          if (data.fatal) {
            console.error("HLS fatal error:", data.type);
            setIsBlockedByGoogle(true);
          }
        });
        return () => {
          hls.destroy();
          video.removeEventListener('error', handleError);
          if (connectionTimeoutRef.current) window.clearTimeout(connectionTimeoutRef.current);
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        setIsBlockedByGoogle(true);
      }
    } else {
      video.src = url;
    }

    return () => {
      video.removeEventListener('error', handleError);
      if (connectionTimeoutRef.current) window.clearTimeout(connectionTimeoutRef.current);
    };
  }, [currentVideoSource, loading]);

  const availableQualities = useMemo(() => {
    if (!currentEpisode || !currentEpisode.cdnList || currentEpisode.cdnList.length === 0) return [];
    const validIndex = Math.min(selectedCdnIndex, currentEpisode.cdnList.length - 1);
    return currentEpisode.cdnList[validIndex]?.videoPathList?.map(v => v.quality) || [];
  }, [currentEpisode, selectedCdnIndex]);

  const getCdnLabel = (index: number): string => {
    if (!currentEpisode || !currentEpisode.cdnList) return 'Server';
    const cdn = currentEpisode.cdnList[index];
    const domain = cdn?.cdnDomain?.toLowerCase() || '';
    
    // Detect language/dub type from domain or position
    if (domain.includes('dub') || domain.includes('indo')) return 'Sulih Suara Indonesia';
    if (index === 0) return 'Server 1';
    if (index === 1) return 'Sulih Suara';
    return `Server ${index + 1}`;
  };

  const nextEpisode = useMemo(() => {
    if (!currentEpisode || episodes.length === 0) return null;
    const currentIndex = episodes.findIndex(e => e.chapterId === currentEpisode.chapterId);
    return currentIndex !== -1 && currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;
  }, [episodes, currentEpisode]);

  const prevEpisode = useMemo(() => {
    if (!currentEpisode || episodes.length === 0) return null;
    const currentIndex = episodes.findIndex(e => e.chapterId === currentEpisode.chapterId);
    return currentIndex > 0 ? episodes[currentIndex - 1] : null;
  }, [episodes, currentEpisode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[90vh] bg-[#020617]">
        <Loader2 className="animate-spin text-blue-500 mb-6" size={60} />
        <div className="text-center">
          <p className="text-white font-black text-xl mb-2">DZECK STREAM</p>
          <p className="text-slate-500 text-sm animate-pulse">Tunggu sebentar maaf agak lama karena pakai gratisan 😅</p>
        </div>
      </div>
    );
  }

  if (error || !currentEpisode) {
    return (
      <div className="flex flex-col items-center justify-center h-[90vh] bg-[#020617] px-6 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-black text-white mb-4">Akses Gagal</h2>
        <p className="text-slate-400 mb-10 max-w-sm">{error || "Server tidak merespon permintaan Anda."}</p>
        <button onClick={loadContent} className="bg-white text-black px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl">
          COBA LAGI
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#020617] min-h-screen pb-20">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Navigation Header */}
        <div className="flex items-center gap-5 mb-8">
          <a href={`#/detail/${bookId}`} className="group p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-white hover:bg-blue-600 hover:border-blue-400 transition-all">
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </a>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-600 text-[9px] font-black px-1.5 py-0.5 rounded text-white tracking-widest uppercase">Streaming</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{drama?.bookName}</span>
            </div>
            <h1 className="text-white text-xl md:text-3xl font-black leading-none">EPS {currentEpisode.chapterName}</h1>
          </div>
        </div>

        {/* Enhanced Player Container */}
        <div className="relative aspect-video w-full bg-slate-950 rounded-[2rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] ring-1 ring-slate-800 group">
          {isBlockedByGoogle ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl p-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="relative mb-8">
                <Monitor size={80} className="text-blue-500/20" />
                <AlertCircle size={40} className="text-blue-500 absolute -bottom-2 -right-2 animate-pulse" />
              </div>
              <h3 className="text-white text-2xl font-black mb-4">Akses Video Terbatas</h3>
              <p className="text-slate-400 text-sm md:text-base max-w-md mb-10 leading-relaxed font-medium">
                Pemutar video diblokir oleh sistem keamanan browser atau sandbox. <br/>
                Klik tombol di bawah untuk menonton di tab baru atau ganti server.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <a 
                  href={currentVideoSource?.videoPath} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/30"
                >
                  <ExternalLink size={20} />
                  BUKA DI TAB BARU
                </a>
                <button 
                  onClick={() => {
                    setIsBlockedByGoogle(false);
                    const nextCdn = (selectedCdnIndex + 1) % currentEpisode.cdnList.length;
                    setSelectedCdnIndex(nextCdn);
                  }}
                  className="px-8 py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-700 transition-all"
                >
                  Ganti Server
                </button>
              </div>
            </div>
          ) : (
            <video 
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-full object-contain"
              poster={drama?.coverWap || drama?.cover}
              onError={() => setIsBlockedByGoogle(true)}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              playsInline
            />
          )}
        </div>

        {/* Video Info & Controls */}
        <div className="mt-8 flex flex-col gap-6">
          {/* CDN/Dubbing Selection */}
          {currentEpisode && currentEpisode.cdnList && currentEpisode.cdnList.length > 1 && (
            <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-2xl border border-slate-800 flex-wrap">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Server/Dubbing</span>
              <div className="flex gap-1.5">
                {currentEpisode.cdnList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedCdnIndex(idx); setIsBlockedByGoogle(false); }}
                    className={`px-4 py-2 text-[9px] font-black rounded-xl transition-all whitespace-nowrap ${
                      selectedCdnIndex === idx 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {getCdnLabel(idx)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Episodes Navigation & Quality */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left: Episodes Navigation */}
            <div className="md:col-span-7 flex flex-wrap items-center gap-4">
              {prevEpisode && (
                <a 
                  href={`#/player/${bookId}/${prevEpisode.chapterId}`}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-900/60 hover:bg-slate-800 text-white rounded-2xl font-black text-sm border border-slate-800 transition-all hover:-translate-y-1"
                >
                  <ChevronLeft size={20} /> EP SEBELUMNYA
                </a>
              )}
              {nextEpisode && (
                <a 
                  href={`#/player/${bookId}/${nextEpisode.chapterId}`}
                  className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-all hover:scale-105 shadow-xl shadow-blue-600/20"
                >
                  EP SELANJUTNYA <ChevronRight size={20} />
                </a>
              )}
            </div>

            {/* Right: Quality & Extra Actions */}
            <div className="md:col-span-5 flex items-center justify-end gap-4">
              <div className="flex items-center gap-3 p-2 bg-slate-900/40 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Quality</span>
                <div className="flex gap-1.5">
                  {availableQualities.map(q => (
                    <button
                      key={q}
                      onClick={() => { setSelectedQuality(q); setIsBlockedByGoogle(false); }}
                      className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${
                        selectedQuality === q 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {q}P
                    </button>
                  ))}
                </div>
              </div>
              {currentVideoSource && (
                <a 
                  href={currentVideoSource.videoPath} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-4 bg-slate-800/80 text-white rounded-2xl hover:bg-blue-600 transition-all group"
                  title="Bypass Mode (Buka di Tab Baru)"
                >
                  <ExternalLink size={24} className="group-hover:rotate-12 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Episode Selector Grid */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              Pilih Episode
            </h3>
            <div className="text-slate-500 font-bold bg-slate-900/80 px-5 py-2 rounded-full border border-slate-800 text-xs">
              {episodes.length} TOTAL EPS
            </div>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
            {episodes.map((ep) => (
              <a 
                key={ep.chapterId}
                href={`#/player/${bookId}/${ep.chapterId}`}
                className={`flex flex-col items-center justify-center py-5 rounded-2xl border-2 transition-all duration-300 ${
                  ep.chapterId === episodeId 
                    ? 'bg-blue-600 border-blue-400 text-white font-black scale-110 shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] z-10' 
                    : 'bg-slate-900/30 border-slate-800/50 text-slate-600 hover:bg-slate-800 hover:border-slate-500 hover:text-white'
                }`}
              >
                <span className={`text-[9px] font-black mb-1 opacity-50`}>EPS</span>
                <span className="text-lg">{ep.chapterName}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
