
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

import { historyService } from '../services/history';

const Player: React.FC<PlayerProps> = ({ bookId, episodeId }) => {
  const [drama, setDrama] = useState<Drama | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  // ... existing states ...

  // Save to history when content is loaded and valid
  useEffect(() => {
    if (drama && currentEpisode) {
      historyService.saveProgress(drama, currentEpisode);
    }
  }, [drama, currentEpisode]);
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
      // Parallel loading of detail and episodes
      const [dramaData, epsData] = await Promise.all([
        apiService.getDramaDetail(bookId).catch(() => null),
        apiService.getAllEpisodes(bookId).catch(() => [])
      ]);

      if (dramaData && dramaData.data) {
        setDrama(dramaData.data.book);
      }
      
      if (epsData && Array.isArray(epsData) && epsData.length > 0) {
        setEpisodes(epsData);
        // Pre-fetch video source for the current episode to speed up loading
        const initialEp = epsData.find(ep => ep.chapterId === episodeId) || epsData[0];
        if (initialEp && initialEp.cdnList && initialEp.cdnList.length > 0) {
           // We could trigger a hidden pre-fetch here if needed
        }
      } else {
        throw new Error("Daftar episode tidak ditemukan.");
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat data video.");
    } finally {
      // Small delay removed to make it faster
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

    // AUTO-SWITCH logic for Server 1 if it's consistently failing
    const isServer1 = selectedCdnIndex === 0;
    
    connectionTimeoutRef.current = window.setTimeout(() => {
      // Check if video is stuck in initial state
      if (video.networkState === 3 || (video.readyState === 0 && !video.paused)) {
        console.warn("Potential video block detected, triggering fallback.");
        if (isServer1 && currentEpisode && currentEpisode.cdnList.length > 1) {
          console.log("Auto-switching from failing Server 1 to Server 2");
          setSelectedCdnIndex(1);
        } else {
          setIsBlockedByGoogle(true);
        }
      }
    }, 5000); // 5 seconds for Server 1 is plenty to know it's dead

    const handleError = (e: any) => {
      console.error("Video error detected", e);
      // Logic for automatic switch if Server 1 fails
      if (isServer1 && currentEpisode && currentEpisode.cdnList.length > 1) {
        console.log("Switching to Server 2 due to playback error");
        setSelectedCdnIndex(1);
        setIsBlockedByGoogle(false);
      } else {
        setIsBlockedByGoogle(true);
      }
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
            switch (data.type) {
              case window.Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case window.Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
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
    
    // Improved detection for Indo Dub
    const isIndo = domain.includes('dub') || domain.includes('indo') || domain.includes('id');
    if (isIndo) return 'Indo Dub';
    if (index === 0) return 'Server 1';
    if (index === 1) return 'Server 2';
    return `Server ${index + 1}`;
  };

  const nextEpisode = useMemo(() => {
    if (!currentEpisode || episodes.length === 0) return null;
    const currentIndex = episodes.findIndex(e => e.chapterId === currentEpisode.chapterId);
    // Find next episode with "Sulih Suara" or "Dub" if we are in Indo Dub mode
    return currentIndex !== -1 && currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;
  }, [episodes, currentEpisode]);

  const prevEpisode = useMemo(() => {
    if (!currentEpisode || episodes.length === 0) return null;
    const currentIndex = episodes.findIndex(e => e.chapterId === currentEpisode.chapterId);
    return currentIndex > 0 ? episodes[currentIndex - 1] : null;
  }, [episodes, currentEpisode]);

  // Handle auto-next episode when current one ends
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (nextEpisode) {
        window.location.href = `#/player/${bookId}/${nextEpisode.chapterId}`;
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [nextEpisode, bookId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-black">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
        <p className="mt-6 text-red-600 font-bold tracking-[0.3em] uppercase animate-pulse">DZECK STREAM</p>
      </div>
    );
  }

  if (error || !currentEpisode) {
    return (
      <div className="flex flex-col items-center justify-center h-[90vh] bg-black px-6 text-center">
        <ShieldAlert size={64} className="text-red-600 mb-6" />
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Playback Failed</h2>
        <p className="text-zinc-500 mb-10 max-w-sm font-medium">{error || "Server tidak merespon permintaan Anda."}</p>
        <button onClick={loadContent} className="bg-red-600 text-white px-10 py-3 rounded-md font-bold transition-all hover:bg-red-700 active:scale-95 shadow-xl uppercase tracking-widest">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-20">
      <div className="container mx-auto py-8 px-4 md:px-12 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex items-start gap-4">
            <a href={`#/detail/${bookId}`} className="mt-1 p-3 bg-zinc-900 border border-zinc-800 rounded-md text-white hover:bg-zinc-800 transition-all">
              <ChevronLeft size={24} />
            </a>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-600 text-[10px] font-black tracking-[0.2em] uppercase">Streaming</span>
                <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">{drama?.bookName}</span>
              </div>
              <h1 className="text-white text-2xl md:text-4xl font-black uppercase tracking-tighter">Episode {currentEpisode.chapterName}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-zinc-900/80 px-4 py-2 rounded-md border border-zinc-800 text-zinc-400 text-xs font-black uppercase tracking-widest">
               {selectedQuality}P
             </div>
             <div className="bg-zinc-900/80 px-4 py-2 rounded-md border border-zinc-800 text-zinc-400 text-xs font-black uppercase tracking-widest">
               {getCdnLabel(selectedCdnIndex)}
             </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-zinc-950 rounded-md overflow-hidden shadow-2xl ring-1 ring-zinc-800 group">
          {isBlockedByGoogle ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl p-8 text-center border border-red-900/50">
              <div className="relative mb-6">
                <ShieldAlert size={60} className="text-red-600 animate-pulse" />
                <div className="absolute inset-0 bg-red-600/20 blur-2xl rounded-full"></div>
              </div>
              <h3 className="text-white text-2xl font-black mb-4 uppercase tracking-tighter">Playback Error</h3>
              <p className="text-zinc-400 text-sm max-w-md mb-10 font-medium leading-relaxed">
                Gagal memuat video. Sumber video mungkin sedang sibuk atau diblokir. Silakan coba ganti server atau gunakan link eksternal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto">
                <button 
                  onClick={() => {
                    setIsBlockedByGoogle(false);
                    const nextCdn = (selectedCdnIndex + 1) % currentEpisode.cdnList.length;
                    setSelectedCdnIndex(nextCdn);
                  }}
                  className="flex-1 px-8 py-4 bg-red-600 text-white rounded-md font-black hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] uppercase tracking-widest active:scale-95"
                >
                  Switch Server
                </button>
                <a 
                  href={currentVideoSource?.videoPath} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 text-white px-8 py-4 rounded-md font-black transition-all hover:bg-zinc-700 border border-zinc-700 uppercase tracking-widest active:scale-95"
                >
                  External
                </a>
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

        {/* Controls */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              {/* Navigation */}
              <div className="flex flex-wrap gap-4">
                {prevEpisode && (
                  <a 
                    href={`#/player/${bookId}/${prevEpisode.chapterId}`}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-bold text-sm border border-zinc-800 transition-all uppercase tracking-widest"
                  >
                    <ChevronLeft size={20} /> Prev Episode
                  </a>
                )}
                {nextEpisode && (
                  <a 
                    href={`#/player/${bookId}/${nextEpisode.chapterId}`}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold text-sm transition-all shadow-lg uppercase tracking-widest"
                  >
                    Next Episode <ChevronRight size={20} />
                  </a>
                )}
              </div>

              {/* Episode Selection revamped for compact grid */}
              <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl p-6 rounded-xl border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-900/50 pb-4">
                  <div className="flex items-end gap-3">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Episodes</h3>
                    <span className="text-red-600 font-black uppercase tracking-[0.2em] text-[8px] mb-1">Collection</span>
                  </div>
                  <span className="text-zinc-600 font-black text-[9px] uppercase tracking-[0.2em] bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800">{episodes.length} ITEMS</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {episodes.map((ep) => (
                    <a 
                      key={ep.chapterId}
                      href={`#/player/${bookId}/${ep.chapterId}`}
                      className={`flex flex-col items-center justify-center aspect-square rounded-lg border transition-all duration-500 font-black relative overflow-hidden group ${
                        ep.chapterId === episodeId 
                          ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-105 z-10' 
                          : 'bg-[#141414] border-zinc-800/50 text-zinc-500 hover:border-red-600/50 hover:text-white hover:bg-red-600/5'
                      }`}
                    >
                      <span className={`text-[8px] uppercase tracking-widest mb-0.5 ${ep.chapterId === episodeId ? 'text-red-200' : 'text-zinc-700 group-hover:text-red-400'}`}>EP</span>
                      <span className="text-sm md:text-base tracking-tighter">{ep.chapterName}</span>
                      {ep.chapterId === episodeId && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/40 animate-pulse"></div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
           </div>

           {/* Settings Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-900/50 p-6 rounded-md border border-zinc-800">
                <h4 className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Video Settings</h4>
                
                <div className="space-y-6">
                  <div>
                    <span className="text-white text-sm font-bold block mb-3">Server Selector</span>
                    <div className="flex flex-wrap gap-2">
                      {currentEpisode.cdnList.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setSelectedCdnIndex(idx); setIsBlockedByGoogle(false); }}
                          className={`px-4 py-2 text-[10px] font-bold rounded-md transition-all border ${
                            selectedCdnIndex === idx 
                            ? 'bg-red-600 border-red-600 text-white' 
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {getCdnLabel(idx)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-white text-sm font-bold block mb-3">Resolution</span>
                    <div className="flex flex-wrap gap-2">
                      {availableQualities.map(q => (
                        <button
                          key={q}
                          onClick={() => { setSelectedQuality(q); setIsBlockedByGoogle(false); }}
                          className={`px-4 py-2 text-[10px] font-bold rounded-md transition-all border ${
                            selectedQuality === q 
                            ? 'bg-red-600 border-red-600 text-white' 
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {q}P
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
