
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Home, ImageIcon, Palette, X } from 'lucide-react';
import { LogoSelector } from '@/components/home/navbar/LogoSelector';
import { CRDGradientLogo } from '@/components/home/navbar/CRDGradientLogo';

const getNavbarColorClasses = (color: string) => {
  const colorMap = {
    orange: 'bg-gradient-to-r from-orange-500/5 to-orange-400/5 border-b-orange-500/10',
    red: 'bg-gradient-to-r from-red-500/5 to-red-400/5 border-b-red-500/10',
    green: 'bg-gradient-to-r from-green-500/5 to-green-400/5 border-b-green-500/10',
    yellow: 'bg-gradient-to-r from-yellow-500/5 to-yellow-400/5 border-b-yellow-500/10',
    blue: 'bg-gradient-to-r from-blue-500/5 to-blue-400/5 border-b-blue-500/10',
    gray: 'bg-gradient-to-r from-gray-500/5 to-gray-400/5 border-b-gray-500/10',
    emerald: 'bg-gradient-to-r from-emerald-500/5 to-emerald-400/5 border-b-emerald-500/10',
    purple: 'bg-gradient-to-r from-purple-500/5 to-purple-400/5 border-b-purple-500/10',
    slate: 'bg-gradient-to-r from-slate-500/5 to-slate-400/5 border-b-slate-500/10',
    amber: 'bg-gradient-to-r from-amber-500/5 to-amber-400/5 border-b-amber-500/10',
    cyan: 'bg-gradient-to-r from-cyan-500/5 to-cyan-400/5 border-b-cyan-500/10',
    indigo: 'bg-gradient-to-r from-indigo-500/5 to-indigo-400/5 border-b-indigo-500/10',
  };
  return colorMap[color] || 'bg-gradient-to-r from-gray-500/5 to-gray-400/5 border-b-gray-500/10';
};

export const Navbar = () => {
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState('sf-orange');
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Hide navbar by default on studio and create routes
  const isStudioOrCreateRoute = location.pathname === '/studio' || location.pathname.startsWith('/create');
  const [showNavbar, setShowNavbar] = useState(!isStudioOrCreateRoute);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActive = (path: string) => location.pathname === path;
  const isCRDRoute = location.pathname.startsWith('/create/');

  return (
    <nav className={`navbar-themed sticky top-0 z-50 transition-transform duration-300 ${
      showNavbar ? 'translate-y-0' : '-translate-y-full'
    } ${isScrolled ? 'backdrop-blur-md bg-opacity-90' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Selector */}
          <div className="flex items-center">
            <LogoSelector onThemeChange={setCurrentTheme} />
            {isCRDRoute && (
              <>
                <X className="w-4 h-4 text-themed-secondary/60 mx-1" />
                <CRDGradientLogo />
              </>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-themed-active' 
                    : 'text-themed-secondary hover-themed'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/create"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/create') 
                    ? 'text-themed-active' 
                    : 'text-themed-secondary hover-themed'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </Link>

              <Link
                to="/gallery"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/gallery') 
                    ? 'text-themed-active' 
                    : 'text-themed-secondary hover-themed'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gallery</span>
              </Link>

              <Link
                to="/studio"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/studio') 
                    ? 'text-themed-active' 
                    : 'text-themed-secondary hover-themed'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Studio</span>
              </Link>
            </div>
        </div>
      </div>
    </nav>
  );
};
