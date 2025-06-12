
import React from 'react';

interface ColorEffectsLayersProps {
  intensity: number;
  mousePosition: { x: number; y: number };
  blur: number;
}

export const ColorEffectsLayers: React.FC<ColorEffectsLayersProps> = ({
  intensity,
  mousePosition,
  blur
}) => {
  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden">
      {/* Primary Rainbow Spectrum Layer - RESTORED FULL SPECTRUM */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 180}deg at ${50 + mousePosition.x * 25}% ${50 + mousePosition.y * 25}%,
              rgba(255, 0, 127, ${(intensity / 100) * 0.6}) 0deg,
              rgba(255, 127, 0, ${(intensity / 100) * 0.65}) 51deg,
              rgba(255, 255, 0, ${(intensity / 100) * 0.7}) 102deg,
              rgba(127, 255, 0, ${(intensity / 100) * 0.65}) 153deg,
              rgba(0, 255, 127, ${(intensity / 100) * 0.6}) 204deg,
              rgba(0, 127, 255, ${(intensity / 100) * 0.65}) 255deg,
              rgba(127, 0, 255, ${(intensity / 100) * 0.7}) 306deg,
              rgba(255, 0, 127, ${(intensity / 100) * 0.6}) 360deg
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.9,
          filter: `blur(${blur * 0.5}px)`
        }}
      />

      {/* Secondary Prismatic Layer - Enhanced colors */}
      <div
        className="absolute inset-0 z-25"
        style={{
          background: `
            linear-gradient(
              ${90 + mousePosition.y * 45}deg,
              rgba(255, 20, 147, ${(intensity / 100) * 0.5}) 0%,
              rgba(255, 140, 0, ${(intensity / 100) * 0.55}) 20%,
              rgba(50, 205, 50, ${(intensity / 100) * 0.6}) 40%,
              rgba(0, 191, 255, ${(intensity / 100) * 0.55}) 60%,
              rgba(138, 43, 226, ${(intensity / 100) * 0.5}) 80%,
              rgba(255, 69, 0, ${(intensity / 100) * 0.45}) 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.7,
          filter: `blur(${blur * 0.8}px)`
        }}
      />

      {/* Tertiary Rainbow Burst */}
      <div
        className="absolute inset-0 z-26"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 215, 0, ${(intensity / 100) * 0.4}) 0%,
              rgba(255, 105, 180, ${(intensity / 100) * 0.45}) 25%,
              rgba(0, 255, 255, ${(intensity / 100) * 0.4}) 50%,
              rgba(50, 205, 50, ${(intensity / 100) * 0.35}) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.8
        }}
      />
    </div>
  );
};
