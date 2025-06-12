
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';

interface CardContainer3DProps {
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
  onClick: () => void;
}

export const CardContainer3D: React.FC<CardContainer3DProps> = ({
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
  interactiveLighting,
  onClick
}) => {
  return (
    <div
      className="relative"
      style={{
        width: '400px',
        height: '560px',
        transform: `perspective(1000px) rotateX(${rotation.x * 0.5}deg) rotateY(${rotation.y * 0.5}deg)`,
        transformStyle: 'preserve-3d',
        transition: isDragging ? 'none' : 'transform 0.1s ease',
        filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8))'
      }}
      onClick={onClick}
    >
      {/* Card Front - Always shows card image, positioned normally */}
      <CardFrontContainer
        card={card}
        isFlipped={isFlipped}
        isHovering={isHovering}
        showEffects={showEffects}
        effectValues={effectValues}
        mousePosition={mousePosition}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        interactiveLighting={interactiveLighting}
        onClick={onClick}
      />

      {/* Card Back - Always shows CRD logo, positioned 180deg behind front */}
      <CardBackContainer
        isFlipped={isFlipped}
        isHovering={isHovering}
        showEffects={showEffects}
        effectValues={effectValues}
        mousePosition={mousePosition}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        interactiveLighting={interactiveLighting}
      />
    </div>
  );
};
