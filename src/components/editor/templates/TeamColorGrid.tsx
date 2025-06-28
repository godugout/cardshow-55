
import React from 'react';
import { TeamColorCard } from './TeamColorCard';
import type { ColorTheme } from '@/hooks/useColorThemes';
import type { TeamColorScheme } from './TeamColors';

interface TeamColorGridProps {
  themes: ColorTheme[];
  selectedColorScheme?: TeamColorScheme;
  hoveredTheme: string | null;
  onThemeHover: (themeId: string | null) => void;
  onThemeSelect: (theme: ColorTheme) => void;
}

export const TeamColorGrid = ({
  themes,
  selectedColorScheme,
  hoveredTheme,
  onThemeHover,
  onThemeSelect
}: TeamColorGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
      {themes.map((theme) => (
        <TeamColorCard
          key={theme.id}
          theme={theme}
          isSelected={selectedColorScheme?.id === theme.id}
          isHovered={hoveredTheme === theme.id}
          onHover={() => onThemeHover(theme.id)}
          onLeave={() => onThemeHover(null)}
          onSelect={() => onThemeSelect(theme)}
        />
      ))}
    </div>
  );
};
