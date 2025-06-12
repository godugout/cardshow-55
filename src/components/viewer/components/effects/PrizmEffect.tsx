
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

  // ENHANCED opacity for maximum vibrancy - INCREASED FROM PREVIOUS
  const baseOpacity = Math.min(0.85, (prizmIntensity / 100) * 0.8);
  const secondaryOpacity = Math.min(0.65, (prizmIntensity / 100) * 0.6);

  // ULTRA-VIBRANT rainbow colors - Enhanced from previous version
  const refractionColors = [
    `rgba(255, 0, 0, ${baseOpacity})`,           // Pure red
    `rgba(255, 127, 0, ${baseOpacity})`,        // Orange
    `rgba(255, 255, 0, ${baseOpacity})`,        // Yellow
    `rgba(0, 255, 0, ${baseOpacity})`,          // Pure green
    `rgba(0, 127, 255, ${baseOpacity})`,        // Deep blue
    `rgba(75, 0, 130, ${baseOpacity})`,         // Indigo
    `rgba(148, 0, 211, ${baseOpacity})`         // Violet
  ];

  // Mouse influence for dynamic directional refraction
  const lightAngle = Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI);
  const dispersal = (complexity / 10) * 60; // Increased spread for more dramatic effect

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
          mixBlendMode: 'screen',
          opacity: baseOpacity * 1.1
        }}
      />

      {/* Secondary Dispersal Layer - Enhanced rainbow bands */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${lightAngle + dispersal}deg,
              transparent 15%,
              ${refractionColors[0]} 20%,
              ${refractionColors[1]} 25%,
              ${refractionColors[2]} 30%,
              ${refractionColors[3]} 35%,
              ${refractionColors[4]} 40%,
              ${refractionColors[5]} 45%,
              ${refractionColors[6]} 50%,
              transparent 85%
            )
          `,
          opacity: secondaryOpacity * (colorSeparation / 100) * 1.2,
          mixBlendMode: 'color-dodge'
        }}
      />

      {/* Tertiary Layer - Dynamic color bleeding - ENHANCED */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              ellipse 70% 50% at ${15 + mousePosition.x * 70}% ${15 + mousePosition.y * 70}%,
              ${refractionColors[2]} 0%,
              ${refractionColors[4]} 30%,
              transparent 65%
            ),
            radial-gradient(
              ellipse 60% 40% at ${85 - mousePosition.x * 50}% ${85 - mousePosition.y * 50}%,
              ${refractionColors[5]} 0%,
              ${refractionColors[0]} 25%,
              transparent 55%
            )
          `,
          opacity: baseOpacity * 0.9,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Prism Edge Effects - Sharp color separation - ENHANCED */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-linear-gradient(
              ${lightAngle - dispersal * 0.5}deg,
              transparent 0px,
              ${refractionColors[0]} 1px,
              ${refractionColors[2]} 3px,
              ${refractionColors[4]} 5px,
              ${refractionColors[6]} 7px,
              transparent 9px,
              transparent 12px
            )
          `,
          opacity: secondaryOpacity * 0.8,
          mixBlendMode: 'soft-light'
        }}
      />

      {/* NEW: Chromatic Aberration Effect - For maximum impact */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 0, 0, ${baseOpacity * 0.4}) 0%,
              transparent 30%
            ),
            radial-gradient(
              circle at ${(mousePosition.x * 100) + 3}% ${(mousePosition.y * 100) + 2}%,
              rgba(0, 255, 0, ${baseOpacity * 0.4}) 0%,
              transparent 30%
            ),
            radial-gradient(
              circle at ${(mousePosition.x * 100) - 3}% ${(mousePosition.y * 100) - 2}%,
              rgba(0, 0, 255, ${baseOpacity * 0.4}) 0%,
              transparent 30%
            )
          `,
          opacity: 0.7,
          mixBlendMode: 'screen'
        }}
      />
    </>
  );
};
