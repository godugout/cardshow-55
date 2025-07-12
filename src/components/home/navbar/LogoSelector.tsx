import React from 'react';
import { LogoSelectorDrawer } from './LogoSelectorDrawer';

interface LogoSelectorProps {
  onThemeChange?: (themeId: string) => void;
  currentTheme?: string;
}

export const LogoSelector = ({ onThemeChange, currentTheme }: LogoSelectorProps) => {
  return <LogoSelectorDrawer onThemeChange={onThemeChange} currentTheme={currentTheme} />;
};