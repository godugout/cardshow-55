
import React from 'react';
import { SceneSection } from '../sections/SceneSection';
import { SpacesSection } from '../sections/SpacesSection';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../../types';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';
import type { CardData } from '@/hooks/useCardEditor';

interface SceneSetupTabProps {
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

export const SceneSetupTab: React.FC<SceneSetupTabProps> = ({
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
      {/* Environment Section */}
      <div>
        <h3 className="text-white font-medium text-lg mb-4 flex items-center">
          🌍 Environment
        </h3>
        <SceneSection
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          isOpen={true}
          onToggle={() => {}}
          onSceneChange={onSceneChange}
          onLightingChange={onLightingChange}
          onBrightnessChange={onBrightnessChange}
          onInteractiveLightingToggle={onInteractiveLightingToggle}
        />
      </div>

      {/* Spaces Section */}
      <div>
        <h3 className="text-white font-medium text-lg mb-4 flex items-center">
          🌌 3D Spaces
        </h3>
        <SpacesSection
          isOpen={true}
          onToggle={() => {}}
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
