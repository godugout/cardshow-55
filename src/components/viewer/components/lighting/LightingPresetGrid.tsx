
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LightingPreset } from '../../types';
import { getColorsForPreset } from './lightingColors';

interface LightingPresetGridProps {
  presets: LightingPreset[];
  selectedLighting: LightingPreset;
  onLightingChange: (lighting: LightingPreset) => void;
}

export const LightingPresetGrid: React.FC<LightingPresetGridProps> = ({
  presets,
  selectedLighting,
  onLightingChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {presets.map((preset) => {
        const isSelected = selectedLighting.id === preset.id;
        const colors = getColorsForPreset(preset.id);
        
        return (
          <Button
            key={preset.id}
            onClick={() => onLightingChange(preset)}
            variant="ghost"
            className={cn(
              "relative h-20 p-3 rounded-lg border-2 transition-all duration-200",
              isSelected 
                ? "border-white/40 bg-white/10 shadow-lg" 
                : "border-white/20 hover:border-white/30 hover:bg-white/5"
            )}
            style={isSelected ? {
              borderColor: colors.primary,
              backgroundColor: `${colors.primary}20`,
              boxShadow: `0 0 20px ${colors.primary}40`
            } : {}}
          >
            <div className="flex flex-col items-center justify-center space-y-1">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ background: colors.gradient }}
              />
              <span className={cn(
                "text-xs font-medium",
                isSelected ? "text-white" : "text-gray-300"
              )}>
                {preset.name}
              </span>
            </div>
            
            {isSelected && (
              <div 
                className="absolute top-1 right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
            )}
          </Button>
        );
      })}
    </div>
  );
};
