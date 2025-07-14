
import React, { useState } from "react";
import { NavLinks } from "./navbar/NavLinks";
import { NavActions } from "./navbar/NavActions";
import { LogoSelector } from "./navbar/LogoSelector";
import { MobileNav } from "./navbar/MobileNav";
import { Menu, X } from "lucide-react";
import { useTeamTheme } from "@/hooks/useTeamTheme";

// Dynamic navbar background based on current theme
const getNavbarDynamicStyles = (currentPalette: any, customHeaderColor?: string | null, navbarMode?: string) => {
  // Away team mode - MLB jersey gray
  if (navbarMode === 'away') {
    return {
      background: 'linear-gradient(135deg, rgba(192, 192, 192, 0.95) 0%, rgba(176, 176, 176, 0.92) 50%, rgba(200, 200, 200, 0.97) 100%), repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)',
      borderColor: 'rgba(160, 160, 160, 0.4)',
      backdropFilter: 'blur(16px) saturate(120%)'
    };
  }

  // Home team mode - Light background
  if (navbarMode === 'home') {
    return {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.92) 50%, rgba(255, 255, 255, 0.97) 100%)',
      borderColor: 'rgba(203, 213, 225, 0.4)',
      backdropFilter: 'blur(16px) saturate(180%)'
    };
  }

  if (!currentPalette) {
    return {
      backgroundColor: 'rgba(20, 20, 22, 0.85)', // fallback
      borderColor: 'rgba(255, 255, 255, 0.1)'
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
      background: `linear-gradient(135deg, ${hexToRgba(customHeaderColor, 0.25)} 0%, ${hexToRgba(customHeaderColor, 0.15)} 50%, ${hexToRgba(customHeaderColor, 0.08)} 100%)`,
      borderColor: hexToRgba(customHeaderColor, 0.35),
      backdropFilter: 'blur(12px) saturate(180%)'
    };
  }
  
  // Create subtle background gradient using theme colors
  const primary = currentPalette.colors.primary;
  const secondary = currentPalette.colors.secondary;
  
  return {
    background: `linear-gradient(135deg, ${hexToRgba(primary, 0.08)} 0%, ${hexToRgba(secondary, 0.05)} 100%)`,
    borderColor: hexToRgba(primary, 0.15)
  };
};

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentPalette, setTheme, customHeaderColor, navbarMode } = useTeamTheme();
  
  const dynamicStyles = getNavbarDynamicStyles(currentPalette, customHeaderColor, navbarMode);

  const getNavbarClassName = () => {
    let baseClass = "navbar-themed w-full overflow-hidden border-b backdrop-blur-sm";
    
    if (navbarMode === 'home') {
      baseClass += " navbar-home-team";
    } else if (navbarMode === 'away') {
      baseClass += " navbar-away-team";
    }
    
    return baseClass;
  };

  return (
    <>
      <div 
        className={getNavbarClassName()}
        style={{
          ...dynamicStyles,
          borderBottomColor: dynamicStyles.borderColor
        }}
      >
        {/* Mobile-first container with proper touch targets */}
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          {/* Logo - Always visible */}
          <div className="flex items-center">
            <LogoSelector onThemeChange={(themeId) => setTheme(themeId)} />
          </div>

          {/* Desktop navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop NavActions */}
            <div className="hidden md:block">
              <NavActions />
            </div>
            
            {/* Mobile hamburger menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Gradient divider */}
        <div className="flex min-h-px w-full" style={{ background: `linear-gradient(90deg, hsl(var(--theme-accent) / 0.2), hsl(var(--theme-accent) / 0.1))` }} />
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};
