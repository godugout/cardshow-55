
import React from 'react';
import type { ColorTheme } from '@/hooks/useColorThemes';

interface TeamColorCardProps {
  theme: ColorTheme;
  isSelected: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}

export const TeamColorCard = ({
  theme,
  isSelected,
  isHovered,
  onHover,
  onLeave,
  onSelect
}: TeamColorCardProps) => {
  const firstTeam = theme.teams?.[0];
  const displayName = firstTeam?.abbreviation?.toUpperCase() || theme.primary_example_team;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`p-2 rounded-lg border cursor-pointer transition-all hover:scale-105 relative ${
        isSelected
          ? 'border-crd-green bg-crd-green/10'
          : 'border-crd-mediumGray/30 hover:border-crd-green/50'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div 
          className="w-3 h-3 rounded-full border border-white/20" 
          style={{ backgroundColor: theme.primary_color }}
        />
        <div 
          className="w-3 h-3 rounded-full border border-white/20" 
          style={{ backgroundColor: theme.secondary_color }}
        />
        <div 
          className="w-3 h-3 rounded-full border border-white/20" 
          style={{ backgroundColor: theme.accent_color }}
        />
      </div>
      <div className="text-crd-white text-xs font-medium truncate">
        {displayName}
      </div>
      
      {/* Hover tooltip showing all teams */}
      {isHovered && theme.teams && theme.teams.length > 0 && (
        <div className="absolute z-10 bottom-full left-0 mb-2 p-2 bg-crd-darkest border border-crd-mediumGray/30 rounded-lg shadow-lg min-w-48">
          <div className="text-crd-white text-xs font-medium mb-1">
            {theme.name}
          </div>
          <div className="flex flex-wrap gap-1">
            {theme.teams.map((team) => (
              <span
                key={team.id}
                className="text-crd-lightGray text-xs bg-crd-mediumGray/20 px-1 py-0.5 rounded"
              >
                {team.abbreviation}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
