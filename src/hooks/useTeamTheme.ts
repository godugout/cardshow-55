
import { useState, useMemo, useEffect } from 'react';
import { teamPalettes } from '@/lib/teamPalettes';

export type NavbarMode = 'normal' | 'home' | 'away';

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    neutral: string;
  };
  hsl: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  description: string;
  usage: {
    navbar: string;
    cards: string;
    buttons: string;
    text: string;
  };
}

const THEME_STORAGE_KEY = 'crd-current-theme';
const HEADER_COLOR_KEY = 'crd-custom-header-color';
const NAVBAR_MODE_KEY = 'crd-navbar-mode';

export const useTeamTheme = () => {
  const [currentTheme, setCurrentThemeState] = useState<string>('lakers');
  const [customHeaderColor, setCustomHeaderColorState] = useState<string>('');
  const [navbarMode, setNavbarModeState] = useState<NavbarMode>('normal');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const savedHeaderColor = localStorage.getItem(HEADER_COLOR_KEY);
    const savedNavbarMode = localStorage.getItem(NAVBAR_MODE_KEY) as NavbarMode;
    
    if (savedTheme && teamPalettes[savedTheme]) {
      setCurrentThemeState(savedTheme);
    }
    if (savedHeaderColor) {
      setCustomHeaderColorState(savedHeaderColor);
    }
    if (savedNavbarMode && ['normal', 'home', 'away'].includes(savedNavbarMode)) {
      setNavbarModeState(savedNavbarMode);
    }
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const palette = teamPalettes[currentTheme];
    if (!palette) return;

    const root = document.documentElement;
    
    // Apply theme colors as CSS variables
    root.style.setProperty('--theme-primary', palette.colors.primary);
    root.style.setProperty('--theme-secondary', palette.colors.secondary);
    root.style.setProperty('--theme-accent', palette.colors.accent);
    root.style.setProperty('--theme-text', palette.colors.text);
    
    // Navbar specific variables
    root.style.setProperty('--theme-navbar-bg', palette.colors.primary);
    root.style.setProperty('--theme-navbar-border', palette.colors.primary);
  }, [currentTheme]);

  const currentPalette = useMemo(() => {
    const palette = teamPalettes[currentTheme];
    if (!palette) return null;
    
    return {
      id: currentTheme,
      name: palette.name,
      colors: {
        ...palette.colors,
        neutral: palette.colors.neutral || palette.colors.text
      },
      hsl: palette.hsl || palette.colors,
      description: palette.description || '',
      usage: {
        navbar: 'Primary branding and navigation',
        cards: 'Card backgrounds and accents',
        buttons: 'Interactive elements',
        text: 'Text and typography'
      }
    } as ColorPalette;
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    if (teamPalettes[themeId]) {
      setCurrentThemeState(themeId);
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  };

  const setHeaderColor = (color: string) => {
    setCustomHeaderColorState(color);
    if (color) {
      localStorage.setItem(HEADER_COLOR_KEY, color);
    } else {
      localStorage.removeItem(HEADER_COLOR_KEY);
    }
  };

  const setNavbarMode = (mode: NavbarMode) => {
    setNavbarModeState(mode);
    localStorage.setItem(NAVBAR_MODE_KEY, mode);
  };

  const toggleNavbarMode = () => {
    const modes: NavbarMode[] = ['normal', 'home', 'away'];
    const currentIndex = modes.indexOf(navbarMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setNavbarMode(modes[nextIndex]);
  };

  // Backward compatibility properties
  const isHomeTeamMode = navbarMode === 'home';
  const isAwayTeamMode = navbarMode === 'away';
  const isSpecialNavbarMode = navbarMode !== 'normal';

  return {
    currentTheme,
    setTheme,
    customHeaderColor,
    setHeaderColor,
    currentPalette,
    navbarMode,
    setNavbarMode,
    toggleNavbarMode,
    isHomeTeamMode,
    isAwayTeamMode,
    isSpecialNavbarMode,
    // Backward compatibility
    availablePalettes: teamPalettes,
    applyTheme: setTheme,
    setLogoTheme: setTheme,
    currentLogoCode: currentTheme
  };
};
