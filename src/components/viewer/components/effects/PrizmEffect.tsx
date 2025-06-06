
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

  const prizemIntensity = getEffectParam('prizm', 'intensity', 0);
  const complexity = getEffectParam('prizm', 'complexity', 5);
  const colorSeparation = getEffectParam('prizm', 'colorSeparation', 60);

  if (prizemIntensity <= 0) return null;

  // Calculate base opacity with better scaling for lower intensities
  const baseOpacity = Math.min(0.6, (prizemIntensity / 100) * 0.8);
  const geometricOpacity = Math.min(0.4, (prizemIntensity / 100) * 0.6);

  // Muted spectrum colors - balanced and desaturated
  const spectrumColors = [
    `rgba(220, 60, 60, ${baseOpacity * 0.7})`,    // Muted red
    `rgba(220, 120, 40, ${baseOpacity * 0.8})`,   // Muted orange
    `rgba(200, 180, 40, ${baseOpacity * 0.9})`,   // Muted yellow
    `rgba(80, 180, 60, ${baseOpacity * 0.8})`,    // Muted green
    `rgba(40, 140, 180, ${baseOpacity * 0.8})`,   // Muted cyan
    `rgba(60, 80, 200, ${baseOpacity * 0.7})`,    // Muted blue
    `rgba(120, 60, 180, ${baseOpacity * 0.6})`,   // Muted indigo
    `rgba(160, 60, 160, ${baseOpacity * 0.5})`    // Muted violet
  ];

  // Create geometric separation angles based on complexity
  const separationAngle = 360 / Math.max(3, complexity);
  const mouseInfluence = (mousePosition.x + mousePosition.y) * 90;

  return (
    <>
      {/* Primary Spectrum Dispersion with Geometric Separation */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `conic-gradient(
            from ${mouseInfluence}deg at 50% 50%,
            ${spectrumColors[0]} 0deg,
            ${spectrumColors[0]} ${separationAngle * 0.8}deg,
            transparent ${separationAngle * 0.9}deg,
            transparent ${separationAngle * 1.1}deg,
            ${spectrumColors[1]} ${separationAngle * 1.2}deg,
            ${spectrumColors[1]} ${separationAngle * 1.8}deg,
            transparent ${separationAngle * 1.9}deg,
            transparent ${separationAngle * 2.1}deg,
            ${spectrumColors[2]} ${separationAngle * 2.2}deg,
            ${spectrumColors[2]} ${separationAngle * 2.8}deg,
            transparent ${separationAngle * 2.9}deg,
            transparent ${separationAngle * 3.1}deg,
            ${spectrumColors[3]} ${separationAngle * 3.2}deg,
            ${spectrumColors[3]} ${separationAngle * 3.8}deg,
            transparent ${separationAngle * 3.9}deg,
            transparent ${separationAngle * 4.1}deg,
            ${spectrumColors[4]} ${separationAngle * 4.2}deg,
            ${spectrumColors[4]} ${separationAngle * 4.8}deg,
            transparent ${separationAngle * 4.9}deg,
            transparent ${separationAngle * 5.1}deg,
            ${spectrumColors[5]} ${separationAngle * 5.2}deg,
            ${spectrumColors[5]} ${separationAngle * 5.8}deg,
            transparent ${separationAngle * 5.9}deg,
            transparent ${separationAngle * 6.1}deg,
            ${spectrumColors[6]} ${separationAngle * 6.2}deg,
            ${spectrumColors[6]} ${separationAngle * 6.8}deg,
            transparent ${separationAngle * 6.9}deg,
            transparent ${separationAngle * 7.1}deg,
            ${spectrumColors[7]} ${separationAngle * 7.2}deg,
            ${spectrumColors[0]} 360deg
          )`,
          maskImage: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.9) 30%,
            rgba(255, 255, 255, 0.6) 60%,
            rgba(255, 255, 255, 0.2) 85%,
            transparent 100%
          )`,
          WebkitMaskImage: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.9) 30%,
            rgba(255, 255, 255, 0.6) 60%,
            rgba(255, 255, 255, 0.2) 85%,
            transparent 100%
          )`,
          mixBlendMode: 'screen'
        }}
      />

      {/* Secondary Geometric Pattern for Depth */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `linear-gradient(
            ${45 + mousePosition.y * 60}deg,
            ${spectrumColors[1]} 0%,
            transparent 20%,
            ${spectrumColors[3]} 40%,
            transparent 60%,
            ${spectrumColors[5]} 80%,
            transparent 100%
          )`,
          maskImage: `repeating-linear-gradient(
            ${mousePosition.x * 180}deg,
            rgba(255, 255, 255, 1) 0px,
            rgba(255, 255, 255, 1) ${colorSeparation / 10}px,
            transparent ${colorSeparation / 8}px,
            transparent ${colorSeparation / 5}px
          )`,
          WebkitMaskImage: `repeating-linear-gradient(
            ${mousePosition.x * 180}deg,
            rgba(255, 255, 255, 1) 0px,
            rgba(255, 255, 255, 1) ${colorSeparation / 10}px,
            transparent ${colorSeparation / 8}px,
            transparent ${colorSeparation / 5}px
          )`,
          opacity: geometricOpacity,
          mixBlendMode: 'color-dodge'
        }}
      />

      {/* Angular Light Refraction Pattern */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `conic-gradient(
            from ${mousePosition.x * 120 + 180}deg at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
            transparent 0deg,
            ${spectrumColors[2]} ${separationAngle / 2}deg,
            transparent ${separationAngle}deg,
            ${spectrumColors[4]} ${separationAngle * 1.5}deg,
            transparent ${separationAngle * 2}deg,
            ${spectrumColors[6]} ${separationAngle * 2.5}deg,
            transparent ${separationAngle * 3}deg,
            ${spectrumColors[0]} ${separationAngle * 3.5}deg,
            transparent 360deg
          )`,
          opacity: geometricOpacity * 0.7,
          mixBlendMode: 'overlay',
          clipPath: `polygon(
            ${20 + mousePosition.x * 10}% ${20 + mousePosition.y * 10}%,
            ${80 - mousePosition.x * 10}% ${20 + mousePosition.y * 10}%,
            ${70 - mousePosition.x * 5}% ${80 - mousePosition.y * 10}%,
            ${30 + mousePosition.x * 5}% ${80 - mousePosition.y * 10}%
          )`
        }}
      />
    </>
  );
};
