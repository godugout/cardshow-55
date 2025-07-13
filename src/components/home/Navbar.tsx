
import React, { useState } from "react";
import { NavLinks } from "./navbar/NavLinks";
import { NavActions } from "./navbar/NavActions";
import { LogoSelector } from "./navbar/LogoSelector";
import { MobileNav } from "./navbar/MobileNav";
import { Menu, X } from "lucide-react";
import { useTeamTheme } from "@/hooks/useTeamTheme";

// Dynamic navbar background based on current theme
const getNavbarDynamicStyles = (currentPalette: any, customHeaderColor?: string | null) => {
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
      background: `linear-gradient(135deg, ${hexToRgba(customHeaderColor, 0.12)} 0%, ${hexToRgba(customHeaderColor, 0.06)} 100%)`,
      borderColor: hexToRgba(customHeaderColor, 0.18)
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

const getDividerColorClasses = (color: string) => {
  const colorMap = {
    orange: 'bg-orange-500/15 border-t-orange-500/20',
    red: 'bg-red-500/15 border-t-red-500/20',
    green: 'bg-green-500/15 border-t-green-500/20',
    yellow: 'bg-yellow-500/15 border-t-yellow-500/20',
    blue: 'bg-blue-500/15 border-t-blue-500/20',
    gray: 'bg-gray-500/15 border-t-gray-500/20',
    emerald: 'bg-emerald-500/15 border-t-emerald-500/20',
    purple: 'bg-purple-500/15 border-t-purple-500/20',
    slate: 'bg-slate-500/15 border-t-slate-500/20',
    amber: 'bg-amber-500/15 border-t-amber-500/20',
    cyan: 'bg-cyan-500/15 border-t-cyan-500/20',
    indigo: 'bg-indigo-500/15 border-t-indigo-500/20',
  };
  return colorMap[color] || 'bg-gray-500/15 border-t-gray-500/20';
};

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentPalette, setTheme, customHeaderColor } = useTeamTheme();
  
  const dynamicStyles = getNavbarDynamicStyles(currentPalette, customHeaderColor);

  return (
    <>
      <div 
        className="navbar-themed w-full overflow-hidden border-b backdrop-blur-sm"
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
