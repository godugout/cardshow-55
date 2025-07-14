import React, { useState, useEffect, useRef } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { cardshowLogoDatabase } from '@/lib/cardshowDNA';
import { ChevronDown, X } from 'lucide-react';

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
    </div>
  );
};

interface LogoSelectorDropdownProps {
  onThemeChange?: (themeId: string) => void;
}

export const LogoSelectorDropdown = ({ onThemeChange }: LogoSelectorDropdownProps) => {
  const { settings, saveSettings } = useAppSettings();
  const { setLogoTheme, currentLogoCode, getThemeByDNA, setCustomHeaderBgColor, customHeaderColor, customHeaderColorType } = useTeamTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const mouseLeaveTimerRef = useRef<NodeJS.Timeout>();
  
  // Use first 20 logos from database (matching the design guide)
  const availableLogos = cardshowLogoDatabase.slice(0, 20);

  // Updated creative names for distinct visual themes - renamed Carbon Elite to Steel Force
  const logoNames: Record<string, string> = {
    'CRD_GRADIENT_MULTI': 'Fusion Force',
    'CS_GREEN_SPARKLE': 'Emerald Spark',
    'CS_ORANGE_SCRIPT': 'Flame Script',
    'CS_REDBLUE_BLOCK': 'Liberty Block',
    'CS_GREEN_SCRIPT_YELLOW': 'Thunder Strike',
    'CS_BROWN_ORANGE_RETRO': 'Vintage Vibe',
    'CS_BLUE_ORANGE_OUTLINE': 'Coastal Storm',
    'CS_RED_SCRIPT_BLUE': 'Cardinal Script',
    'CS_BLUE_SCRIPT': 'Azure Elite',
    'CS_BLACK_TEAL_SPARKLE': 'Neon Rush',
    'CS_GREEN_SPARKLE_SCRIPT': 'Elite Emerald',
    'CS_ORANGE_BLACK_OUTLINE': 'Power Strike',
    'CS_RED_BLOCK': 'Crimson Bold',
    'CS_RED_SCRIPT_CORAL': 'Sunset Coral',
    'CS_RED_MODERN': 'Steel Force', // Changed from Carbon Elite
    'CS_RED_SCRIPT_CLASSIC': 'Vintage Burgundy',
    'CS_BLACK_BOLD': 'Shadow Force',
    'CS_PURPLE_OUTLINE': 'Royal Edge',
    'CS_ORANGE_BLACK_BLOCK': 'Thunder Block',
    'CS_BLUE_WHITE_SCRIPT': 'Sky Script'
  };

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

  // Close dropdown on outside click (but not on logo selection)
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

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    mouseLeaveTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // 300ms delay to prevent accidental closing
  };

  // Handle mouse enter (cancel close timer)
  const handleMouseEnter = () => {
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current);
      }
    };
  }, []);

  const handleLogoSelect = (logo: typeof selectedLogo) => {
    setSelectedLogo(logo);
    setLogoTheme(logo.dnaCode);
    
    // Save theme to persistent storage
    saveSettings({ theme: `logo-${logo.dnaCode.toLowerCase()}` });
    onThemeChange?.(`logo-${logo.dnaCode.toLowerCase()}`);
    // Removed setIsOpen(false) - dropdown stays open on selection
  };

  const handleCloseClick = () => {
    setIsOpen(false);
  };

  const handleColorDotClick = (event: React.MouseEvent, color: string, colorType: string) => {
    event.stopPropagation();
    setCustomHeaderBgColor(color, colorType);
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
          className="h-12 w-28 object-contain" 
        />
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-all duration-300 opacity-0 group-hover:opacity-100 ${isOpen ? 'rotate-180 opacity-100' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          className="absolute top-full left-0 mt-2 w-[min(90vw,1200px)] bg-background/95 backdrop-blur-xl border border-border/30 rounded-xl shadow-xl z-50 animate-in slide-in-from-top-2 duration-200"
        >
          {/* Header with Close Button */}
          <div className="relative p-4 border-b border-border/20 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
            <h3 className="text-lg font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pick a logo <span className="text-sm text-muted-foreground font-normal ml-2">Customize your Cardshow theme</span>
            </h3>
            {/* Close Button (X) in upper right */}
            <button
              onClick={handleCloseClick}
              className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted/50 transition-colors duration-200 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Logo Grid - No scroll, fit all logos */}
          <div className="p-8">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-6">
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
                      <div className="w-full h-[73px] flex items-center justify-center">
                        <LogoWithFallback
                          imageUrl={logo.imageUrl}
                          logoName={logo.displayName}
                          dnaCode={logo.dnaCode}
                          className={`max-w-full object-contain ${
                            logo.dnaCode === 'CRD_GRADIENT_MULTI' ? 'max-h-12' : 'max-h-[67px]'
                          }`}
                        />
                      </div>
                      
                      {/* 4 Color Dots - clickable for header customization */}
                      <div className="flex justify-center items-center space-x-1">
                        {theme && [
                          { color: theme.colors.primary, size: 'w-3 h-3', type: 'primary' },
                          { color: theme.colors.secondary, size: 'w-2.5 h-2.5', type: 'secondary' },
                          { color: theme.colors.accent, size: 'w-2 h-2', type: 'accent' },
                          { color: theme.colors.neutral, size: 'w-1.5 h-1.5', type: 'neutral' }
                        ].map((dot, index) => {
                          const isActiveHeaderColor = customHeaderColor === dot.color && customHeaderColorType === dot.type;
                          return (
                            <div
                              key={index}
                              onClick={(e) => handleColorDotClick(e, dot.color, dot.type)}
                              className={`${dot.size} rounded-full border shadow-sm transition-all duration-200 cursor-pointer hover:scale-105 hover:opacity-80 ${
                                isActiveHeaderColor 
                                  ? 'border-white border-2 ring-2 ring-white/50' 
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                              style={{ backgroundColor: dot.color }}
                              title={`Click to use ${['Primary', 'Secondary', 'Accent', 'Neutral'][index]} (${dot.color}) for header background`}
                            />
                          );
                        })}
                      </div>

                      {/* Creative Name */}
                      <div 
                        className="text-xs font-medium text-center mt-2"
                        style={{ color: theme?.colors.primary }}
                      >
                        {logoNames[logo.dnaCode] || 'Elite Squad'}
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
