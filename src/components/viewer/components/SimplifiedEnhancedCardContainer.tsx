
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { CardContainer3D } from './CardContainer3D';

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
  onClick
}) => {
  console.log('🎯 SimplifiedEnhancedCardContainer rendering:', {
    cardTitle: card.title,
    cardImage: card.image_url,
    isFlipped,
    zoom,
    rotation
  });

  return (
    <div 
      className={`relative select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        zIndex: 10
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
    </div>
  );
};
