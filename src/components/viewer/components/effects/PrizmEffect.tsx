
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

  // MAXIMUM VIBRANCY - Significantly increased opacity for starlight effect
  const baseOpacity = Math.min(0.95, (prizmIntensity / 100) * 1.0);
  const secondaryOpacity = Math.min(0.85, (prizmIntensity / 100) * 0.8);

  // ULTRA-VIBRANT rainbow colors - Enhanced saturation for starlight
  const refractionColors = [
    `rgba(255, 20, 60, ${baseOpacity})`,         // Vibrant red-pink
    `rgba(255, 140, 0, ${baseOpacity})`,        // Bright orange
    `rgba(255, 220, 0, ${baseOpacity})`,        // Golden yellow
    `rgba(50, 255, 50, ${baseOpacity})`,        // Bright green
    `rgba(0, 150, 255, ${baseOpacity})`,        // Electric blue
    `rgba(120, 50, 255, ${baseOpacity})`,       // Purple
    `rgba(255, 50, 200, ${baseOpacity})`        // Magenta
  ];

  // Mouse influence for dynamic directional refraction
  const lightAngle = Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI);
  const dispersal = (complexity / 10) * 80; // Increased spread for more dramatic effect

  return (
    <>
      {/* Primary Rainbow Spectrum Layer - MAXIMUM VIBRANCY */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            conic-gradient(
              from ${lightAngle}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${refractionColors[0]} 0deg,
              ${refractionColors[1]} 51deg,
              ${refractionColors[2]} 102deg,
              ${refractionColors[3]} 153deg,
              ${refractionColors[4]} 204deg,
              ${refractionColors[5]} 255deg,
              ${refractionColors[6]} 306deg,
              ${refractionColors[0]} 360deg
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: baseOpacity
        }}
      />

      {/* Secondary Dispersal Layer - Enhanced rainbow bands */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${lightAngle + dispersal}deg,
              transparent 10%,
              ${refractionColors[0]} 15%,
              ${refractionColors[1]} 25%,
              ${refractionColors[2]} 35%,
              ${refractionColors[3]} 45%,
              ${refractionColors[4]} 55%,
              ${refractionColors[5]} 65%,
              ${refractionColors[6]} 75%,
              transparent 90%
            )
          `,
          opacity: secondaryOpacity * (colorSeparation / 100),
          mixBlendMode: 'screen'
        }}
      />

      {/* Tertiary Layer - Dynamic color bleeding - ENHANCED */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 60% at ${20 + mousePosition.x * 60}% ${20 + mousePosition.y * 60}%,
              ${refractionColors[2]} 0%,
              ${refractionColors[4]} 35%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 70% 50% at ${80 - mousePosition.x * 40}% ${80 - mousePosition.y * 40}%,
              ${refractionColors[5]} 0%,
              ${refractionColors[0]} 30%,
              transparent 60%
            )
          `,
          opacity: baseOpacity * 0.7,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Prism Edge Effects - Sharp color separation - ENHANCED */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-linear-gradient(
              ${lightAngle - dispersal * 0.3}deg,
              transparent 0px,
              ${refractionColors[0]} 2px,
              ${refractionColors[2]} 4px,
              ${refractionColors[4]} 6px,
              ${refractionColors[6]} 8px,
              transparent 10px,
              transparent 15px
            )
          `,
          opacity: secondaryOpacity * 0.6,
          mixBlendMode: 'hard-light'
        }}
      />

      {/* NEW: Starlight Chromatic Aberration Effect */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 50, 100, ${baseOpacity * 0.6}) 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at ${(mousePosition.x * 100) + 4}% ${(mousePosition.y * 100) + 3}%,
              rgba(50, 255, 150, ${baseOpacity * 0.6}) 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at ${(mousePosition.x * 100) - 4}% ${(mousePosition.y * 100) - 3}%,
              rgba(100, 50, 255, ${baseOpacity * 0.6}) 0%,
              transparent 40%
            )
          `,
          opacity: 0.8,
          mixBlendMode: 'color-dodge'
        }}
      />
    </>
  );
};
