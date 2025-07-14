
import { useState, useCallback, useEffect } from 'react';
import { TeamPalette } from '@/lib/teamPalettes';
import {
  allPalettes,
  getPaletteById,
  generatePaletteCSSVars,
  createPaletteFromTeamColors
} from '@/lib/teamPalettes';

export const useTeamTheme = () => {
  const [currentPalette, setCurrentPalette] = useState<TeamPalette | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply theme to document
  const applyTheme = useCallback((palette: TeamPalette) => {
    if (!palette) return;

    setIsTransitioning(true);
    
    // Generate CSS variables
    const cssVars = generatePaletteCSSVars(palette);
    
    // Apply to document root
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Update state
    setCurrentPalette(palette);
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('selectedTeamPalette', JSON.stringify(palette));
    } catch (error) {
      console.warn('Could not save theme to localStorage:', error);
    }

    // End transition after a short delay
    setTimeout(() => setIsTransitioning(false), 300);
    
    console.log(`Applied theme: ${palette.name}`);
  }, []);

  // Set theme by ID
  const setTheme = useCallback((paletteOrId: TeamPalette | string) => {
    let palette: TeamPalette | null = null;
    
    if (typeof paletteOrId === 'string') {
      palette = getPaletteById(paletteOrId);
    } else {
      palette = paletteOrId;
    }
    
    if (palette) {
      applyTheme(palette);
    } else {
      console.warn('Theme not found:', paletteOrId);
    }
  }, [applyTheme]);

  // Reset to default theme
  const resetTheme = useCallback(() => {
    const defaultPalette = getPaletteById('dodgers');
    if (defaultPalette) {
      applyTheme(defaultPalette);
    }
  }, [applyTheme]);

  // Create custom theme from colors
  const createCustomTheme = useCallback((colors: {
    primary: string;
    secondary: string;
    accent?: string;
    neutral?: string;
  }) => {
    const customPalette = createPaletteFromTeamColors(colors);
    applyTheme(customPalette);
    return customPalette;
  }, [applyTheme]);

  // Load saved theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('selectedTeamPalette');
      if (saved) {
        const palette = JSON.parse(saved) as TeamPalette;
        setCurrentPalette(palette);
        applyTheme(palette);
      } else {
        // Apply default theme
        resetTheme();
      }
    } catch (error) {
      console.warn('Could not load saved theme:', error);
      resetTheme();
    }
  }, [applyTheme, resetTheme]);

  return {
    // Current state
    currentPalette,
    isTransitioning,
    
    // Theme management
    setTheme,
    applyTheme,
    resetTheme,
    createCustomTheme,
    
    // Available palettes
    allPalettes,
    getPaletteById,
    
    // Utilities
    generateCSSVars: generatePaletteCSSVars
  };
};
