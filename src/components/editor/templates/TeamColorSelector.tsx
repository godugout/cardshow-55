
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette } from 'lucide-react';
import { PRO_SPORTS_TEAM_COLORS, type TeamColorScheme } from './TeamColors';

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
          {PRO_SPORTS_TEAM_COLORS.map((colorScheme) => (
            <div
              key={colorScheme.id}
              onClick={() => onColorSchemeSelect(colorScheme)}
              className={`p-2 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                selectedColorScheme?.id === colorScheme.id
                  ? 'border-crd-green bg-crd-green/10'
                  : 'border-crd-mediumGray/30 hover:border-crd-green/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full border border-white/20" 
                  style={{ backgroundColor: colorScheme.primary }}
                />
                <div 
                  className="w-3 h-3 rounded-full border border-white/20" 
                  style={{ backgroundColor: colorScheme.secondary }}
                />
                <div 
                  className="w-3 h-3 rounded-full border border-white/20" 
                  style={{ backgroundColor: colorScheme.accent }}
                />
              </div>
              <div className="text-crd-white text-xs font-medium truncate">
                {colorScheme.name}
              </div>
            </div>
          ))}
        </div>
        
        {selectedColorScheme && (
          <div className="mt-3 pt-3 border-t border-crd-mediumGray/20">
            <div className="text-crd-white text-xs font-medium mb-2">
              Selected: {selectedColorScheme.name}
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
