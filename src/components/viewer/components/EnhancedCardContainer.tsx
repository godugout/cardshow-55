
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import { UnifiedCardRenderer } from './UnifiedCardRenderer';
import { useEnhancedCachedEffects } from '../hooks/useEnhancedCachedEffects';

interface EnhancedCardContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  overallBrightness?: number[];
  showBackgroundInfo?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (event: React.MouseEvent) => void;
  environmentControls?: EnvironmentControls;
  solidCardTransition?: boolean;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness = [100],
  showBackgroundInfo = true,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  environmentControls = {
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  },
  solidCardTransition
}) => {
  // Use enhanced cached effects when all required props are available
  const enhancedCachedEffects = selectedScene && selectedLighting && materialSettings ? useEnhancedCachedEffects({
    card,
    effectValues,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation,
    isHovering
  }) : null;

  // Use enhanced cached styles if available, otherwise fall back to provided styles
  const effectiveFrameStyles = enhancedCachedEffects?.frameStyles || frameStyles;
  const effectiveEnhancedEffectStyles = enhancedCachedEffects?.enhancedEffectStyles || enhancedEffectStyles;
  const effectiveSurfaceTexture = enhancedCachedEffects?.SurfaceTexture || SurfaceTexture;

  return (
    <UnifiedCardRenderer
      card={card}
      isFlipped={isFlipped}
      isHovering={isHovering}
      showEffects={showEffects}
      effectValues={effectValues}
      mousePosition={mousePosition}
      rotation={rotation}
      zoom={zoom}
      isDragging={isDragging}
      frameStyles={effectiveFrameStyles}
      enhancedEffectStyles={effectiveEnhancedEffectStyles}
      SurfaceTexture={effectiveSurfaceTexture}
      interactiveLighting={interactiveLighting}
      selectedScene={selectedScene}
      selectedLighting={selectedLighting}
      materialSettings={materialSettings}
      overallBrightness={overallBrightness}
      showBackgroundInfo={showBackgroundInfo}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      environmentControls={environmentControls}
      solidCardTransition={true} // Enable solid transitions for smoother flipping
    />
  );
};

EnhancedCardContainer.displayName = 'EnhancedCardContainer';
