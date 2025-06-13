
import React from 'react';
import { SpaceRenderer3D } from '../spaces/SpaceRenderer3D';
import { EnvironmentSphere } from './EnvironmentSphere';
import type { BackgroundType, EnvironmentScene, LightingPreset } from '../types';
import type { SpaceEnvironment, SpaceControls } from '../spaces/types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface BackgroundRendererProps {
  backgroundType: BackgroundType;
  selectedSpace?: SpaceEnvironment | null;
  spaceControls: SpaceControls;
  adaptedCard: any;
  onCardClick: () => void;
  onCameraReset: () => void;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  effectValues?: EffectValues;
  materialSettings?: any;
  overallBrightness?: number[];
  interactiveLighting?: boolean;
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
  effectValues = {},
  materialSettings,
  overallBrightness = [100],
  interactiveLighting = false
}) => {
  // Render 3D Space background (background only, no card)
  if (backgroundType === '3dSpace' && selectedSpace) {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none">
        <SpaceRenderer3D
          card={adaptedCard}
          environment={selectedSpace}
          controls={spaceControls}
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          onCardClick={onCardClick}
          onCameraReset={onCameraReset}
        />
      </div>
    );
  }

  // Render Environment Sphere background
  if (backgroundType === 'scene') {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none">
        <EnvironmentSphere
          scene={selectedScene}
          mousePosition={mousePosition}
          isHovering={isHovering}
        />
      </div>
    );
  }

  // Default dark background
  return (
    <div className="absolute inset-0 z-0 bg-crd-darkest" />
  );
};
