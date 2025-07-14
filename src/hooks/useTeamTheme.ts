
import { useState, useEffect } from 'react';
import { useColorThemes } from './useColorThemes';
import { useNavbarTheme, type NavbarMode } from './useNavbarTheme';
import type { TeamPalette } from '@/lib/teamPalettes';

export interface TeamTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string; // Changed from 'text' to 'neutral'
  };
  hsl: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  usage?: any;
}

export const useTeamTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [customHeaderColor, setCustomHeaderColor] = useState<string | null>(null);
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);
  
  const { colorThemes } = useColorThemes();
  const { navbarMode, setNavbarMode, getNavbarModeClass, isSpecialMode } = useNavbarTheme();

  useEffect(() => {
    // Load theme from localStorage on initialization
    const savedTheme = localStorage.getItem('crd-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    if (currentTheme) {
      localStorage.setItem('crd-theme', currentTheme);
    }
  }, [currentTheme]);

  // Helper function to convert hex to HSL
  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  useEffect(() => {
    // Find the color palette that matches the current theme
    const theme = colorThemes.find((theme) => theme.id === currentTheme);
    
    if (theme) {
      setCurrentPalette({
        id: theme.id,
        name: theme.name,
        description: `${theme.name} theme with ${theme.primary_example_team} colors`,
        colors: {
          primary: theme.primary_color,
          secondary: theme.secondary_color,
          accent: theme.accent_color,
          neutral: theme.text_color,
        },
        hsl: {
          primary: hexToHsl(theme.primary_color),
          secondary: hexToHsl(theme.secondary_color),
          accent: hexToHsl(theme.accent_color),
          neutral: hexToHsl(theme.text_color),
        },
        usage: {
          primary: 'Brand primary color',
          secondary: 'Supporting color',
          accent: 'Highlight and CTAs',
          neutral: 'Text and UI elements'
        }
      });
    } else {
      // Reset to default palette if theme is not found
      setCurrentPalette(null);
    }
  }, [currentTheme, colorThemes]);

  const setTheme = (themeId: string) => {
    setCurrentTheme(themeId);
  };

  const setHeaderColor = (color: string | null) => {
    setCustomHeaderColor(color);
  };

  // Apply theme function for compatibility
  const applyTheme = (palette: TeamPalette) => {
    const newPalette: ColorPalette = {
      id: palette.id,
      name: palette.name,
      description: palette.description,
      colors: {
        primary: palette.colors.primary,
        secondary: palette.colors.secondary,
        accent: palette.colors.accent,
        neutral: palette.colors.neutral,
      },
      hsl: palette.hsl,
      usage: palette.usage
    };
    setCurrentPalette(newPalette);
    
    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', palette.hsl.primary);
    root.style.setProperty('--theme-secondary', palette.hsl.secondary);
    root.style.setProperty('--theme-accent', palette.hsl.accent);
    root.style.setProperty('--theme-neutral', palette.hsl.neutral);
  };

  // Compatibility properties for existing components
  const availablePalettes = colorThemes.map(theme => ({
    id: theme.id,
    name: theme.name,
    description: `${theme.name} theme`,
    colors: {
      primary: theme.primary_color,
      secondary: theme.secondary_color,
      accent: theme.accent_color,
      neutral: theme.text_color,
    },
    hsl: {
      primary: hexToHsl(theme.primary_color),
      secondary: hexToHsl(theme.secondary_color),
      accent: hexToHsl(theme.accent_color),
      neutral: hexToHsl(theme.text_color),
    }
  }));

  const setLogoTheme = setTheme; // Alias for compatibility
  const currentLogoCode = currentTheme; // Alias for compatibility

  return {
    currentTheme,
    setTheme,
    customHeaderColor,
    setHeaderColor,
    currentPalette,
    
    // Navbar theme functionality
    navbarMode,
    setNavbarMode,
    getNavbarModeClass,
    isHomeTeamMode: navbarMode === 'home',
    isAwayTeamMode: navbarMode === 'away',
    isPinstripeMode: navbarMode === 'pinstripes',
    isSpecialNavbarMode: isSpecialMode,

    // Compatibility properties
    applyTheme,
    availablePalettes,
    setLogoTheme,
    currentLogoCode
  };
};
