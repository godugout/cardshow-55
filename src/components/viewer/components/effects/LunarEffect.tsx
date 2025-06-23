
import React from 'react';
import type { EffectValues } from '../../hooks/effects/types';

interface LunarEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const LunarEffect: React.FC<LunarEffectProps> = ({ effectValues, mousePosition }) => {
  const lunarEffect = effectValues.lunar;
  const intensity = (lunarEffect?.intensity as number) || 0;
  
  if (intensity === 0) return null;

  const dust = (lunarEffect?.dust as number) || 50;
  const craters = (lunarEffect?.craters as number) || 40;
  
  return (
    <div 
      className="absolute inset-0 z-18 rounded-xl overflow-hidden"
      style={{
        opacity: intensity / 100
      }}
    >
      {/* Base lunar surface */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 150% 100% at ${mousePosition.x}% ${mousePosition.y}%,
              hsla(45, 15%, 85%, ${intensity / 100 * 0.3}) 0%,
              hsla(40, 20%, 75%, ${intensity / 100 * 0.25}) 40%,
              hsla(35, 10%, 65%, ${intensity / 100 * 0.2}) 80%,
              transparent 100%
            ),
            linear-gradient(
              135deg,
              hsla(50, 12%, 80%, ${intensity / 100 * 0.2}) 0%,
              hsla(45, 15%, 70%, ${intensity / 100 * 0.15}) 100%
            )
          `,
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Moon dust particles */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at 15% 25%,
              hsla(50, 20%, 90%, ${dust / 100 * 0.4}) 0%,
              hsla(45, 15%, 85%, ${dust / 100 * 0.2}) 3%,
              transparent 8%
            ),
            radial-gradient(
              circle at 30% 60%,
              hsla(40, 25%, 88%, ${dust / 100 * 0.35}) 0%,
              hsla(45, 20%, 80%, ${dust / 100 * 0.18}) 2%,
              transparent 6%
            ),
            radial-gradient(
              circle at 70% 20%,
              hsla(55, 18%, 92%, ${dust / 100 * 0.4}) 0%,
              hsla(50, 15%, 87%, ${dust / 100 * 0.2}) 2%,
              transparent 7%
            ),
            radial-gradient(
              circle at 85% 75%,
              hsla(35, 22%, 85%, ${dust / 100 * 0.3}) 0%,
              hsla(40, 18%, 78%, ${dust / 100 * 0.15}) 3%,
              transparent 9%
            ),
            radial-gradient(
              circle at 50% 40%,
              hsla(45, 20%, 89%, ${dust / 100 * 0.25}) 0%,
              hsla(40, 15%, 82%, ${dust / 100 * 0.12}) 2%,
              transparent 5%
            )
          `,
          mixBlendMode: 'screen',
          animation: `lunar-dust 8s ease-in-out infinite alternate`
        }}
      />
      
      {/* Crater-like surface texture */}
      {craters > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse 25% 15% at 20% 30%,
                hsla(35, 10%, 50%, ${craters / 100 * 0.3}) 0%,
                hsla(40, 15%, 60%, ${craters / 100 * 0.15}) 50%,
                transparent 80%
              ),
              radial-gradient(
                ellipse 20% 30% at 75% 20%,
                hsla(30, 12%, 45%, ${craters / 100 * 0.35}) 0%,
                hsla(35, 18%, 55%, ${craters / 100 * 0.18}) 60%,
                transparent 90%
              ),
              radial-gradient(
                ellipse 30% 20% at 60% 80%,
                hsla(40, 8%, 52%, ${craters / 100 * 0.28}) 0%,
                hsla(45, 12%, 62%, ${craters / 100 * 0.14}) 55%,
                transparent 85%
              )
            `,
            mixBlendMode: 'multiply'
          }}
        />
      )}
      
      {/* Retro space-age highlighting */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 0.8}deg,
              transparent 0%,
              hsla(60, 30%, 95%, ${intensity / 100 * 0.4}) 25%,
              hsla(55, 25%, 90%, ${intensity / 100 * 0.3}) 50%,
              hsla(50, 20%, 85%, ${intensity / 100 * 0.2}) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.7
        }}
      />
      
      {/* Subtle lunar surface texture */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-radial-gradient(
              circle at 30% 40%,
              transparent 0px,
              hsla(45, 8%, 70%, ${intensity / 100 * 0.08}) 2px,
              transparent 8px
            ),
            repeating-radial-gradient(
              circle at 70% 60%,
              transparent 0px,
              hsla(40, 10%, 75%, ${intensity / 100 * 0.06}) 1px,
              transparent 6px
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.5
        }}
      />
      
      <style jsx>{`
        @keyframes lunar-dust {
          0% { 
            opacity: 0.7;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.05);
          }
          100% { 
            opacity: 0.8;
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
};
