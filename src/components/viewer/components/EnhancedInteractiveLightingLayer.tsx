
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EnhancedInteractiveLightingLayerProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  interactiveLightingEnabled: boolean;
}

export const EnhancedInteractiveLightingLayer: React.FC<EnhancedInteractiveLightingLayerProps> = ({
  effectValues,
  mousePosition,
  isHovering,
  interactiveLightingEnabled
}) => {
  if (!interactiveLightingEnabled || !isHovering) {
    return null;
  }

  // Use simple numeric values from effectValues
  const holographicIntensity = effectValues.holographic || 0;
  const chromeIntensity = effectValues.chrome || 0;
  const foilIntensity = effectValues.foil || 0;
  const prismaticIntensity = effectValues.prismatic || 0;

  const lightingStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
      rgba(255,255,255,${holographicIntensity / 200}) 0%, 
      rgba(100,200,255,${chromeIntensity / 300}) 30%, 
      rgba(255,100,200,${foilIntensity / 400}) 60%, 
      transparent 80%)`,
    mixBlendMode: 'overlay',
    opacity: 0.6,
    pointerEvents: 'none',
    transition: 'all 0.1s ease-out'
  };

  return <div style={lightingStyle} />;
};
