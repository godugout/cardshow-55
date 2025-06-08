
import React from 'react';
import { SceneSection } from '../sections/SceneSection';
import { LightingSection } from '../../LightingSection';
import type { EnvironmentScene, LightingPreset } from '../../../types';

interface SceneSetupTabProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

export const SceneSetupTab: React.FC<SceneSetupTabProps> = ({
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onSceneChange,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
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
    </div>
  );
};
