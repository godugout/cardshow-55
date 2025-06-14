
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnhancedLightingSection } from '../../EnhancedLightingSection';
import type { LightingPreset, EnvironmentScene } from '../../../types';

interface SceneSectionProps {
  selectedScene: EnvironmentScene;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
}

export const SceneSection: React.FC<SceneSectionProps> = ({
  selectedScene,
  isOpen,
  onToggle,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onSceneChange,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  return (
    <CollapsibleSection
      title="Scene"
      emoji="🌅"
      statusText={selectedLighting.name}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <EnhancedLightingSection
        selectedLighting={selectedLighting}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        onLightingChange={onLightingChange}
        onBrightnessChange={onBrightnessChange}
        onInteractiveLightingToggle={onInteractiveLightingToggle}
      />
    </CollapsibleSection>
  );
};
