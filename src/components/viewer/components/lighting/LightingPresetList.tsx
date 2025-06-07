
import React from 'react';
import { cn } from '@/lib/utils';
import type { LightingPreset } from '../../types';
import { getColorsForPreset } from './lightingColors';

interface LightingPresetListProps {
  presets: LightingPreset[];
  selectedLighting: LightingPreset;
  onLightingChange: (lighting: LightingPreset) => void;
}

export const LightingPresetList: React.FC<LightingPresetListProps> = ({
  presets,
  selectedLighting,
  onLightingChange
}) => {
  return (
    <div className="space-y-2">
      {presets.map((preset) => {
        const isSelected = selectedLighting.id === preset.id;
        const colors = getColorsForPreset(preset.id);
        
        return (
          <div
            key={preset.id}
            onClick={() => onLightingChange(preset)}
            className={cn(
              "relative p-3 rounded-lg border cursor-pointer transition-all duration-200",
              isSelected
                ? "border-white/40 bg-white/10 shadow-lg"
                : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/8"
            )}
            style={isSelected ? {
              borderColor: colors.primary,
              backgroundColor: `${colors.primary}15`,
              boxShadow: `0 0 15px ${colors.primary}30`
            } : {}}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ background: colors.gradient }}
                />
                <div className="flex-1">
                  <div className={cn(
                    "font-medium text-sm",
                    isSelected ? "text-white" : "text-gray-200"
                  )}>
                    {preset.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {preset.description}
                  </div>
                </div>
              </div>
              
              {/* Color tone indicator */}
              <div className="flex items-center space-x-1">
                <div 
                  className="w-16 h-3 rounded-full"
                  style={{ background: colors.gradient }}
                />
                {isSelected && (
                  <div 
                    className="w-2 h-2 rounded-full ml-2"
                    style={{ backgroundColor: colors.primary }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
