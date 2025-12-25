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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-black shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo */}
          <a href="#/" className="flex items-center gap-2 group shrink-0">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-transform duration-300 group-hover:scale-105">
              DZECK
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={`#${link.path}`}
                className={`text-sm transition-colors duration-300 font-medium ${
                  isActive(link.path)
                    ? 'text-white'
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <a href="#/search" className="text-white hover:text-gray-300 transition-colors p-2">
            <Search size={22} strokeWidth={2.5} />
          </a>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-all"
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
