
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
}

export const LightingSection: React.FC<LightingSectionProps> = ({
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <LightingViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Lighting Presets */}
      {viewMode === 'grid' ? (
        <LightingPresetGrid
          presets={LIGHTING_PRESETS}
          selectedLighting={selectedLighting}
          onLightingChange={onLightingChange}
        />
      ) : (
        <LightingPresetList
          presets={LIGHTING_PRESETS}
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
