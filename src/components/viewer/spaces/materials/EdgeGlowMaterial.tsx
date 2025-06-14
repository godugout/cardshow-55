
import React, { useMemo } from 'react';
import { Color } from 'three';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface EdgeGlowMaterialProps {
  effectValues: EffectValues;
  isHovering?: boolean;
  interactiveLighting?: boolean;
}

export const EdgeGlowMaterial: React.FC<EdgeGlowMaterialProps> = ({
  effectValues,
  isHovering = false,
  interactiveLighting = false
}) => {
  const { emissiveColor, emissiveIntensity } = useMemo(() => {
    // Get the dominant effect to determine glow color
    const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
      effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 10
    );
    
    if (activeEffects.length === 0) {
      return {
        emissiveColor: new Color(0x4a90e2), // Default blue
        emissiveIntensity: 0.3
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
    let finalIntensity = intensity * 0.8; // Base intensity
    
    // Boost intensity for hovering and interactive lighting
    if (isHovering && interactiveLighting) {
      finalIntensity *= 1.5;
    } else if (isHovering) {
      finalIntensity *= 1.2;
    }
    
    return {
      emissiveColor: new Color(baseColor),
      emissiveIntensity: Math.min(finalIntensity, 1.0)
    };
  }, [effectValues, isHovering, interactiveLighting]);

  return (
    <meshStandardMaterial
      color={0x1a1a1a}
      emissive={emissiveColor}
      emissiveIntensity={emissiveIntensity}
      metalness={0.3}
      roughness={0.7}
      transparent
      opacity={0.9}
    />
  );
};
