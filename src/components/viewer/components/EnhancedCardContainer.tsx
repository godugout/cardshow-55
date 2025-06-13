
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';
import { CardEdgeContainer } from './CardEdgeContainer';
import { Card3DTransform } from './Card3DTransform';
import { useCachedCardEffects } from '../hooks/useCachedCardEffects';

interface EnhancedCardContainerProps {
  card: CardData;
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
  onClick: () => void;
  environmentControls?: EnvironmentControls;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
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
  }
}) => {
  // Use cached effects for better performance only when all required props are available
  const cachedEffects = selectedScene && selectedLighting && materialSettings ? useCachedCardEffects({
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

  // Use cached styles if available, otherwise fall back to provided styles
  const effectiveFrameStyles = cachedEffects?.frameStyles || frameStyles;
  const effectiveEnhancedEffectStyles = cachedEffects?.enhancedEffectStyles || enhancedEffectStyles;
  const effectiveSurfaceTexture = cachedEffects?.SurfaceTexture || SurfaceTexture;

  return (
    <div 
      className={`relative z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        filter: `brightness(${interactiveLighting && isHovering ? 1.3 : 1.2}) contrast(1.1)`
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card3DTransform
        rotation={rotation}
        mousePosition={mousePosition}
        isDragging={isDragging}
        interactiveLighting={interactiveLighting}
        isHovering={isHovering}
        showEffects={showEffects}
        onClick={onClick}
      >
        {/* Front of Card */}
        <CardFrontContainer
          card={card}
          rotation={rotation}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          frameStyles={effectiveFrameStyles}
          enhancedEffectStyles={effectiveEnhancedEffectStyles}
          SurfaceTexture={effectiveSurfaceTexture}
          interactiveLighting={interactiveLighting}
          onClick={onClick}
        />

        {/* Back of Card */}
        <CardBackContainer
          rotation={rotation}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          frameStyles={effectiveFrameStyles}
          enhancedEffectStyles={effectiveEnhancedEffectStyles}
          SurfaceTexture={effectiveSurfaceTexture}
          interactiveLighting={interactiveLighting}
        />

        {/* Card Edge with Enhanced Glowing Gas */}
        <CardEdgeContainer
          rotation={rotation}
          isHovering={isHovering}
          effectValues={effectValues}
          mousePosition={mousePosition}
          interactiveLighting={interactiveLighting}
          zoom={zoom}
        />
      </Card3DTransform>
    </div>
  );
};

EnhancedCardContainer.displayName = 'EnhancedCardContainer';
