import React, { useState, useEffect, useRef } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { cardshowLogoDatabase } from '@/lib/cardshowDNA';
import { ChevronDown } from 'lucide-react';

// Logo component with fallback and tooltip
const LogoWithFallback = ({ imageUrl, logoName, className, dnaCode }: { 
  imageUrl: string, 
  logoName: string, 
  className?: string,
  dnaCode: string
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted/50 border border-dashed border-muted-foreground/30 rounded-md text-xs text-muted-foreground transition-all duration-200 hover:bg-muted/70`}>
        <span className="font-mono text-center px-1">{logoName}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted/30 rounded-md animate-pulse`}>
        <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <img 
        src={imageUrl}
        alt={logoName}
        className={className}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
      />
      {/* DNA code tooltip */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover border rounded-md px-2 py-1 text-xs text-popover-foreground shadow-lg whitespace-nowrap z-50">
          {dnaCode}
        </div>
      </div>
    </div>
  );
};

interface LogoSelectorDropdownProps {
  onThemeChange?: (themeId: string) => void;
}

export const LogoSelectorDropdown = ({ onThemeChange }: LogoSelectorDropdownProps) => {
  const { settings, saveSettings } = useAppSettings();
  const { setLogoTheme, currentLogoCode, getThemeByDNA } = useTeamTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  // Use first 20 logos from database (matching the design guide)
  const availableLogos = cardshowLogoDatabase.slice(0, 20);

  // Find logo by DNA code
  const findLogoByDNA = (dnaCode: string) => {
    return availableLogos.find(logo => logo.dnaCode === dnaCode) || availableLogos[0];
  };

  // Initialize selected logo
  const [selectedLogo, setSelectedLogo] = useState(() => {
    if (currentLogoCode) {
      return findLogoByDNA(currentLogoCode);
    }
    return availableLogos[0];
  });

  // Update selected logo when current logo code changes
  useEffect(() => {
    if (currentLogoCode) {
      const found = findLogoByDNA(currentLogoCode);
      setSelectedLogo(found);
    }
  }, [currentLogoCode]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogoSelect = (logo: typeof selectedLogo) => {
    setSelectedLogo(logo);
    setLogoTheme(logo.dnaCode);
    
    // Save theme to persistent storage
    saveSettings({ theme: `logo-${logo.dnaCode.toLowerCase()}` });
    onThemeChange?.(`logo-${logo.dnaCode.toLowerCase()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button 
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 cursor-pointer outline-none focus:outline-none border-none bg-transparent p-2 rounded-lg transition-all duration-300"
      >
        <LogoWithFallback 
          imageUrl={selectedLogo.imageUrl}
          logoName={selectedLogo.displayName}
          dnaCode={selectedLogo.dnaCode}
          className="h-16 w-40 object-contain" 
        />
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-all duration-300 opacity-0 group-hover:opacity-100 ${isOpen ? 'rotate-180 opacity-100' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 w-[calc(100vw-8rem)] max-w-7xl max-h-[500px] bg-background/95 backdrop-blur-xl border border-border/30 rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="p-4 border-b border-border/20 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
            <h3 className="text-lg font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Choose Your Logo
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select a logo to customize your theme
            </p>
          </div>

          {/* Logo Grid */}
          <div className="p-6 overflow-y-auto max-h-[400px]">
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-4">
              {availableLogos.map((logo) => {
                const isSelected = selectedLogo.dnaCode === logo.dnaCode;
                const theme = getThemeByDNA(logo.dnaCode);
                
                return (
                  <button
                    key={logo.dnaCode}
                    onClick={() => handleLogoSelect(logo)}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-border/20 hover:border-primary/50 bg-card'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Logo */}
                      <div className="w-full h-16 flex items-center justify-center">
                        <LogoWithFallback 
                          imageUrl={logo.imageUrl}
                          logoName={logo.displayName}
                          dnaCode={logo.dnaCode}
                          className={`max-w-full max-h-full object-contain ${
                            logo.dnaCode === 'CRD_GRADIENT_MULTI' ? 'max-h-12' : ''
                          }`}
                        />
                      </div>
                      
                      {/* 4 Color Dots - matching design guide exactly */}
                      <div className="flex justify-center space-x-1">
                        {theme && [
                          { color: theme.colors.primary, size: 'w-3 h-3' },
                          { color: theme.colors.secondary, size: 'w-2.5 h-2.5' },
                          { color: theme.colors.accent, size: 'w-2 h-2' },
                          { color: theme.colors.neutral, size: 'w-1.5 h-1.5' }
                        ].map((dot, index) => (
                          <div
                            key={index}
                            className={`${dot.size} rounded-full border border-white/20 shadow-sm`}
                            style={{ backgroundColor: dot.color }}
                            title={`${['Primary', 'Secondary', 'Accent', 'Neutral'][index]}: ${dot.color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};