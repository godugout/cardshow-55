
import React, { useMemo, useCallback } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';
import { Card3DTransform } from './Card3DTransform';
import { useDoubleClick } from '@/hooks/useDoubleClick';
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
  // Memoize cached effects to prevent recalculation on every render
  const shouldUseCachedEffects = useMemo(() => {
    return selectedScene && selectedLighting && materialSettings;
  }, [selectedScene, selectedLighting, materialSettings]);

  const cachedEffects = useCachedCardEffects(
    shouldUseCachedEffects ? {
      card,
      effectValues,
      mousePosition,
      showEffects,
      overallBrightness,
      interactiveLighting,
      selectedScene: selectedScene!,
      selectedLighting: selectedLighting!,
      materialSettings: materialSettings!,
      zoom,
      rotation,
      isHovering
    } : null
  );

  // Memoize the double-click handler to prevent recreation
  const handleDoubleClick = useDoubleClick({
    onDoubleClick: onClick,
    delay: 300
  });

  // Memoize styles to prevent re-renders
  const effectiveFrameStyles = useMemo(() => 
    cachedEffects?.frameStyles || frameStyles, 
    [cachedEffects?.frameStyles, frameStyles]
  );
  
  const effectiveEnhancedEffectStyles = useMemo(() => 
    cachedEffects?.enhancedEffectStyles || enhancedEffectStyles,
    [cachedEffects?.enhancedEffectStyles, enhancedEffectStyles]
  );
  
  const effectiveSurfaceTexture = useMemo(() => 
    cachedEffects?.SurfaceTexture || SurfaceTexture,
    [cachedEffects?.SurfaceTexture, SurfaceTexture]
  );

  // Memoize container styles to prevent re-calculation
  const containerStyles = useMemo(() => ({
    transform: `scale(${zoom})`,
    transition: isDragging ? 'none' : 'transform 0.3s ease',
    filter: `brightness(${interactiveLighting && isHovering ? 1.3 : 1.2}) contrast(1.1)`
  }), [zoom, isDragging, interactiveLighting, isHovering]);

  // Memoize event handlers to prevent re-creation
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    onMouseDown(e);
  }, [onMouseDown]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    onMouseMove(e);
  }, [onMouseMove]);

  const handleMouseEnter = useCallback(() => {
    onMouseEnter();
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    onMouseLeave();
  }, [onMouseLeave]);

  return (
    <div 
      className={`relative z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={containerStyles}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card3DTransform
        rotation={rotation}
        mousePosition={mousePosition}
        isDragging={isDragging}
        interactiveLighting={interactiveLighting}
        isHovering={isHovering}
        onClick={handleDoubleClick}
      >
        {/* Front of Card */}
        <CardFrontContainer
          card={card}
          isFlipped={isFlipped}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          frameStyles={effectiveFrameStyles}
          enhancedEffectStyles={effectiveEnhancedEffectStyles}
          SurfaceTexture={effectiveSurfaceTexture}
          interactiveLighting={interactiveLighting}
          onClick={handleDoubleClick}
        />

        {/* Back of Card */}
        <CardBackContainer
          isFlipped={isFlipped}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          frameStyles={effectiveFrameStyles}
          enhancedEffectStyles={effectiveEnhancedEffectStyles}
          SurfaceTexture={effectiveSurfaceTexture}
          interactiveLighting={interactiveLighting}
        />
      </Card3DTransform>
    </div>
  );
};

EnhancedCardContainer.displayName = 'EnhancedCardContainer';
