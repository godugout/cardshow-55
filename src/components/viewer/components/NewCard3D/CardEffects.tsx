
import React from 'react';
import type { EffectConfig } from './types';

interface CardEffectsProps {
  effects?: EffectConfig;
  isHovering: boolean;
  mousePosition: { x: number; y: number };
}

export const CardEffects: React.FC<CardEffectsProps> = ({
  effects = {},
  isHovering,
  mousePosition
}) => {
  if (!effects || Object.keys(effects).length === 0) {
    return null;
  }

  const { holographic = 0, chrome = 0, foil = 0, brightness = 100 } = effects;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Holographic Effect */}
      {holographic > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              transparent 30%,
              rgba(255, 0, 150, ${holographic * 0.003}) 40%,
              rgba(0, 255, 255, ${holographic * 0.003}) 50%,
              rgba(255, 255, 0, ${holographic * 0.003}) 60%,
              transparent 70%
            )`,
            opacity: isHovering ? 1 : 0.7,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Chrome Effect */}
      {chrome > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              ${135 + mousePosition.y * 45}deg,
              rgba(200, 200, 255, ${chrome * 0.002}) 0%,
              rgba(150, 150, 200, ${chrome * 0.001}) 50%,
              rgba(100, 100, 150, ${chrome * 0.002}) 100%
            )`,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Foil Effect */}
      {foil > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 215, 0, ${foil * 0.002}) 0%,
              rgba(255, 165, 0, ${foil * 0.001}) 30%,
              transparent 60%
            )`,
            opacity: isHovering ? 0.8 : 0.5,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Interactive Lighting */}
      {isHovering && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 60% 40% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.05) 40%,
              transparent 70%
            )`,
            mixBlendMode: 'soft-light'
          }}
        />
      )}
    </div>
  );
};
