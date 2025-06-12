
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { CardContainer3D } from './CardContainer3D';
import { GripFeedback } from './GripFeedback';

interface SimplifiedEnhancedCardContainerProps {
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
  interactiveLighting: boolean;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  environmentControls: any;
  showBackgroundInfo: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  gripPoint?: { x: number; y: number } | null;
  physicsState?: any;
}

export const SimplifiedEnhancedCardContainer: React.FC<SimplifiedEnhancedCardContainerProps> = ({
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
  interactiveLighting,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  gripPoint,
  physicsState
}) => {
  console.log('🎯 SimplifiedEnhancedCardContainer rendering:', {
    cardTitle: card.title,
    cardImage: card.image_url,
    isFlipped,
    zoom,
    rotation,
    gripPoint,
    hasPhysics: !!physicsState
  });

  const containerWidth = 400; // Standard card container width
  const containerHeight = 560; // Standard card container height

  return (
    <div 
      className={`relative select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 10,
        width: `${containerWidth}px`,
        height: `${containerHeight}px`
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardContainer3D
        card={card}
        isFlipped={isFlipped}
        isHovering={isHovering}
        showEffects={showEffects}
        effectValues={effectValues}
        mousePosition={mousePosition}
        rotation={rotation}
        isDragging={isDragging}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        interactiveLighting={interactiveLighting}
        onClick={onClick}
      />
      
      {/* Enhanced Grip Feedback */}
      <GripFeedback
        gripPoint={gripPoint}
        isGripping={physicsState?.isGripping || false}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
      />
      
      {/* Physics Debug Info (optional - remove in production) */}
      {physicsState && isDragging && (
        <div className="absolute top-2 left-2 text-xs text-white/60 font-mono bg-black/20 px-2 py-1 rounded">
          V: {Math.round(physicsState.velocity.x * 100)}, {Math.round(physicsState.velocity.y * 100)}
        </div>
      )}
    </div>
  );
};
