
import React, { useState, useEffect } from 'react';
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
  const [spaceLoadError, setSpaceLoadError] = useState<string | null>(null);
  const [isSpaceLoading, setIsSpaceLoading] = useState(false);

  console.log('🎨 BackgroundRenderer rendering:', { 
    backgroundType, 
    spaceName: selectedSpace?.name,
    environmentControls 
  });

  // Reset error state when space changes
  useEffect(() => {
    if (selectedSpace) {
      setSpaceLoadError(null);
      setIsSpaceLoading(true);
      console.log('🔄 Loading new space:', selectedSpace.name);
      
      // Simulate loading completion after a brief delay
      const timer = setTimeout(() => {
        setIsSpaceLoading(false);
        console.log('✅ Space loading completed');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedSpace]);

  // Handle space loading errors
  const handleSpaceError = (error: string) => {
    console.error('❌ Space loading error:', error);
    setSpaceLoadError(error);
    setIsSpaceLoading(false);
  };

  if (backgroundType === '3dSpace') {
    if (!selectedSpace) {
      console.warn('⚠️ No space selected for 3D mode, falling back to 2D');
      return (
        <SceneBackground
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          mousePosition={mousePosition}
          isHovering={isHovering}
          environmentControls={environmentControls}
        />
      );
    }

    if (spaceLoadError) {
      console.warn('⚠️ Space loading failed, showing fallback:', spaceLoadError);
      return (
        <>
          <SceneBackground
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            mousePosition={mousePosition}
            isHovering={isHovering}
            environmentControls={environmentControls}
          />
          <div className="fixed top-4 right-4 z-50 bg-red-500/80 text-white px-3 py-2 rounded-lg text-sm">
            3D Space failed to load: {spaceLoadError}
          </div>
        </>
      );
    }

    if (isSpaceLoading) {
      return (
        <>
          <SceneBackground
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            mousePosition={mousePosition}
            isHovering={isHovering}
            environmentControls={environmentControls}
          />
          <div className="fixed top-4 right-4 z-50 bg-blue-500/80 text-white px-3 py-2 rounded-lg text-sm">
            Loading 3D Space: {selectedSpace.name}...
          </div>
        </>
      );
    }

    try {
      return (
        <SpaceRenderer
          spaceEnvironment={selectedSpace}
          spaceControls={spaceControls}
          card={adaptedCard}
          onCardClick={onCardClick}
          onCameraReset={onCameraReset}
          environmentControls={environmentControls}
          onError={handleSpaceError}
        />
      );
    } catch (error) {
      console.error('❌ SpaceRenderer error:', error);
      handleSpaceError(error instanceof Error ? error.message : 'Unknown error');
      return (
        <SceneBackground
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          mousePosition={mousePosition}
          isHovering={isHovering}
          environmentControls={environmentControls}
        />
      );
    }
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
