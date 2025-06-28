
import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ColorTheme } from '@/hooks/useColorThemes';

interface TeamColorCardProps {
  theme: ColorTheme;
  isSelected: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
  onColorsChange?: (rotatedTheme: ColorTheme) => void;
}

export const TeamColorCard = ({
  theme,
  isSelected,
  isHovered,
  onHover,
  onLeave,
  onSelect,
  onColorsChange
}: TeamColorCardProps) => {
  const [rotationIndex, setRotationIndex] = useState(0);
  const firstTeam = theme.teams?.[0];
  const displayName = firstTeam?.abbreviation?.toUpperCase() || theme.primary_example_team;

  // Create rotated color array
  const colors = [theme.primary_color, theme.secondary_color, theme.accent_color];
  const rotateColors = () => {
    const newRotationIndex = (rotationIndex + 1) % colors.length;
    setRotationIndex(newRotationIndex);
    
    // Create rotated theme and notify parent
    if (onColorsChange) {
      const rotatedColors = [...colors];
      for (let i = 0; i < newRotationIndex; i++) {
        rotatedColors.push(rotatedColors.shift()!);
      }
      
      const rotatedTheme = {
        ...theme,
        primary_color: rotatedColors[0],
        secondary_color: rotatedColors[1],
        accent_color: rotatedColors[2]
      };
      
      onColorsChange(rotatedTheme);
    }
  };

  // Get colors in current rotation order
  const getRotatedColors = () => {
    const rotated = [...colors];
    for (let i = 0; i < rotationIndex; i++) {
      rotated.push(rotated.shift()!);
    }
    return rotated;
  };

  const [primary, secondary, accent] = getRotatedColors();

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 relative ${
        isSelected
          ? 'border-crd-green bg-crd-green/10'
          : 'border-crd-mediumGray/30 hover:border-crd-green/50'
      }`}
    >
      {/* Team Name */}
      <div className="text-crd-white text-sm font-medium truncate mb-3 text-center">
        {displayName}
      </div>

      {/* Color Pills and Rotation Button in Same Row */}
      <div className="flex items-center justify-center gap-2">
        {/* Color Pills */}
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-white/20" 
            style={{ backgroundColor: primary }}
          />
          <div 
            className="w-4 h-4 rounded-full border border-white/20" 
            style={{ backgroundColor: secondary }}
          />
          <div 
            className="w-4 h-4 rounded-full border border-white/20" 
            style={{ backgroundColor: accent }}
          />
        </div>

        {/* Divider */}
        <Separator orientation="vertical" className="h-4 bg-crd-mediumGray/30" />

        {/* Rotation Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            rotateColors();
          }}
          className="p-1 rounded-full bg-crd-mediumGray/20 hover:bg-crd-mediumGray/40 transition-colors"
          title="Rotate colors"
        >
          <RotateCcw className="w-4 h-4 text-crd-lightGray" />
        </button>
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
