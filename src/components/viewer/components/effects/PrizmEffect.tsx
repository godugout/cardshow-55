
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface PrizmEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const PrizmEffect: React.FC<PrizmEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const prizmIntensity = getEffectParam('prizm', 'intensity', 0);
  const complexity = getEffectParam('prizm', 'complexity', 5);
  const colorSeparation = getEffectParam('prizm', 'colorSeparation', 60);

  if (prizmIntensity <= 0) return null;

  // More pronounced rainbow with reduced opacity
  const baseOpacity = Math.min(0.35, (prizmIntensity / 100) * 0.3);
  const secondaryOpacity = Math.min(0.25, (prizmIntensity / 100) * 0.2);

  // Vibrant rainbow spectrum colors - more saturated, less purple
  const rainbowColors = [
    `rgba(255, 60, 60, ${baseOpacity})`,     // Bright red
    `rgba(255, 120, 40, ${baseOpacity})`,    // Orange
    `rgba(255, 200, 40, ${baseOpacity})`,    // Yellow
    `rgba(120, 255, 60, ${baseOpacity})`,    // Green
    `rgba(40, 200, 255, ${baseOpacity})`,    // Cyan
    `rgba(60, 120, 255, ${baseOpacity})`,    // Blue
    `rgba(140, 80, 255, ${baseOpacity * 0.7})`,    // Reduced purple
    `rgba(255, 80, 180, ${baseOpacity * 0.8})`     // Pink
  ];

  // Subtle mouse influence
  const mouseInfluence = (mousePosition.x + mousePosition.y) * 60;
  
  // Smoother transitions
  const blendFactor = Math.max(2, 8 - complexity);

  return (
    <>
      {/* Primary Rainbow Spectrum Layer - No lines, smooth gradients */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `conic-gradient(
            from ${mouseInfluence}deg at 50% 50%,
            ${rainbowColors[0]} 0deg,
            ${rainbowColors[1]} ${45 * blendFactor}deg,
            ${rainbowColors[2]} ${90 * blendFactor}deg,
            ${rainbowColors[3]} ${135 * blendFactor}deg,
            ${rainbowColors[4]} ${180 * blendFactor}deg,
            ${rainbowColors[5]} ${225 * blendFactor}deg,
            ${rainbowColors[6]} ${270 * blendFactor}deg,
            ${rainbowColors[7]} ${315 * blendFactor}deg,
            ${rainbowColors[0]} 360deg
          )`,
          maskImage: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.95) 30%,
            rgba(255, 255, 255, 0.8) 60%,
            rgba(255, 255, 255, 0.5) 80%,
            transparent 100%
          )`,
          WebkitMaskImage: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.95) 30%,
            rgba(255, 255, 255, 0.8) 60%,
            rgba(255, 255, 255, 0.5) 80%,
            transparent 100%
          )`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Secondary Rainbow Layer for Depth */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `radial-gradient(
            circle at ${50 + mousePosition.x * 25}% ${50 + mousePosition.y * 25}%,
            ${rainbowColors[2]} 0%,
            ${rainbowColors[4]} 30%,
            ${rainbowColors[1]} 60%,
            ${rainbowColors[5]} 90%,
            transparent 100%
          )`,
          opacity: secondaryOpacity * (0.8 + (colorSeparation / 100) * 0.4),
          mixBlendMode: 'color-dodge'
        }}
      />

      {/* Soft Rainbow Highlight */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `linear-gradient(
            ${mousePosition.x * 180 + 45}deg,
            ${rainbowColors[0]} 0%,
            ${rainbowColors[2]} 25%,
            ${rainbowColors[4]} 50%,
            ${rainbowColors[6]} 75%,
            ${rainbowColors[0]} 100%
          )`,
          opacity: secondaryOpacity * 0.8,
          mixBlendMode: 'soft-light',
          filter: `blur(${Math.max(0.5, (8 - complexity) * 0.8)}px)`
        }}
      />
    </>
  );
};
