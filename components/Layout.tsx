
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
      {/* Cinematic Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: `url(${astronautBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Gradient Overlay for better readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">
          {children}
        </main>
        <footer className="bg-black/80 backdrop-blur-md py-16 border-t border-zinc-900 text-zinc-500 text-sm relative z-10">
          <div className="container mx-auto px-4 md:px-10">
            <div className="flex gap-10 mb-10">
              <span className="hover:underline cursor-pointer">Audio & Subtitle</span>
              <span className="hover:underline cursor-pointer">Pusat Bantuan</span>
              <span className="hover:underline cursor-pointer">Syarat Penggunaan</span>
              <span className="hover:underline cursor-pointer">Privasi</span>
            </div>
            <p className="mb-2 text-zinc-600">© 2024 DZECK STREAM Entertainment</p>
            <p className="text-xs text-zinc-700 uppercase tracking-widest font-bold">Premium Asian Drama Streaming</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
