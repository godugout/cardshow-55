
import React, { useState, useCallback, useRef } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';
import { useCachedCardEffects } from '../hooks/useCachedCardEffects';

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
  onClick: () => void;
  environmentControls?: EnvironmentControls;
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
  overallBrightness = [120], // Increased default
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
  // Use internal flip state that tracks the parent's isFlipped prop
  const [internalIsFlipped, setInternalIsFlipped] = useState(isFlipped);
  
  // Sync internal state with parent prop
  React.useEffect(() => {
    setInternalIsFlipped(isFlipped);
  }, [isFlipped]);
  
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

  // Handle card flip - call parent's onClick handler
  const handleCardFlip = useCallback(() => {
    console.log('🎯 Card flip requested in container');
    onClick();
  }, [onClick]);

  // Use cached styles if available, otherwise fall back to provided styles
  const effectiveFrameStyles = cachedEffects?.frameStyles || frameStyles;
  const effectiveEnhancedEffectStyles = cachedEffects?.enhancedEffectStyles || enhancedEffectStyles;
  const effectiveSurfaceTexture = cachedEffects?.SurfaceTexture || SurfaceTexture;

  return (
    <div 
      className={`relative z-20 select-none`}
      style={{
        transform: `scale(${zoom}) rotateX(${rotation.x * 0.5}deg) rotateY(${rotation.y * 0.5}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        filter: `brightness(${interactiveLighting && isHovering ? 1.2 : 1.0}) contrast(1.05)`, // Increased from 1.1
        transformStyle: 'preserve-3d'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleCardFlip}
    >
      {/* Front of Card */}
      <CardFrontContainer
        card={card}
        isFlipped={internalIsFlipped}
        isHovering={isHovering}
        showEffects={showEffects}
        effectValues={effectValues}
        mousePosition={mousePosition}
        frameStyles={effectiveFrameStyles}
        enhancedEffectStyles={effectiveEnhancedEffectStyles}
        SurfaceTexture={effectiveSurfaceTexture}
        interactiveLighting={interactiveLighting}
        onClick={handleCardFlip}
      />

      {/* Back of Card */}
      <CardBackContainer
        isFlipped={internalIsFlipped}
        isHovering={isHovering}
        showEffects={showEffects}
        effectValues={effectValues}
        mousePosition={mousePosition}
        frameStyles={effectiveFrameStyles}
        enhancedEffectStyles={effectiveEnhancedEffectStyles}
        SurfaceTexture={effectiveSurfaceTexture}
        interactiveLighting={interactiveLighting}
      />
    </div>
  );
};

EnhancedCardContainer.displayName = 'EnhancedCardContainer';
