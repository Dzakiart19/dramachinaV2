
import React, { useState } from 'react';
import { Search, Home, TrendingUp, Globe, Menu, X, MonitorPlay } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Search', icon: Search, path: '/search' },
    { label: 'Trending', icon: TrendingUp, path: '/trending' },
    { label: 'Indo Dub', icon: Globe, path: '/dub' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-lg border-b border-slate-800/50 shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 p-1.5 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 transform group-hover:scale-105">
            <MonitorPlay size={24} className="text-white" />
          </div>
          <span className="text-lg md:text-xl font-black tracking-tight hidden sm:inline">
            DZECK<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">STREAM</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <a
                key={link.label}
                href={`#${link.path}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm whitespace-nowrap ${
                  active
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-slate-950 border-b border-slate-800/50 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <a
                  key={link.label}
                  href={`#${link.path}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${
                    active
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon size={20} />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
