
import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

interface CardFrontMaterialProps {
  card: Simple3DCard;
  effectValues: EffectValues;
  isHovering?: boolean;
  interactiveLighting?: boolean;
}

export const useCardFrontMaterial = (
  card: Simple3DCard,
  effectValues: EffectValues,
  isHovering: boolean = false,
  interactiveLighting: boolean = false
): THREE.Material => {
  // Load the card image texture
  const cardTexture = useTexture(card.image_url || '/placeholder-card.jpg');

  return useMemo(() => {
    // Get the dominant effect to determine front material properties
    const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
      effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 10
    );

    let emissiveColor = 0x000000;
    let emissiveIntensity = 0;
    let metalness = 0.1;
    let roughness = 0.3;

    if (activeEffects.length > 0) {
      const dominantEffect = activeEffects.reduce((max, current) => 
        (current[1].intensity as number) > (max[1].intensity as number) ? current : max
      );

      const [effectId, effect] = dominantEffect;
      const intensity = (effect.intensity as number) / 100;

      // Apply subtle effects to the front face
      switch (effectId) {
        case 'holographic':
          emissiveColor = 0x4a3570;
          emissiveIntensity = intensity * 0.15;
          metalness = 0.2;
          roughness = 0.2;
          break;
        case 'crystal':
          emissiveColor = 0x94a3b8;
          emissiveIntensity = intensity * 0.1;
          metalness = 0.1;
          roughness = 0.1;
          break;
        case 'chrome':
          emissiveColor = 0x85929e;
          emissiveIntensity = intensity * 0.1;
          metalness = 0.6;
          roughness = 0.1;
          break;
        case 'gold':
          emissiveColor = 0xdaa520;
          emissiveIntensity = intensity * 0.2;
          metalness = 0.5;
          roughness = 0.2;
          break;
        case 'vintage':
          emissiveColor = 0xa1887f;
          emissiveIntensity = intensity * 0.05;
          metalness = 0.1;
          roughness = 0.6;
          break;
        case 'prizm':
          emissiveColor = 0xff69b4;
          emissiveIntensity = intensity * 0.25;
          metalness = 0.3;
          roughness = 0.3;
          break;
      }

      // Boost for hovering
      if (isHovering) {
        emissiveIntensity *= interactiveLighting ? 1.8 : 1.3;
      }
    }

    const material = new THREE.MeshStandardMaterial({
      map: cardTexture,
      emissive: new THREE.Color(emissiveColor),
      emissiveIntensity: Math.min(emissiveIntensity, 0.5), // Keep front subtle
      metalness,
      roughness,
      transparent: false,
      side: THREE.FrontSide
    });

    return material;
  }, [card.image_url, effectValues, isHovering, interactiveLighting, cardTexture]);
};
