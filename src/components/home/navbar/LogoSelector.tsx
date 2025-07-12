import React from 'react';
import { LogoSelectorDrawer } from './LogoSelectorDrawer';

interface LogoSelectorProps {
  onThemeChange?: (themeId: string) => void;
}

export const LogoSelector = ({ onThemeChange }: LogoSelectorProps) => {
  return <LogoSelectorDrawer onThemeChange={onThemeChange} />;
};