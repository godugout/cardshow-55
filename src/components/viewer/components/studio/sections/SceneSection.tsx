
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnvironmentComboSection } from '../../EnvironmentComboSection';
import { LightingComboSection } from '../../LightingComboSection';
import type { EnvironmentScene, LightingPreset } from '../../../types';

interface SceneSectionProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

export const SceneSection: React.FC<SceneSectionProps> = ({
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  isOpen,
  onToggle,
  onSceneChange,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  return (
    <CollapsibleSection
      title="Scene"
      emoji="🌍"
      statusText={`${selectedScene.name} • ${selectedLighting.name}`}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-6">
        {/* Environment Scenes */}
        <div>
          <h4 className="text-white text-sm font-medium mb-3 flex items-center">
            Environment Scene
          </h4>
          <EnvironmentComboSection
            selectedScene={selectedScene}
            onSceneChange={onSceneChange}
          />
        </div>

        {/* Lighting */}
        <div>
          <h4 className="text-white text-sm font-medium mb-3 flex items-center">
            Lighting Style
          </h4>
          <LightingComboSection
            selectedLighting={selectedLighting}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            onLightingChange={onLightingChange}
            onBrightnessChange={onBrightnessChange}
            onInteractiveLightingToggle={onInteractiveLightingToggle}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
