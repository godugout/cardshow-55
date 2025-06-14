
import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { EdgeGlowMaterial } from './EdgeGlowMaterial';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

interface CardFaceMaterialsProps {
  card: Simple3DCard;
  effectValues: EffectValues;
  isHovering?: boolean;
  interactiveLighting?: boolean;
}

export const CardFaceMaterials: React.FC<CardFaceMaterialsProps> = ({
  card,
  effectValues,
  isHovering = false,
  interactiveLighting = false
}) => {
  // Load front texture
  const frontTexture = useTexture(card.image_url || '/placeholder-card.jpg');
  
  // Create materials array for box geometry faces
  // Order: [+X, -X, +Y, -Y, +Z, -Z] = [right, left, top, bottom, front, back]
  const materials = useMemo(() => [
    // Right side (+X)
    <EdgeGlowMaterial
      key="right"
      effectValues={effectValues}
      isHovering={isHovering}
      interactiveLighting={interactiveLighting}
    />,
    // Left side (-X)
    <EdgeGlowMaterial
      key="left"
      effectValues={effectValues}
      isHovering={isHovering}
      interactiveLighting={interactiveLighting}
    />,
    // Top side (+Y)
    <EdgeGlowMaterial
      key="top"
      effectValues={effectValues}
      isHovering={isHovering}
      interactiveLighting={interactiveLighting}
    />,
    // Bottom side (-Y)
    <EdgeGlowMaterial
      key="bottom"
      effectValues={effectValues}
      isHovering={isHovering}
      interactiveLighting={interactiveLighting}
    />,
    // Front face (+Z)
    <meshStandardMaterial
      key="front"
      map={frontTexture}
      transparent
      side={0} // Front side only
    />,
    // Back face (-Z)
    <meshStandardMaterial
      key="back"
      color={0x1a1a1a}
      transparent
      side={0} // Front side only
    />
  ], [frontTexture, effectValues, isHovering, interactiveLighting]);

  return materials;
};
