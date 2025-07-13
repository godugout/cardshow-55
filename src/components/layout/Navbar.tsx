import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Home, ImageIcon, Palette, X, Code2, Menu } from 'lucide-react';
import { LogoSelector } from '@/components/home/navbar/LogoSelector';
import { CRDGradientLogo } from '@/components/home/navbar/CRDGradientLogo';
import { useEnhancedNavbar } from '@/hooks/useEnhancedNavbar';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { DevLoginButton } from '@/components/auth/DevLoginButton';
import { AdminTrigger } from '@/components/admin/AdminTrigger';
import { MobileNav } from '@/components/home/navbar/MobileNav';

// Dynamic navbar background based on current theme
const getNavbarDynamicStyles = (currentPalette: any, isScrolled: boolean, blurIntensity: number) => {
  if (!currentPalette) {
    return {
      backgroundColor: 'rgba(20, 20, 22, 0.85)', // fallback
      borderColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: `blur(${blurIntensity}px)`
    };
  }
  
  // Create subtle background gradient using theme colors
  const primary = currentPalette.colors.primary;
  const secondary = currentPalette.colors.secondary;
  
  // Convert hex to rgba for transparency
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  // More opacity when scrolled
  const bgOpacity = isScrolled ? 0.12 : 0.08;
  const borderOpacity = isScrolled ? 0.25 : 0.15;
  
  return {
    background: `linear-gradient(135deg, ${hexToRgba(primary, bgOpacity)} 0%, ${hexToRgba(secondary, bgOpacity * 0.6)} 100%)`,
    borderColor: hexToRgba(primary, borderOpacity),
    backdropFilter: `blur(${blurIntensity}px)`
  };
};

export const Navbar = () => {
  const location = useLocation();
  const { currentPalette, setTheme } = useTeamTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
  
  // Get dynamic styles based on current theme
  const dynamicStyles = getNavbarDynamicStyles(currentPalette, isScrolled, blurIntensity);
  
  const getTransitionClass = () => {
    if (prefersReducedMotion) return 'transition-transform duration-200';
    return scrollMetrics.isScrolling 
      ? 'transition-all duration-200 ease-out' 
      : 'transition-all duration-500 ease-out';
  };

  return (
    <>
      <nav 
        className={`
          navbar-themed fixed top-0 left-0 right-0 z-50 border-b
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
            {/* Logo Selector with enhanced animation and Admin Trigger */}
            <div className={`
              flex items-center gap-2 transition-all duration-300
              ${scrollMetrics.isScrolling ? 'scale-[0.98]' : 'scale-100'}
              ${!prefersReducedMotion && isScrolled ? 'drop-shadow-sm' : ''}
            `}>
              {/* Admin Trigger - Hidden icon left of logo */}
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
                text-themed-secondary hover-themed
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
                    ? 'text-themed-active bg-themed-active/10' 
                    : 'text-themed-secondary hover-themed'
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
                    ? 'text-themed-active bg-themed-active/10' 
                    : 'text-themed-secondary hover-themed'
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <Plus className={`w-4 h-4 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110 group-hover:rotate-90' : ''}`} />
                <span className="hidden lg:inline">Create</span>
              </Link>

              <Link
                to="/gallery"
                className={`
                  flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium
                  min-h-[44px] min-w-[44px]
                  transition-all duration-200 group
                  ${isActive('/gallery') 
                    ? 'text-themed-active bg-themed-active/10' 
                    : 'text-themed-secondary hover-themed'
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <ImageIcon className={`w-4 h-4 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`} />
                <span className="hidden lg:inline">Gallery</span>
              </Link>

              <Link
                to="/studio"
                className={`
                  flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium
                  min-h-[44px] min-w-[44px]
                  transition-all duration-200 group
                  ${isActive('/studio') 
                    ? 'text-themed-active bg-themed-active/10' 
                    : 'text-themed-secondary hover-themed'
                  }
                  ${!prefersReducedMotion ? 'hover:scale-105 hover:shadow-sm' : ''}
                `}
              >
                <Palette className={`w-4 h-4 transition-transform duration-200 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`} />
                <span className="hidden lg:inline">Studio</span>
              </Link>

              {/* Dev Login Button - Only shows in development on larger screens */}
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