import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Home, Palette, Menu } from 'lucide-react';
import { LogoSelector } from '@/components/home/navbar/LogoSelector';
import { useEnhancedNavbar } from '@/hooks/useEnhancedNavbar';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { DevLoginButton } from '@/components/auth/DevLoginButton';
import { AdminTrigger } from '@/components/admin/AdminTrigger';
import { MobileNav } from '@/components/home/navbar/MobileNav';

// Dynamic navbar background based on current theme
const getNavbarDynamicStyles = (currentPalette: any, customHeaderColor?: string | null, isHomeTeamMode?: boolean) => {
  // Home team mode overrides everything with light background
  if (isHomeTeamMode) {
    return {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.92) 50%, rgba(255, 255, 255, 0.97) 100%)',
      borderColor: 'rgba(203, 213, 225, 0.4)',
      backdropFilter: 'blur(16px) saturate(180%)'
    };
  }

  if (!currentPalette) {
    return {
      background: 'linear-gradient(135deg, rgba(20, 20, 22, 0.08) 0%, rgba(20, 20, 22, 0.05) 50%, rgba(20, 20, 22, 0.12) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.15)'
    };
  }
  
  // Convert hex to rgba for transparency
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  // Use custom header color if set, otherwise use theme colors
  if (customHeaderColor) {
    return {
      background: `linear-gradient(135deg, ${hexToRgba(customHeaderColor, 0.08)} 0%, ${hexToRgba(customHeaderColor, 0.05)} 50%, ${hexToRgba(customHeaderColor, 0.12)} 100%)`,
      borderColor: hexToRgba(customHeaderColor, 0.15),
      backdropFilter: 'blur(12px) saturate(180%)'
    };
  }
  
  // Create subtle background gradient using theme colors
  const primary = currentPalette.colors.primary;
  const secondary = currentPalette.colors.secondary;
  
  return {
    background: `linear-gradient(135deg, ${hexToRgba(primary, 0.08)} 0%, ${hexToRgba(secondary, 0.05)} 50%, ${hexToRgba(primary, 0.12)} 100%)`,
    borderColor: hexToRgba(primary, 0.15),
    backdropFilter: 'blur(12px) saturate(180%)'
  };
};

export const Navbar = () => {
  const location = useLocation();
  const { currentPalette, setTheme, customHeaderColor, isHomeTeamMode } = useTeamTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { 
    isVisible, 
    isScrolled, 
    scrollMetrics 
  } = useEnhancedNavbar({
    threshold: 20,
    hideOffset: 100,
    scrollVelocityThreshold: 8,
    showDelay: prefersReducedMotion ? 0 : 150,
    hideDelay: prefersReducedMotion ? 0 : 300
  });

  const isActive = (path: string) => {
    if (path === '/collections') {
      return location.pathname === path || location.pathname.startsWith('/collections');
    }
    return location.pathname === path;
  };
  
  const getTransitionClass = () => {
    if (prefersReducedMotion) return 'transition-transform duration-200';
    return scrollMetrics.isScrolling 
      ? 'transition-all duration-200 ease-out' 
      : 'transition-all duration-500 ease-out';
  };

  const dynamicStyles = getNavbarDynamicStyles(currentPalette, customHeaderColor, isHomeTeamMode);

  return (
    <>
      <nav 
        className={`
          ${isHomeTeamMode ? 'navbar-home-team' : ''}
          fixed top-0 left-0 right-0 z-50 border-b
          ${getTransitionClass()}
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
          ${isScrolled ? 'shadow-lg' : ''}
        `}
        style={{ 
          height: 'var(--navbar-height)',
          transform: `translateY(${isVisible ? '0' : '-100%'})`,
          ...dynamicStyles,
          borderBottomColor: dynamicStyles.borderColor
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section with Admin Trigger */}
            <div className={`
              flex items-center gap-2 transition-all duration-300
              ${scrollMetrics.isScrolling ? 'scale-[0.98]' : 'scale-100'}
              ${!prefersReducedMotion && isScrolled ? 'drop-shadow-sm' : ''}
            `}>
              <AdminTrigger />
              <div className={`transition-transform duration-200 ${!prefersReducedMotion ? 'hover:scale-105' : ''}`}>
                <LogoSelector onThemeChange={(themeId) => setTheme(themeId)} />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`
                md:hidden flex items-center justify-center
                w-11 h-11 rounded-lg
                ${isHomeTeamMode ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-100' : 'text-themed-secondary hover-themed'}
                transition-all duration-200
                ${!prefersReducedMotion ? 'hover:scale-105' : ''}
                focus:outline-none focus:ring-2 focus:ring-themed-active/20
              `}
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Navigation Links */}
            <div className={`
              hidden md:flex items-center space-x-2 lg:space-x-6 transition-all duration-300
              ${scrollMetrics.isScrolling ? 'scale-[0.98]' : 'scale-100'}
            `}>
              <Link
                to="/"
                className={`
                  flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium
                  min-h-[44px] min-w-[44px]
                  transition-all duration-200 group
                  ${isActive('/') 
                    ? (isHomeTeamMode 
                        ? 'text-slate-800 bg-slate-200/60' 
                        : 'text-themed-active bg-themed-active/10'
                      )
                    : (isHomeTeamMode 
                        ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-100' 
                        : 'text-themed-secondary hover-themed'
                      )
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <Home className={`w-4 h-4 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`} />
                <span className="hidden lg:inline">Home</span>
              </Link>

              <Link
                to="/create"
                className={`
                  flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium
                  min-h-[44px] min-w-[44px]
                  transition-all duration-200 group
                  ${isActive('/create') 
                    ? (isHomeTeamMode 
                        ? 'text-slate-800 bg-slate-200/60' 
                        : 'text-themed-active bg-themed-active/10'
                      )
                    : (isHomeTeamMode 
                        ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-100' 
                        : 'text-themed-secondary hover-themed'
                      )
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <Plus className={`w-4 h-4 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110 group-hover:rotate-90' : ''}`} />
                <span className="hidden lg:inline">Create</span>
              </Link>

              <Link
                to="/collections"
                className={`
                  flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium
                  min-h-[44px] min-w-[44px]
                  transition-all duration-200 group
                  ${isActive('/collections') 
                    ? (isHomeTeamMode 
                        ? 'text-slate-800 bg-slate-200/60' 
                        : 'text-themed-active bg-themed-active/10'
                      )
                    : (isHomeTeamMode 
                        ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-100' 
                        : 'text-themed-secondary hover-themed'
                      )
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <span className="hidden lg:inline">Collections</span>
              </Link>

              <Link
                to="/studio"
                className={`
                  flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium
                  min-h-[44px] min-w-[44px]
                  transition-all duration-200 group
                  ${isActive('/studio') 
                    ? (isHomeTeamMode 
                        ? 'text-slate-800 bg-slate-200/60' 
                        : 'text-themed-active bg-themed-active/10'
                      )
                    : (isHomeTeamMode 
                        ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-100' 
                        : 'text-themed-secondary hover-themed'
                      )
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <Palette className={`w-4 h-4 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`} />
                <span className="hidden lg:inline">Studio</span>
              </Link>

              {/* Dev Login Button */}
              <div className="hidden xl:block">
                <DevLoginButton 
                  variant="outline" 
                  size="sm" 
                  className="text-xs min-h-[44px]"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};
