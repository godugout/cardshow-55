
import React, { useState } from 'react';
import type { LightingPreset } from '../types';
import { LIGHTING_PRESETS } from '../constants';
import { LightingViewToggle } from './lighting/LightingViewToggle';
import { LightingPresetGrid } from './lighting/LightingPresetGrid';
import { LightingPresetList } from './lighting/LightingPresetList';
import { LightingControls } from './lighting/LightingControls';

interface LightingSectionProps {
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  filteredPresets?: LightingPreset[];
}

export const LightingSection: React.FC<LightingSectionProps> = ({
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  filteredPresets
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Use filtered presets if provided, otherwise use all presets
  const presetsToShow = filteredPresets || LIGHTING_PRESETS;

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <LightingViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Filtered indicator */}
      {filteredPresets && filteredPresets.length < LIGHTING_PRESETS.length && (
        <div className="text-xs text-crd-green bg-crd-green/10 px-2 py-1 rounded border border-crd-green/20">
          Showing {filteredPresets.length} recommended presets
        </div>
      )}

      {/* Lighting Presets */}
      {viewMode === 'grid' ? (
        <LightingPresetGrid
          presets={presetsToShow}
          selectedLighting={selectedLighting}
          onLightingChange={onLightingChange}
        />
      ) : (
        <LightingPresetList
          presets={presetsToShow}
          selectedLighting={selectedLighting}
          onLightingChange={onLightingChange}
        />
      )}

      {/* Lighting Controls */}
      <LightingControls
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        onBrightnessChange={onBrightnessChange}
        onInteractiveLightingToggle={onInteractiveLightingToggle}
      />
    </div>
  );
};
