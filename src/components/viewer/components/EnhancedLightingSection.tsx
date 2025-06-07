
import React from 'react';
import { LightingStyleCards } from './LightingStyleCards';
import type { LightingPreset } from '../types';

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
  onLightingChange
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-white font-medium text-sm">Lighting Style</h4>
      <LightingStyleCards
        selectedLighting={selectedLighting}
        onLightingChange={onLightingChange}
      />
    </div>
  );
};
