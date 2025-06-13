
import React from 'react';
import { BackgroundRenderer } from './BackgroundRenderer';
import { adaptCardForSpaceRenderer } from '../utils/cardAdapter';
import type { BackgroundType, EnvironmentScene, LightingPreset } from '../types';
import type { SpaceEnvironment, SpaceControls } from '../spaces/types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface ViewerBackgroundProps {
  backgroundType: BackgroundType;
  selectedSpace?: SpaceEnvironment | null;
  spaceControls: SpaceControls;
  card: any;
  onCardClick: () => void;
  onCameraReset: () => void;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  effectValues: EffectValues;
  materialSettings: any;
  overallBrightness: number[];
  interactiveLighting: boolean;
}

export const ViewerBackground: React.FC<ViewerBackgroundProps> = ({
  backgroundType,
  selectedSpace,
  spaceControls,
  card,
  onCardClick,
  onCameraReset,
  selectedScene,
  selectedLighting,
  mousePosition,
  isHovering,
  effectValues,
  materialSettings,
  overallBrightness,
  interactiveLighting
}) => {
  // Adapt card for space renderer
  const adaptedCard = adaptCardForSpaceRenderer(card);

  return (
    <BackgroundRenderer
      backgroundType={backgroundType}
      selectedSpace={selectedSpace}
      spaceControls={spaceControls}
      adaptedCard={adaptedCard}
      onCardClick={onCardClick}
      onCameraReset={onCameraReset}
      selectedScene={selectedScene}
      selectedLighting={selectedLighting}
      mousePosition={mousePosition}
      isHovering={isHovering}
      effectValues={effectValues}
      materialSettings={materialSettings}
      overallBrightness={overallBrightness}
      interactiveLighting={interactiveLighting}
      renderCard={false}
    />
  );
};
