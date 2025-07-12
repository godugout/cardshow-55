
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Home, ImageIcon, Palette, X } from 'lucide-react';
import { LogoSelector } from '@/components/home/navbar/LogoSelector';
import { CRDGradientLogo } from '@/components/home/navbar/CRDGradientLogo';
import { useEnhancedNavbar } from '@/hooks/useEnhancedNavbar';

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
  
  // Get prefersReducedMotion first
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { 
    isVisible, 
    isScrolled, 
    scrollMetrics, 
    isSpecialRoute 
  } = useEnhancedNavbar({
    threshold: 20,
    hideOffset: 100,
    scrollVelocityThreshold: 8,
    showDelay: prefersReducedMotion ? 0 : 150,
    hideDelay: prefersReducedMotion ? 0 : 300
  });

  const isActive = (path: string) => location.pathname === path;
  const isCRDRoute = location.pathname.startsWith('/create/');

  // Calculate dynamic blur and opacity based on scroll velocity
  const blurIntensity = Math.min(scrollMetrics.velocity * 2 + 8, 20);
  const backgroundOpacity = Math.min(0.8 + scrollMetrics.velocity * 0.1, 0.98);
  
  const getTransitionClass = () => {
    if (prefersReducedMotion) return 'transition-transform duration-200';
    return scrollMetrics.isScrolling 
      ? 'transition-all duration-200 ease-out' 
      : 'transition-all duration-500 ease-out';
  };

  return (
    <nav 
      className={`
        navbar-themed fixed top-0 left-0 right-0 z-50
        ${getTransitionClass()}
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${isScrolled 
          ? `backdrop-blur-[${blurIntensity}px] shadow-lg` 
          : 'backdrop-blur-sm'
        }
      `}
      style={{ 
        height: 'var(--navbar-height)',
        transform: `translateY(${isVisible ? '0' : '-100%'})`,
        backdropFilter: isScrolled ? `blur(${blurIntensity}px)` : 'blur(4px)'
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo Selector with enhanced animation */}
          <div className={`
            flex items-center transition-all duration-300
            ${scrollMetrics.isScrolling ? 'scale-[0.98]' : 'scale-100'}
            ${!prefersReducedMotion && isScrolled ? 'drop-shadow-sm' : ''}
          `}>
            <div className={`transition-transform duration-200 ${!prefersReducedMotion ? 'hover:scale-105' : ''}`}>
              <LogoSelector onThemeChange={setCurrentTheme} currentTheme={currentTheme} />
            </div>
            {isCRDRoute && (
              <div className="flex items-center animate-fade-in">
                <X className="w-4 h-4 text-themed-secondary/60 mx-1 transition-colors duration-200" />
                <div className={`transition-transform duration-200 ${!prefersReducedMotion ? 'hover:scale-105' : ''}`}>
                  <CRDGradientLogo />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links with staggered animation */}
          <div className={`
            flex items-center space-x-8 transition-all duration-300
            ${scrollMetrics.isScrolling ? 'scale-[0.98]' : 'scale-100'}
          `}>
              <Link
                to="/"
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                  transition-all duration-200 group
                  ${isActive('/') 
                    ? 'text-themed-active bg-themed-active/10' 
                    : 'text-themed-secondary hover-themed'
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <Home className={`w-4 h-4 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`} />
                <span>Home</span>
              </Link>

              <Link
                to="/create"
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                  transition-all duration-200 group
                  ${isActive('/create') 
                    ? 'text-themed-active bg-themed-active/10' 
                    : 'text-themed-secondary hover-themed'
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <Plus className={`w-4 h-4 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110 group-hover:rotate-90' : ''}`} />
                <span>Create</span>
              </Link>

              <Link
                to="/gallery"
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                  transition-all duration-200 group
                  ${isActive('/gallery') 
                    ? 'text-themed-active bg-themed-active/10' 
                    : 'text-themed-secondary hover-themed'
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <ImageIcon className={`w-4 h-4 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`} />
                <span>Gallery</span>
              </Link>

              <Link
                to="/studio"
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                  transition-all duration-200 group
                  ${isActive('/studio') 
                    ? 'text-themed-active bg-themed-active/10' 
                    : 'text-themed-secondary hover-themed'
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <Palette className={`w-4 h-4 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`} />
                <span>Studio</span>
              </Link>
            </div>
        </div>
      </div>
    </nav>
  );
};
