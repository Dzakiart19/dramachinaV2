
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        {children}
      </main>
      <footer className="bg-black py-16 border-t border-zinc-900 text-zinc-500 text-sm">
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
  );
};

export default Layout;
