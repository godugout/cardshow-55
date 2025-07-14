import { useState, useEffect } from 'react';
import { useColorThemes } from './useColorThemes';
import { useNavbarTheme, type NavbarMode } from './useNavbarTheme';

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
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
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

  useEffect(() => {
    // Find the color palette that matches the current theme
    const palette = colorThemes.find((theme) => theme.id === currentTheme);
    
    if (palette) {
      setCurrentPalette({
        id: palette.id,
        name: palette.name,
        colors: {
          primary: palette.primary_color,
          secondary: palette.secondary_color,
          accent: palette.accent_color,
          text: palette.text_color,
        },
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

  // Update the return object to include navbar theme functionality
  return {
    currentTheme,
    setTheme,
    customHeaderColor,
    setHeaderColor,
    currentPalette,
    
    // Add navbar theme functionality
    navbarMode,
    setNavbarMode,
    getNavbarModeClass,
    isHomeTeamMode: navbarMode === 'home',
    isAwayTeamMode: navbarMode === 'away',
    isPinstripeMode: navbarMode === 'pinstripes',
    isSpecialNavbarMode: isSpecialMode
  };
};
