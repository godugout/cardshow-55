
import React from 'react';
import { LightingSection } from '../../LightingSection';
import { EnhancedSpacesSection } from '../sections/EnhancedSpacesSection';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../../types';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';
import type { CardData } from '@/hooks/useCardEditor';

interface EnvironmentTabProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  effectValues: EffectValues;
  materialSettings: MaterialSettings;
  currentCard?: CardData;
}

export const EnvironmentTab: React.FC<EnvironmentTabProps> = ({
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onSceneChange,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  effectValues,
  materialSettings,
  currentCard
}) => {
  return (
    <div className="space-y-6">
      {/* Lighting Section */}
      <div>
        <h3 className="text-white font-medium text-lg mb-4 flex items-center">
          💡 Lighting
        </h3>
        <LightingSection
          selectedLighting={selectedLighting}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          onLightingChange={onLightingChange}
          onBrightnessChange={onBrightnessChange}
          onInteractiveLightingToggle={onInteractiveLightingToggle}
        />
      </div>

      {/* Spaces Section */}
      <div>
        <h3 className="text-white font-medium text-lg mb-4 flex items-center">
          🌌 Spaces
        </h3>
        <EnhancedSpacesSection
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          currentCard={currentCard}
        />
      </div>
    </div>
  );
};
