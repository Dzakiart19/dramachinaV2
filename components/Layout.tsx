
import React, { useEffect } from 'react';
import Navbar from './Navbar';
// @ts-ignore
import astronautBg from '../attached_assets/stock_images/elegant_cinematic_as_af8fdd35.jpg';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    // Analytics tracking (Unique daily visitor per browser)
    try {
      const stats = JSON.parse(localStorage.getItem('dzeck_stats') || '{"total":0,"daily":{},"devices":{"mobile":0,"desktop":0}}');
      const lastVisit = localStorage.getItem('dzeck_last_session');
      const today = new Date().toISOString().split('T')[0];
      
      // Device detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const deviceType = isMobile ? 'mobile' : 'desktop';

      if (lastVisit !== today) {
        stats.total = (stats.total || 0) + 1;
        stats.daily[today] = (stats.daily[today] || 0) + 1;
        
        // Track device stats
        if (!stats.devices) stats.devices = { mobile: 0, desktop: 0 };
        stats.devices[deviceType] = (stats.devices[deviceType] || 0) + 1;
        
        localStorage.setItem('dzeck_stats', JSON.stringify(stats));
        localStorage.setItem('dzeck_last_session', today);
      }
    } catch (e) {
      console.error('Stats tracking failed', e);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      {/* Cinematic Background Image with improved layering */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none block"
        style={{
          backgroundImage: `url(${astronautBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      {/* Dynamic Gradient Overlays for Depth */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">
          <div className="animate-in fade-in duration-1000">
            {children}
          </div>
        </main>
        <footer className="bg-[#0f0f0f]/90 backdrop-blur-2xl py-20 border-t border-zinc-900/50 text-zinc-500 text-sm relative z-10">
          <div className="container mx-auto px-4 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="space-y-4">
                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Navigation</h4>
                <div className="flex flex-col gap-2">
                  <span className="hover:text-white transition-colors cursor-pointer">Audio & Subtitle</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Pusat Bantuan</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Investor Relations</span>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Legal</h4>
                <div className="flex flex-col gap-2">
                  <span className="hover:text-white transition-colors cursor-pointer">Syarat Penggunaan</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Privasi</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Cookie Preferences</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-8 border-t border-zinc-900/50">
              <div>
                <p className="mb-2 text-zinc-600 font-medium">© 2024 DZECK STREAM Entertainment</p>
                <p className="text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-black">Premium Asian Drama Streaming</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
                  <span className="text-[10px] font-black">FB</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
                  <span className="text-[10px] font-black">IG</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
