import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'VIP', path: '/vip' },
    { label: 'Trending', path: '/trending' },
    { label: 'Indo Dub', path: '/dub' },
    { label: 'For You', path: '/foryou' },
    { label: 'Popular', path: '/popular' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
      isScrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-10 lg:gap-16">
          {/* Logo */}
          <a href="#/" className="flex items-center gap-2 group shrink-0">
            <span className="text-3xl md:text-4xl font-black tracking-tighter text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]">
              DZECK
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={`#${link.path}`}
                className={`text-[13px] tracking-wide transition-all duration-500 font-bold uppercase ${
                  isActive(link.path)
                    ? 'text-white border-b-2 border-red-600 pb-1'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block group">
            <a href="#/search" className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-all duration-300">
              <Search size={20} strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-widest">Search</span>
            </a>
          </div>
          
          <a href="#/search" className="md:hidden text-white p-2">
            <Search size={22} strokeWidth={2.5} />
          </a>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-all border border-white/5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-white"
            >
              <X size={32} />
            </button>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={`#${link.path}`}
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-bold tracking-tight transition-all ${
                  isActive(link.path) ? 'text-red-600' : 'text-white hover:text-gray-300'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
