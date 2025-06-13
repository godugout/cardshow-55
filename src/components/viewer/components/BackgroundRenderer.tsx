
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
  renderCard?: boolean; // New prop to control card rendering
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
  interactiveLighting = false,
  renderCard = true // Default to true for backward compatibility
}) => {
  // Check for '3dSpace' instead of 'space' based on the BackgroundType definition
  if (backgroundType === '3dSpace' && selectedSpace) {
    return (
      <div className="absolute inset-0 z-0">
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
          renderCard={renderCard} // Pass through the renderCard prop
        />
      </div>
    );
  }

  if (backgroundType === 'scene') {
    return (
      <div className="absolute inset-0 z-0">
        <EnvironmentSphere
          scene={selectedScene}
          mousePosition={mousePosition}
          isHovering={isHovering}
        />
      </div>
    );
  }

  return null;
};
