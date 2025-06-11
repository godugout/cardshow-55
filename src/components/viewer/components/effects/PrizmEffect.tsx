
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

  // Enhanced opacity for much more vibrant rainbow colors
  const baseOpacity = Math.min(0.65, (prizmIntensity / 100) * 0.6);
  const secondaryOpacity = Math.min(0.45, (prizmIntensity / 100) * 0.4);

  // Full spectrum rainbow colors - much more vibrant
  const refractionColors = [
    `rgba(255, 50, 50, ${baseOpacity})`,        // Vibrant red
    `rgba(255, 165, 0, ${baseOpacity})`,        // Orange
    `rgba(255, 255, 0, ${baseOpacity})`,        // Yellow
    `rgba(50, 255, 50, ${baseOpacity})`,        // Green
    `rgba(0, 191, 255, ${baseOpacity})`,        // Deep sky blue
    `rgba(75, 0, 130, ${baseOpacity})`,         // Indigo
    `rgba(238, 130, 238, ${baseOpacity})`       // Violet
  ];

  // Mouse influence for dynamic directional refraction
  const lightAngle = Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI);
  const dispersal = (complexity / 10) * 45; // Increased spread

  return (
    <>
      {/* Primary Rainbow Spectrum Layer */}
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
          mixBlendMode: 'screen',
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
              transparent 20%,
              ${refractionColors[0]} 25%,
              ${refractionColors[1]} 30%,
              ${refractionColors[2]} 35%,
              ${refractionColors[3]} 40%,
              ${refractionColors[4]} 45%,
              ${refractionColors[5]} 50%,
              ${refractionColors[6]} 55%,
              transparent 80%
            )
          `,
          opacity: secondaryOpacity * (colorSeparation / 100),
          mixBlendMode: 'color-dodge'
        }}
      />

      {/* Tertiary Layer - Dynamic color bleeding */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              ellipse 60% 40% at ${20 + mousePosition.x * 60}% ${20 + mousePosition.y * 60}%,
              ${refractionColors[2]} 0%,
              ${refractionColors[4]} 30%,
              transparent 60%
            ),
            radial-gradient(
              ellipse 50% 30% at ${80 - mousePosition.x * 40}% ${80 - mousePosition.y * 40}%,
              ${refractionColors[5]} 0%,
              ${refractionColors[0]} 25%,
              transparent 50%
            )
          `,
          opacity: baseOpacity * 0.8,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Prism Edge Effects - Sharp color separation */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-linear-gradient(
              ${lightAngle - dispersal * 0.5}deg,
              transparent 0px,
              ${refractionColors[0]} 2px,
              ${refractionColors[2]} 4px,
              ${refractionColors[4]} 6px,
              ${refractionColors[6]} 8px,
              transparent 10px,
              transparent 15px
            )
          `,
          opacity: secondaryOpacity * 0.7,
          mixBlendMode: 'soft-light'
        }}
      />

      {/* Chromatic Aberration Effect */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${refractionColors[0]} 0%,
              transparent 25%
            ),
            radial-gradient(
              circle at ${(mousePosition.x * 100) + 2}% ${(mousePosition.y * 100) + 1}%,
              ${refractionColors[3]} 0%,
              transparent 25%
            ),
            radial-gradient(
              circle at ${(mousePosition.x * 100) - 2}% ${(mousePosition.y * 100) - 1}%,
              ${refractionColors[4]} 0%,
              transparent 25%
            )
          `,
          opacity: baseOpacity * 0.6,
          mixBlendMode: 'multiply'
        }}
      />
    </>
  );
};
