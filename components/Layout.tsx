
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <footer className="bg-slate-950 py-10 border-t border-slate-800 text-slate-500 text-sm text-center">
        <div className="container mx-auto px-4">
          <p className="mb-2">© 2024 Dzeck Stream. All rights reserved.</p>
          <p className="text-xs text-slate-600">Streaming drama terlengkap di Asia Tenggara</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
