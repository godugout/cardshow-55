
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
  isHovering: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  interactiveLighting?: boolean;
  cardEffects?: any;
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
  isHovering,
  effectValues,
  mousePosition,
  isDragging,
  interactiveLighting = false,
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
      {/* Front Face */}
      <Card3DFace
        card={card}
        isBack={false}
        isHovering={isHovering}
        effectValues={effectValues}
        mousePosition={mousePosition}
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
      
      {/* Back Face */}
      <Card3DFace
        card={card}
        isBack={true}
        isHovering={isHovering}
        effectValues={effectValues}
        mousePosition={mousePosition}
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
      
      {/* Invisible collision mesh for interactions */}
      <mesh 
        castShadow 
        receiveShadow
        onPointerEnter={onMouseEnter}
        onPointerLeave={onMouseLeave}
      >
        <boxGeometry args={[3.2, 4.5, 0.02]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};
