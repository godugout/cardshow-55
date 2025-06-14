
import { useMemo } from 'react';
import * as THREE from 'three';
import { useCardFrontMaterial } from './CardFrontMaterial';
import { useCardBackMaterial } from './CardBackMaterial';
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

// Utility function to create edge glow properties
export const createEdgeGlowProps = (
  effectValues: EffectValues = {},
  isHovering: boolean = false,
  interactiveLighting: boolean = false
): { emissiveColor: THREE.Color; emissiveIntensity: number } => {
  // Get the dominant effect to determine glow color
  const activeEffects = Object.entries(effectValues || {}).filter(([_, effect]) => 
    effect?.intensity && typeof effect.intensity === 'number' && effect.intensity > 10
  );
  
  if (activeEffects.length === 0) {
    return {
      emissiveColor: new THREE.Color(0x4a90e2), // Default blue
      emissiveIntensity: 0.5
    };
  }
  
  // Find the effect with highest intensity
  const dominantEffect = activeEffects.reduce((max, current) => 
    ((current[1]?.intensity as number) || 0) > ((max[1]?.intensity as number) || 0) ? current : max
  );
  
  const [effectId, effect] = dominantEffect;
  const intensity = ((effect?.intensity as number) || 0) / 100;
  
  // Color mapping for different effects
  const colorMap: Record<string, number> = {
    holographic: 0x8a2be2,
    gold: 0xffd700,
    chrome: 0xc0c0c0,
    crystal: 0x94a3b8,
    prizm: 0xff69b4,
    vintage: 0xd2b48c,
    ice: 0x87ceeb,
    aurora: 0x9370db,
    interference: 0x98fb98,
    foilspray: 0xffa500,
    brushedmetal: 0xa9a9a9,
    waves: 0x4169e1,
    lunar: 0xc0c0c0
  };
  
  const baseColor = colorMap[effectId] || 0x4a90e2;
  let finalIntensity = intensity * 1.5; // Increased base intensity
  
  // Boost intensity for hovering and interactive lighting
  if (isHovering && interactiveLighting) {
    finalIntensity *= 2.5;
  } else if (isHovering) {
    finalIntensity *= 1.8;
  }
  
  return {
    emissiveColor: new THREE.Color(baseColor),
    emissiveIntensity: Math.min(finalIntensity, 3.0) // Increased max intensity
  };
};

// Hook to create materials for card faces with null safety
export const useCardFaceMaterials = (
  card: Simple3DCard | null,
  effectValues: EffectValues = {},
  isHovering: boolean = false,
  interactiveLighting: boolean = false
): THREE.Material[] => {
  // Get specialized materials for front and back with null safety
  const frontMaterial = useCardFrontMaterial(card || { id: 'default', title: 'Default' }, effectValues, isHovering, interactiveLighting);
  const backMaterial = useCardBackMaterial(effectValues, isHovering, interactiveLighting);
  
  // Get edge glow properties with null safety
  const edgeGlowProps = useMemo(() => 
    createEdgeGlowProps(effectValues || {}, isHovering, interactiveLighting),
    [effectValues, isHovering, interactiveLighting]
  );

  // Create materials array for box geometry faces
  // Order: [+X, -X, +Y, -Y, +Z, -Z] = [right, left, top, bottom, front, back]
  const materials: THREE.Material[] = useMemo(() => [
    // Right side (+X) - Edge glow material
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.4,
      roughness: 0.6,
      transparent: true,
      opacity: 0.95
    }),
    // Left side (-X) - Edge glow material
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.4,
      roughness: 0.6,
      transparent: true,
      opacity: 0.95
    }),
    // Top side (+Y) - Edge glow material
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.4,
      roughness: 0.6,
      transparent: true,
      opacity: 0.95
    }),
    // Bottom side (-Y) - Edge glow material
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.4,
      roughness: 0.6,
      transparent: true,
      opacity: 0.95
    }),
    // Front face (+Z) - Card image
    frontMaterial,
    // Back face (-Z) - CRD back
    backMaterial
  ], [frontMaterial, backMaterial, edgeGlowProps]);

  return materials;
};
