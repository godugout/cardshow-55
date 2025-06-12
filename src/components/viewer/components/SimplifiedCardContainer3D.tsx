
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { True3DCardContainer } from './True3DCardContainer';

interface SimplifiedCardContainer3DProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting: boolean;
}

export const SimplifiedCardContainer3D: React.FC<SimplifiedCardContainer3DProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting
}) => {
  // Note: isFlipped is now ignored as the card automatically shows the correct face based on rotation
  return (
    <True3DCardContainer
      card={card}
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
    />
  );
};
