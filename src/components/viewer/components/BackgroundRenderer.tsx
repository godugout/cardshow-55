
import React from 'react';
import { SpaceRenderer3D } from '../spaces/SpaceRenderer3D';
import { EnvironmentSphere } from './EnvironmentSphere';
import { BASIC_SPACE_ENVIRONMENTS } from '../spaces/environments/basicSpaceEnvironments';
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

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = React.memo(({
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
  // CRITICAL: Only render ONE mode at a time to prevent dual rendering
  
  // For 3D space mode, use default space if none selected
  if (backgroundType === '3dSpace') {
    const spaceToUse = selectedSpace || BASIC_SPACE_ENVIRONMENTS[0];
    
    // Only render 3D space - no 2D background
    return (
      <div className="absolute inset-0 z-0">
        <SpaceRenderer3D
          card={adaptedCard}
          environment={spaceToUse}
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

  // For 2D scene mode - only render 2D background
  return (
    <div className="absolute inset-0 z-0">
      <EnvironmentSphere
        scene={selectedScene}
        mousePosition={mousePosition}
        isHovering={isHovering}
      />
    </div>
  );
});

BackgroundRenderer.displayName = 'BackgroundRenderer';
