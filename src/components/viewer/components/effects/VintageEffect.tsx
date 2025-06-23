
import React from 'react';
import type { EffectValues } from '../../hooks/effects/types';

interface VintageEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const VintageEffect: React.FC<VintageEffectProps> = ({ effectValues, mousePosition }) => {
  const vintageEffect = effectValues.vintage;
  const intensity = (vintageEffect?.intensity as number) || 0;
  
  if (intensity === 0) return null;

  const aging = (vintageEffect?.aging as number) || 40;
  const wear = (vintageEffect?.wear as number) || 30;
  
  return (
    <div 
      className="absolute inset-0 z-18 rounded-xl overflow-hidden"
      style={{
        opacity: intensity / 100
      }}
    >
      {/* Paper aging overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 60% at 30% 40%,
              hsla(30, 40%, 75%, ${aging / 100 * 0.3}) 0%,
              hsla(35, 35%, 80%, ${aging / 100 * 0.2}) 40%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 60% 80% at 70% 20%,
              hsla(25, 45%, 70%, ${aging / 100 * 0.25}) 0%,
              hsla(30, 40%, 75%, ${aging / 100 * 0.15}) 50%,
              transparent 80%
            ),
            linear-gradient(
              45deg,
              hsla(35, 30%, 85%, ${aging / 100 * 0.1}) 0%,
              hsla(40, 25%, 88%, ${aging / 100 * 0.05}) 100%
            )
          `,
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Edge wear and corner damage */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 20% 30% at 0% 0%,
              hsla(20, 30%, 60%, ${wear / 100 * 0.4}) 0%,
              hsla(25, 25%, 70%, ${wear / 100 * 0.2}) 50%,
              transparent 80%
            ),
            radial-gradient(
              ellipse 25% 20% at 100% 0%,
              hsla(15, 35%, 65%, ${wear / 100 * 0.35}) 0%,
              hsla(20, 30%, 75%, ${wear / 100 * 0.15}) 60%,
              transparent 90%
            ),
            radial-gradient(
              ellipse 20% 25% at 0% 100%,
              hsla(25, 40%, 70%, ${wear / 100 * 0.3}) 0%,
              hsla(30, 35%, 80%, ${wear / 100 * 0.1}) 70%,
              transparent 95%
            ),
            radial-gradient(
              ellipse 30% 25% at 100% 100%,
              hsla(20, 35%, 65%, ${wear / 100 * 0.4}) 0%,
              hsla(25, 30%, 75%, ${wear / 100 * 0.2}) 60%,
              transparent 85%
            )
          `,
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Subtle cardstock texture */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              hsla(0, 0%, 0%, ${intensity / 100 * 0.02}) 1px,
              transparent 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              hsla(0, 0%, 0%, ${intensity / 100 * 0.015}) 1px,
              transparent 2px
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.5
        }}
      />
      
      {/* Age spots and discoloration */}
      {aging > 50 && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                circle at 25% 30%,
                hsla(35, 20%, 60%, ${(aging - 50) / 50 * 0.15}) 0%,
                transparent 8%
              ),
              radial-gradient(
                circle at 75% 60%,
                hsla(40, 25%, 65%, ${(aging - 50) / 50 * 0.12}) 0%,
                transparent 6%
              ),
              radial-gradient(
                circle at 40% 80%,
                hsla(30, 30%, 70%, ${(aging - 50) / 50 * 0.1}) 0%,
                transparent 5%
              )
            `,
            mixBlendMode: 'multiply'
          }}
        />
      )}
    </div>
  );
};
