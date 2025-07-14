
import { useState, useEffect } from 'react';

export type NavbarMode = 'normal' | 'home' | 'away' | 'pinstripes';

export const useNavbarTheme = () => {
  const [navbarMode, setNavbarModeState] = useState<NavbarMode>('normal');

  // Load navbar mode from localStorage on initialization
  useEffect(() => {
    const savedMode = localStorage.getItem('crd-navbar-mode');
    if (savedMode && ['normal', 'home', 'away', 'pinstripes'].includes(savedMode)) {
      setNavbarModeState(savedMode as NavbarMode);
    }
  }, []);

  // Save navbar mode to localStorage
  const setNavbarMode = (mode: NavbarMode) => {
    setNavbarModeState(mode);
    localStorage.setItem('crd-navbar-mode', mode);
  };

  const getNavbarModeClass = () => {
    switch (navbarMode) {
      case 'home':
        return 'navbar-home-team';
      case 'away':
        return 'navbar-away-team';
      case 'pinstripes':
        return 'navbar-pinstripes';
      default:
        return '';
    }
  };

  const isSpecialMode = navbarMode !== 'normal';

  return {
    navbarMode,
    setNavbarMode,
    getNavbarModeClass,
    isSpecialMode
  };
};
