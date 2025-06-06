
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnvironmentSection } from '../../EnvironmentSection';
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
      <EnvironmentSection
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        onSceneChange={onSceneChange}
        onLightingChange={onLightingChange}
        onBrightnessChange={onBrightnessChange}
        onInteractiveLightingToggle={onInteractiveLightingToggle}
      />
    </CollapsibleSection>
  );
};
