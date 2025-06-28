
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Info } from 'lucide-react';
import { useColorThemes, type ColorTheme } from '@/hooks/useColorThemes';
import { convertColorThemeToScheme, type TeamColorScheme } from './TeamColors';

interface TeamColorSelectorProps {
  selectedColorScheme?: TeamColorScheme;
  onColorSchemeSelect: (colorScheme: TeamColorScheme) => void;
  className?: string;
}

export const TeamColorSelector = ({ 
  selectedColorScheme, 
  onColorSchemeSelect, 
  className = "" 
}: TeamColorSelectorProps) => {
  const { colorThemes, loading, error } = useColorThemes();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const handleThemeSelect = (theme: ColorTheme) => {
    const scheme = convertColorThemeToScheme(theme);
    onColorSchemeSelect(scheme);
  };

  if (loading) {
    return (
      <Card className={`bg-crd-darker border-crd-mediumGray/20 ${className}`}>
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2 text-sm">
            <Palette className="w-4 h-4" />
            Team Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-crd-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bg-crd-darker border-crd-mediumGray/20 ${className}`}>
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2 text-sm">
            <Palette className="w-4 h-4" />
            Team Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-crd-lightGray text-sm">
            Failed to load color themes. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-crd-darker border-crd-mediumGray/20 ${className}`}>
      <CardHeader>
        <CardTitle className="text-crd-white flex items-center gap-2 text-sm">
          <Palette className="w-4 h-4" />
          Team Colors
        </CardTitle>
        <p className="text-crd-lightGray text-xs">
          Choose from professional sports team color schemes
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {colorThemes.map((theme) => {
            const isSelected = selectedColorScheme?.id === theme.id;
            const isHovered = hoveredTheme === theme.id;
            
            return (
              <div
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
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
                  {theme.primary_example_team}
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
          })}
        </div>
        
        {selectedColorScheme && (
          <div className="mt-3 pt-3 border-t border-crd-mediumGray/20">
            <div className="text-crd-white text-xs font-medium mb-2 flex items-center gap-2">
              <span>Selected: {selectedColorScheme.name}</span>
              <Info className="w-3 h-3 text-crd-lightGray" />
            </div>
            <div className="flex gap-2">
              <Badge 
                variant="outline" 
                className="text-crd-lightGray border-crd-mediumGray/30"
                style={{ borderColor: selectedColorScheme.primary, color: selectedColorScheme.primary }}
              >
                Primary
              </Badge>
              <Badge 
                variant="outline" 
                className="text-crd-lightGray border-crd-mediumGray/30"
                style={{ borderColor: selectedColorScheme.secondary, color: selectedColorScheme.secondary }}
              >
                Secondary
              </Badge>
              <Badge 
                variant="outline" 
                className="text-crd-lightGray border-crd-mediumGray/30"
                style={{ borderColor: selectedColorScheme.accent, color: selectedColorScheme.accent }}
              >
                Accent
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
