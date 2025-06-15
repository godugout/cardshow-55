
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

interface EdgeGlowProps {
  emissiveColor: THREE.Color;
  emissiveIntensity: number;
}

// Utility function to create edge glow properties
export const createEdgeGlowProps = (
  effectValues: EffectValues,
  isHovering: boolean = false,
  interactiveLighting: boolean = false
): EdgeGlowProps => {
  // Get the dominant effect to determine glow color
  const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
    effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 10
  );
  
  if (activeEffects.length === 0) {
    return {
      emissiveColor: new THREE.Color(0x4a90e2), // Default blue
      emissiveIntensity: 0.5
    };
  }
  
  // Find the effect with highest intensity
  const dominantEffect = activeEffects.reduce((max, current) => 
    (current[1].intensity as number) > (max[1].intensity as number) ? current : max
  );
  
  const [effectId, effect] = dominantEffect;
  const intensity = (effect.intensity as number) / 100;
  
  // Color mapping for different effects
  const colorMap: Record<string, number> = {
    holographic: 0x00ffff,
    gold: 0xffd700,
    chrome: 0xc0c0c0,
    crystal: 0xffffff,
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
  let finalIntensity = intensity * 1.2; // Base intensity increased
  
  // Boost intensity for hovering and interactive lighting
  if (isHovering && interactiveLighting) {
    finalIntensity *= 2.0;
  } else if (isHovering) {
    finalIntensity *= 1.5;
  }
  
  return {
    emissiveColor: new THREE.Color(baseColor),
    emissiveIntensity: Math.min(finalIntensity, 2.0) // Increased max intensity
  };
};

// Hook to create materials for card faces
export const useCardFaceMaterials = (
  card: Simple3DCard,
  effectValues: EffectValues,
  isHovering: boolean = false,
  interactiveLighting: boolean = false
): THREE.Material[] => {
  // Load front texture
  const frontTexture = useTexture(card.image_url || '/placeholder-card.jpg');
  
  // Get edge glow properties
  const edgeGlowProps = createEdgeGlowProps(effectValues, isHovering, interactiveLighting);

  // Create materials array for box geometry faces
  // Order: [+X, -X, +Y, -Y, +Z, -Z] = [right, left, top, bottom, front, back]
  const materials: THREE.Material[] = [
    // Right side (+X) - Edge glow material
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: 0.9
    }),
    // Left side (-X) - Edge glow material
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: 0.9
    }),
    // Top side (+Y) - Edge glow material
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: 0.9
    }),
    // Bottom side (-Y) - Edge glow material
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: edgeGlowProps.emissiveColor,
      emissiveIntensity: edgeGlowProps.emissiveIntensity,
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: 0.9
    }),
    // Front face (+Z) - Card image
    new THREE.MeshStandardMaterial({
      map: frontTexture,
      transparent: false,
      side: THREE.FrontSide
    }),
    // Back face (-Z) - Card back
    new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      transparent: false,
      side: THREE.FrontSide
    })
  ];

  return materials;
};
