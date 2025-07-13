
import React, { useState } from "react";
import { NavLinks } from "./navbar/NavLinks";
import { NavActions } from "./navbar/NavActions";
import { LogoSelector } from "./navbar/LogoSelector";
import { MobileNav } from "./navbar/MobileNav";
import { Menu, X } from "lucide-react";

const getNavbarColorClasses = (color: string) => {
  // Enhanced navbar styling - uses secondary color for background per new strategy
  return 'navbar-themed-bg border-b border-[hsl(var(--theme-navbar-border)/0.2)]';
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
  const [currentTheme, setCurrentTheme] = useState('sf-orange');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className={`navbar-themed w-full overflow-hidden ${getNavbarColorClasses(currentTheme)}`}>
        {/* Mobile-first container with proper touch targets */}
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          {/* Logo - Always visible */}
          <div className="flex items-center">
            <LogoSelector onThemeChange={setCurrentTheme} />
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
