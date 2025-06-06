
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

  // Scale opacity more subtly - capping at 0.3 for maximum intensity
  const baseOpacity = Math.min(0.3, (prizmIntensity / 100) * 0.25);
  const secondaryOpacity = Math.min(0.2, (prizmIntensity / 100) * 0.15);

  // Muted, balanced spectrum colors with lower opacity
  const spectrumColors = [
    `rgba(210, 70, 70, ${baseOpacity * 0.9})`,     // Muted red
    `rgba(210, 130, 60, ${baseOpacity * 0.95})`,    // Muted orange
    `rgba(190, 170, 60, ${baseOpacity})`,          // Muted yellow
    `rgba(100, 170, 80, ${baseOpacity * 0.95})`,    // Muted green
    `rgba(70, 150, 180, ${baseOpacity * 0.9})`,     // Muted cyan
    `rgba(80, 100, 190, ${baseOpacity * 0.85})`,    // Muted blue
    `rgba(130, 90, 170, ${baseOpacity * 0.8})`,     // Muted indigo
    `rgba(160, 80, 150, ${baseOpacity * 0.85})`     // Muted violet
  ];

  // Subtle mouse influence - reduced to be less distracting
  const mouseInfluence = (mousePosition.x + mousePosition.y) * 45;
  
  // Gentler transitions based on complexity
  const blendFactor = Math.max(3, 11 - complexity);

  return (
    <>
      {/* Primary Smooth Spectrum Layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `conic-gradient(
            from ${mouseInfluence}deg at 50% 50%,
            ${spectrumColors[0]} 0deg,
            ${spectrumColors[1]} ${45 * blendFactor}deg,
            ${spectrumColors[2]} ${90 * blendFactor}deg,
            ${spectrumColors[3]} ${135 * blendFactor}deg,
            ${spectrumColors[4]} ${180 * blendFactor}deg,
            ${spectrumColors[5]} ${225 * blendFactor}deg,
            ${spectrumColors[6]} ${270 * blendFactor}deg,
            ${spectrumColors[7]} ${315 * blendFactor}deg,
            ${spectrumColors[0]} 360deg
          )`,
          maskImage: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.9) 40%,
            rgba(255, 255, 255, 0.7) 70%,
            rgba(255, 255, 255, 0.4) 85%,
            transparent 100%
          )`,
          WebkitMaskImage: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.9) 40%,
            rgba(255, 255, 255, 0.7) 70%,
            rgba(255, 255, 255, 0.4) 85%,
            transparent 100%
          )`,
          mixBlendMode: 'soft-light'
        }}
      />

      {/* Subtle Secondary Accent Layer */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `linear-gradient(
            ${45 + mousePosition.y * 30}deg,
            ${spectrumColors[1]} 0%,
            transparent 30%,
            ${spectrumColors[3]} 50%,
            transparent 70%,
            ${spectrumColors[5]} 100%
          )`,
          opacity: secondaryOpacity * (0.7 + (colorSeparation / 100) * 0.3),
          mixBlendMode: 'overlay',
          filter: `blur(${Math.max(0, (10 - complexity) * 0.5)}px)`
        }}
      />

      {/* Delicate Edge Highlight */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `radial-gradient(
            circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%,
            transparent 50%,
            ${spectrumColors[2]} 80%,
            ${spectrumColors[4]} 90%,
            ${spectrumColors[6]} 100%
          )`,
          opacity: secondaryOpacity * 0.6,
          mixBlendMode: 'overlay',
          filter: `blur(${0.5}px)`
        }}
      />
    </>
  );
};
