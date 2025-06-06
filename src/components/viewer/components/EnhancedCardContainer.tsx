
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';
import { Card3DTransform } from './Card3DTransform';
import { CanvasBackgroundInfo } from './CanvasBackgroundInfo';
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
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = React.memo(({
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
  onClick
}) => {
  // Use cached effects for better performance
  const cachedEffects = useCachedCardEffects({
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
  });

  // Use double-click/tap detection for card flip
  const handleDoubleClick = useDoubleClick({
    onDoubleClick: onClick,
    delay: 300
  });

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
      {/* 3D Background Configuration Info */}
      {showBackgroundInfo && selectedScene && selectedLighting && materialSettings && (
        <CanvasBackgroundInfo
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          mousePosition={mousePosition}
          isHovering={isHovering}
        />
      )}

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
          frameStyles={cachedEffects.getFrameStyles()}
          enhancedEffectStyles={cachedEffects.getEnhancedEffectStyles()}
          SurfaceTexture={cachedEffects.SurfaceTexture}
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
          frameStyles={cachedEffects.getFrameStyles()}
          enhancedEffectStyles={cachedEffects.getEnhancedEffectStyles()}
          SurfaceTexture={cachedEffects.SurfaceTexture}
          interactiveLighting={interactiveLighting}
        />
      </Card3DTransform>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for optimal performance
  const effectsChanged = JSON.stringify(prevProps.effectValues) !== JSON.stringify(nextProps.effectValues);
  const mouseChanged = Math.abs(prevProps.mousePosition.x - nextProps.mousePosition.x) > 0.01 || 
                      Math.abs(prevProps.mousePosition.y - nextProps.mousePosition.y) > 0.01;
  const rotationChanged = Math.abs(prevProps.rotation.x - nextProps.rotation.x) > 0.01 || 
                         Math.abs(prevProps.rotation.y - nextProps.rotation.y) > 0.01;

  // Only re-render if significant changes occurred
  return !effectsChanged && 
         !mouseChanged && 
         !rotationChanged &&
         prevProps.isFlipped === nextProps.isFlipped &&
         prevProps.isHovering === nextProps.isHovering &&
         prevProps.showEffects === nextProps.showEffects &&
         prevProps.zoom === nextProps.zoom &&
         prevProps.isDragging === nextProps.isDragging &&
         prevProps.interactiveLighting === nextProps.interactiveLighting;
});

EnhancedCardContainer.displayName = 'EnhancedCardContainer';
