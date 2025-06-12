
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

  // Realistic prism effect - authentic holographic appearance
  const baseOpacity = Math.min(0.35, (prizmIntensity / 100) * 0.35); // Max 35% opacity
  const secondaryOpacity = Math.min(0.25, (prizmIntensity / 100) * 0.25);

  // Authentic holographic colors - more subtle and realistic
  const prismColors = [
    `rgba(255, 100, 150, ${baseOpacity * 0.7})`,    // Soft pink-red
    `rgba(255, 180, 100, ${baseOpacity * 0.6})`,    // Warm orange
    `rgba(255, 240, 120, ${baseOpacity * 0.5})`,    // Golden yellow
    `rgba(150, 255, 180, ${baseOpacity * 0.6})`,    // Soft green
    `rgba(120, 200, 255, ${baseOpacity * 0.7})`,    // Sky blue
    `rgba(180, 150, 255, ${baseOpacity * 0.6})`,    // Soft purple
  ];

  // Realistic light refraction calculation
  const lightAngle = Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI);
  const lightDistance = Math.sqrt(Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2));
  const refractionAngle = lightAngle + (complexity * 5); // Realistic refraction offset

  return (
    <>
      {/* Primary Holographic Layer - Realistic spectrum separation */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            conic-gradient(
              from ${refractionAngle}deg at ${45 + mousePosition.x * 10}% ${45 + mousePosition.y * 10}%,
              ${prismColors[0]} 0deg,
              ${prismColors[1]} 60deg,
              ${prismColors[2]} 120deg,
              ${prismColors[3]} 180deg,
              ${prismColors[4]} 240deg,
              ${prismColors[5]} 300deg,
              ${prismColors[0]} 360deg
            )
          `,
          mixBlendMode: 'overlay',
          opacity: baseOpacity * (0.7 + lightDistance * 0.3)
        }}
      />

      {/* Secondary Refraction Bands */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${refractionAngle + 30}deg,
              transparent 20%,
              ${prismColors[0]} 30%,
              transparent 35%,
              ${prismColors[2]} 45%,
              transparent 50%,
              ${prismColors[4]} 60%,
              transparent 70%
            )
          `,
          opacity: secondaryOpacity * (colorSeparation / 100),
          mixBlendMode: 'color-dodge'
        }}
      />

      {/* Fresnel Reflection Edge Effect */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              ellipse 60% 40% at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              ${prismColors[1]} 0%,
              ${prismColors[3]} 30%,
              transparent 60%
            )
          `,
          opacity: baseOpacity * 0.4 * lightDistance,
          mixBlendMode: 'soft-light'
        }}
      />

      {/* Subtle Rainbow Edge Glow */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            linear-gradient(
              ${refractionAngle}deg,
              transparent 0%,
              rgba(255, 255, 255, ${baseOpacity * 0.3}) 45%,
              transparent 50%,
              rgba(255, 255, 255, ${baseOpacity * 0.3}) 55%,
              transparent 100%
            )
          `,
          opacity: 0.6,
          mixBlendMode: 'screen'
        }}
      />
    </>
  );
};
