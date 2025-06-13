
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCardTextures } from './hooks/useCardTextures';
import { CardMesh } from './components/CardMesh';
import { CardText } from './components/CardText';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { LightingPreset, MaterialSettings } from '../types';

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
  effectValues?: EffectValues;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
}

export const True3DCard: React.FC<True3DCardProps> = ({
  card,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  onHover,
  autoRotate = false,
  floatIntensity = 0.1,
  effectValues = {},
  selectedLighting,
  materialSettings
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

  // Enhanced animation loop with effect-based modifications
  useFrame((state) => {
    if (groupRef.current) {
      // Enhanced floating animation with effect intensity
      let effectiveFloatIntensity = floatIntensity;
      
      // Increase float intensity for holographic effects
      if (effectValues.holographic && typeof effectValues.holographic.intensity === 'number') {
        effectiveFloatIntensity *= (1 + effectValues.holographic.intensity * 0.5);
      }
      
      if (effectiveFloatIntensity > 0) {
        const floatY = Math.sin(state.clock.elapsedTime * 0.8) * effectiveFloatIntensity * 0.2;
        groupRef.current.position.y = position[1] + floatY;
      }

      // Enhanced auto rotation with chrome effect speed boost
      if (autoRotate) {
        let rotationSpeed = 0.008;
        
        if (effectValues.chrome && typeof effectValues.chrome.intensity === 'number') {
          rotationSpeed *= (1 + effectValues.chrome.intensity * 0.3);
        }
        
        groupRef.current.rotation.y += rotationSpeed;
      }
    }
  });

  const handleClick = () => {
    console.log('🎯 Enhanced True3DCard clicked:', card.title, 'Effects:', effectValues);
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
        effectValues={effectValues}
        selectedLighting={selectedLighting}
        materialSettings={materialSettings}
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
