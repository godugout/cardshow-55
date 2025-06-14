
import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface CardBackMaterialProps {
  effectValues: EffectValues;
  isHovering?: boolean;
  interactiveLighting?: boolean;
}

export const useCardBackMaterial = (
  effectValues: EffectValues,
  isHovering: boolean = false,
  interactiveLighting: boolean = false
): THREE.Material => {
  // Load the CRD logo texture with error handling
  let crdLogoTexture;
  try {
    crdLogoTexture = useTexture('/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png');
  } catch (error) {
    console.warn('Failed to load CRD logo texture:', error);
    crdLogoTexture = null;
  }

  return useMemo(() => {
    // Get the dominant effect to determine back material
    const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
      effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 10
    );

    let baseColor = 0x1a1a1a; // Default dark
    let emissiveColor = 0x000000;
    let emissiveIntensity = 0;
    let metalness = 0.1;
    let roughness = 0.8;

    if (activeEffects.length > 0) {
      const dominantEffect = activeEffects.reduce((max, current) => 
        (current[1].intensity as number) > (max[1].intensity as number) ? current : max
      );

      const [effectId, effect] = dominantEffect;
      const intensity = (effect.intensity as number) / 100;

      // Material mapping for different effects
      switch (effectId) {
        case 'holographic':
          baseColor = 0x2d1b4e;
          emissiveColor = 0x8a2be2;
          emissiveIntensity = intensity * 0.3;
          metalness = 0.2;
          roughness = 0.4;
          break;
        case 'crystal':
          baseColor = 0xe2e8f0;
          emissiveColor = 0x94a3b8;
          emissiveIntensity = intensity * 0.2;
          metalness = 0.1;
          roughness = 0.3;
          break;
        case 'chrome':
          baseColor = 0x5d6d7e;
          emissiveColor = 0xaeb6bf;
          emissiveIntensity = intensity * 0.2;
          metalness = 0.8;
          roughness = 0.2;
          break;
        case 'gold':
          baseColor = 0xb8860b;
          emissiveColor = 0xffd700;
          emissiveIntensity = intensity * 0.3;
          metalness = 0.7;
          roughness = 0.3;
          break;
        case 'vintage':
          baseColor = 0x5d4037;
          emissiveColor = 0xbcaaa4;
          emissiveIntensity = intensity * 0.1;
          metalness = 0.2;
          roughness = 0.9;
          break;
        case 'prizm':
          baseColor = 0xff50b4;
          emissiveColor = 0xff78b4;
          emissiveIntensity = intensity * 0.4;
          metalness = 0.3;
          roughness = 0.5;
          break;
      }

      // Boost for hovering
      if (isHovering) {
        emissiveIntensity *= interactiveLighting ? 2.0 : 1.5;
      }
    }

    const materialConfig: THREE.MeshStandardMaterialParameters = {
      color: baseColor,
      emissive: new THREE.Color(emissiveColor),
      emissiveIntensity: Math.min(emissiveIntensity, 1.0),
      metalness,
      roughness,
      transparent: true,
      opacity: 0.9,
      side: THREE.FrontSide
    };

    // Only add the texture map if it loaded successfully
    if (crdLogoTexture) {
      materialConfig.map = crdLogoTexture;
    }

    const material = new THREE.MeshStandardMaterial(materialConfig);

    return material;
  }, [effectValues, isHovering, interactiveLighting, crdLogoTexture]);
};
