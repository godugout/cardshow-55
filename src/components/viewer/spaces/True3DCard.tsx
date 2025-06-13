
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCardTextures } from './hooks/useCardTextures';
import { CardMesh } from './components/CardMesh';
import { CardText } from './components/CardText';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
  description?: string;
  rarity?: string;
}

interface True3DCardProps {
  card: Simple3DCard;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
  autoRotate?: boolean;
  floatIntensity?: number;
}

export const True3DCard: React.FC<True3DCardProps> = ({
  card,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  onHover,
  autoRotate = false,
  floatIntensity = 0.1
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Card dimensions (trading card proportions with actual thickness)
  const cardWidth = 2.5 * scale;
  const cardHeight = 3.5 * scale;
  const cardDepth = 0.15 * scale;

  const { frontTexture, backTexture, isLoading } = useCardTextures({
    cardImageUrl: card.image_url
  });

  // Enhanced animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      if (floatIntensity > 0) {
        const floatY = Math.sin(state.clock.elapsedTime * 0.8) * floatIntensity;
        groupRef.current.position.y = position[1] + floatY;
      }
    }
  });

  const handleClick = () => {
    console.log('🎯 True3DCard clicked:', card.title);
    onClick?.();
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    onHover?.(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    onHover?.(false);
    document.body.style.cursor = 'default';
  };

  if (isLoading || !frontTexture || !backTexture) {
    return null; // Loading
  }

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
    >
      <CardMesh
        frontTexture={frontTexture}
        backTexture={backTexture}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        cardDepth={cardDepth}
        isHovered={isHovered}
        autoRotate={autoRotate}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      <CardText
        title={card.title}
        rarity={card.rarity}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        cardDepth={cardDepth}
      />
    </group>
  );
};
