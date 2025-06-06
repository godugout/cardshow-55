
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sun, Lightbulb, Grid3X3, List } from 'lucide-react';
import type { LightingPreset } from '../types';
import { LIGHTING_PRESETS } from '../constants';
import { getStyleColor } from './presets/styleColors';
import { cn } from '@/lib/utils';

interface EnhancedLightingSectionProps {
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

export const EnhancedLightingSection: React.FC<EnhancedLightingSectionProps> = ({
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const GridView = () => (
    <div className="grid grid-cols-2 gap-3">
      {LIGHTING_PRESETS.map((preset) => {
        const isSelected = selectedLighting.id === preset.id;
        const colors = getStyleColor(preset.id);
        
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

  const ListView = () => (
    <div className="space-y-2">
      {LIGHTING_PRESETS.map((preset) => {
        const isSelected = selectedLighting.id === preset.id;
        const colors = getStyleColor(preset.id);
        
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

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium text-sm">Lighting Style</h4>
        <div className="flex items-center space-x-1 bg-white/10 rounded-lg p-1">
          <Button
            onClick={() => setViewMode('list')}
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0",
              viewMode === 'list' ? "bg-white/20 text-white" : "text-gray-400"
            )}
          >
            <List className="w-3 h-3" />
          </Button>
          <Button
            onClick={() => setViewMode('grid')}
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0",
              viewMode === 'grid' ? "bg-white/20 text-white" : "text-gray-400"
            )}
          >
            <Grid3X3 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Lighting Presets */}
      {viewMode === 'grid' ? <GridView /> : <ListView />}

      {/* Overall Brightness */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">Brightness</span>
          </div>
          <span className="text-yellow-400 text-sm font-medium">
            {overallBrightness[0]}%
          </span>
        </div>
        <Slider
          value={overallBrightness}
          onValueChange={onBrightnessChange}
          min={50}
          max={200}
          step={5}
          className="w-full"
        />
      </div>

      {/* Interactive Lighting Toggle */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Interactive Lighting</span>
          </div>
          <Button
            onClick={onInteractiveLightingToggle}
            variant="outline"
            size="sm"
            className={cn(
              "h-8 px-3 text-xs transition-all",
              interactiveLighting 
                ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600" 
                : "bg-transparent text-white border-white/20 hover:border-white/40"
            )}
          >
            {interactiveLighting ? 'On' : 'Off'}
          </Button>
        </div>
      </div>
    </div>
  );
};
