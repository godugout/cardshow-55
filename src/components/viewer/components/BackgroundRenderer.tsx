
import React from 'react';
import { SceneBackground } from './SceneBackground';
import { SpaceRenderer } from '../spaces/SpaceRenderer';
import type { EnvironmentScene, LightingPreset } from '../types';
import type { SpaceEnvironment, SpaceControls } from '../spaces/types';

interface BackgroundRendererProps {
  backgroundType: 'scene' | '3dSpace';
  selectedSpace: SpaceEnvironment | null;
  spaceControls: SpaceControls;
  adaptedCard: any;
  onCardClick: () => void;
  onCameraReset: () => void;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  environmentControls?: {
    depthOfField: number;
    parallaxIntensity: number;
    fieldOfView: number;
    atmosphericDensity: number;
  };
}

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({
  backgroundType,
  selectedSpace,
  spaceControls,
  adaptedCard,
  onCardClick,
  onCameraReset,
  selectedScene,
  selectedLighting,
  mousePosition,
  isHovering,
  environmentControls = {
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  }
}) => {
  console.log('🎨 BackgroundRenderer rendering:', { backgroundType, environmentControls });

  if (backgroundType === '3dSpace' && selectedSpace) {
    return (
      <SpaceRenderer
        spaceEnvironment={selectedSpace}
        spaceControls={spaceControls}
        card={adaptedCard}
        onCardClick={onCardClick}
        onCameraReset={onCameraReset}
        environmentControls={environmentControls}
      />
    );
  }

  return (
    <SceneBackground
      selectedScene={selectedScene}
      selectedLighting={selectedLighting}
      mousePosition={mousePosition}
      isHovering={isHovering}
      environmentControls={environmentControls}
    />
  );
};
