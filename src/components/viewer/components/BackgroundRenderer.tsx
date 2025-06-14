
import React from 'react';
import { SpaceRenderer3D } from '../spaces/SpaceRenderer3D';
import { EnvironmentSphere } from './EnvironmentSphere';
import { expandSimpleCardToCardData } from '../utils/cardAdapter';
import type { BackgroundType, EnvironmentScene, LightingPreset } from '../types';
import type { SpaceEnvironment, SpaceControls } from '../spaces/types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface BackgroundRendererProps {
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
  effectValues?: EffectValues;
  materialSettings?: any;
  overallBrightness?: number[];
  interactiveLighting?: boolean;
  enableTrue3D?: boolean;
  renderCard?: boolean;
}

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({
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
  effectValues = {},
  materialSettings,
  overallBrightness = [100],
  interactiveLighting = false,
  enableTrue3D = false,
  renderCard = false
}) => {
  // Convert card to CardData format for components that need it
  const cardData = expandSimpleCardToCardData(card);

  console.log('🎨 BackgroundRenderer:', {
    backgroundType,
    enableTrue3D,
    hasSpace: !!selectedSpace,
    renderCard,
    spaceName: selectedSpace?.name
  });

  // In True 3D mode, always use 3D space rendering
  if (enableTrue3D) {
    const defaultSpace: SpaceEnvironment = selectedSpace || {
      id: 'studio-default',
      name: 'Studio',
      description: 'Clean studio environment',
      previewUrl: '/placeholder.svg',
      type: 'studio',
      category: 'basic',
      emoji: '🎬',
      config: {
        backgroundColor: '#1a1a1a',
        ambientColor: '#404040',
        lightIntensity: 1.0,
        exposure: 1.0,
        autoRotation: 0
      }
    };

    console.log('🎬 Rendering True 3D background with space:', defaultSpace.name);

    return (
      <div className="absolute inset-0 z-0">
        <SpaceRenderer3D
          card={cardData}
          environment={defaultSpace}
          controls={spaceControls}
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          onCardClick={onCardClick}
          onCameraReset={onCameraReset}
          renderCard={renderCard}
        />
      </div>
    );
  }

  // In Enhanced 2D mode, render backgrounds based on type
  if (backgroundType === '3dSpace' && selectedSpace) {
    console.log('🌌 Rendering Enhanced 2D background with 3D space:', selectedSpace.name);
    return (
      <div className="absolute inset-0 z-0">
        <SpaceRenderer3D
          card={cardData}
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
          renderCard={false} // Don't render card in 2D mode
        />
      </div>
    );
  }

  if (backgroundType === 'scene') {
    console.log('🎭 Rendering Enhanced 2D background with scene:', selectedScene.name);
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

  console.log('⚫ No background to render');
  return null;
};
