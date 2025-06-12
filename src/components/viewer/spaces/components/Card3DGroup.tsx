
import React from 'react';
import { Card3DFace } from './Card3DFace';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

interface Card3DGroupProps {
  card: Simple3DCard;
  groupRef: React.RefObject<any>;
  isFlipped: boolean;
  isHovering: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  isDragging: boolean;
  interactiveLighting: boolean;
  cardEffects: any;
  onMouseDown: (e: any) => void;
  onMouseMove: (e: any) => void;
  onMouseUp: (e: any) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCardFlip: () => void;
}

export const Card3DGroup: React.FC<Card3DGroupProps> = ({
  card,
  groupRef,
  isFlipped,
  isHovering,
  effectValues,
  mousePosition,
  rotation,
  isDragging,
  interactiveLighting,
  cardEffects,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseEnter,
  onMouseLeave,
  onCardFlip
}) => {
  return (
    <group ref={groupRef}>
      <Card3DFace
        card={card}
        isBack={false}
        isHovering={isHovering}
        effectValues={effectValues}
        mousePosition={mousePosition}
        rotation={rotation} // Pass rotation for automatic face detection
        isDragging={isDragging}
        interactiveLighting={interactiveLighting}
        cardEffects={cardEffects}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onCardFlip={onCardFlip}
      />
    </group>
  );
};
