import React from 'react';
import { LogoSelectorDropdown } from './LogoSelectorDropdown';

interface LogoSelectorProps {
  onThemeChange?: (themeId: string) => void;
}

export const LogoSelector = ({ onThemeChange }: LogoSelectorProps) => {
  return <LogoSelectorDropdown onThemeChange={onThemeChange} />;
};