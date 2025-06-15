
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

// Utility function to create edge glow properties with null safety
export const createEdgeGlowProps = (
  effectValues: EffectValues = {},
  isHovering: boolean = false,
  interactiveLighting: boolean = false
): { emissiveColor: THREE.Color; emissiveIntensity: number } => {
  // Ensure effectValues is valid and has proper structure
  if (!effectValues || typeof effectValues !== 'object') {
    return {
      emissiveColor: new THREE.Color(0x4a90e2),
      emissiveIntensity: 0.5
    };
  }

  // Get the dominant effect to determine glow color with null safety
  const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
    effect && 
    typeof effect === 'object' && 
    effect.intensity && 
    typeof effect.intensity === 'number' && 
    effect.intensity > 10
  );
  
  if (activeEffects.length === 0) {
    return {
      emissiveColor: new THREE.Color(0x4a90e2),
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
  let finalIntensity = intensity * 1.5;
  
  // Boost intensity for hovering and interactive lighting
  if (isHovering && interactiveLighting) {
    finalIntensity *= 2.5;
  } else if (isHovering) {
    finalIntensity *= 1.8;
  }
  
  return {
    emissiveColor: new THREE.Color(baseColor),
    emissiveIntensity: Math.min(finalIntensity, 3.0)
  };
};

// Hook to create materials for card faces with comprehensive null safety
export const useCardFaceMaterials = (
  card: Simple3DCard | null,
  effectValues: EffectValues = {},
  isHovering: boolean = false,
  interactiveLighting: boolean = false
): THREE.Material[] => {
  // Ensure card has valid structure
  const safeCard = card || { id: 'default', title: 'Default Card' };
  
  // Ensure effectValues is properly structured
  const safeEffectValues = effectValues && typeof effectValues === 'object' ? effectValues : {};

  // Get specialized materials for front and back with null safety
  const frontMaterial = useCardFrontMaterial(safeCard, safeEffectValues, isHovering, interactiveLighting);
  const backMaterial = useCardBackMaterial(safeEffectValues, isHovering, interactiveLighting);
  
  // Get edge glow properties with null safety - using useMemo with proper dependency array
  const edgeGlowProps = useMemo(() => 
    createEdgeGlowProps(safeEffectValues, isHovering, interactiveLighting),
    [safeEffectValues, isHovering, interactiveLighting]
  );

  // Create materials array for box geometry faces with useMemo for performance
  const materials: THREE.Material[] = useMemo(() => {
    // Create edge material
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.4,
      roughness: 0.6,
      transparent: true,
      opacity: 0.95
    });

    // Order: [+X, -X, +Y, -Y, +Z, -Z] = [right, left, top, bottom, front, back]
    return [
      edgeMaterial, // Right side (+X)
      edgeMaterial.clone(), // Left side (-X)
      edgeMaterial.clone(), // Top side (+Y)
      edgeMaterial.clone(), // Bottom side (-Y)
      frontMaterial, // Front face (+Z)
      backMaterial // Back face (-Z)
    ];
  }, [frontMaterial, backMaterial, edgeGlowProps]);

  return materials;
};
