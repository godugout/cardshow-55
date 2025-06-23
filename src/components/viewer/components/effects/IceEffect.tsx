
import React from 'react';
import type { EffectValues } from '../../hooks/effects/types';

interface IceEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const IceEffect: React.FC<IceEffectProps> = ({ effectValues, mousePosition }) => {
  const iceEffect = effectValues.ice;
  const intensity = (iceEffect?.intensity as number) || 0;
  
  if (intensity === 0) return null;

  const frost = (iceEffect?.frost as number) || 60;
  const cracks = (iceEffect?.cracks as number) || 30;
  
  return (
    <div 
      className="absolute inset-0 z-18 rounded-xl overflow-hidden"
      style={{
        opacity: intensity / 100
      }}
    >
      {/* Base ice surface */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 120% 80% at ${mousePosition.x}% ${mousePosition.y}%,
              hsla(200, 30%, 95%, ${intensity / 100 * 0.4}) 0%,
              hsla(210, 40%, 90%, ${intensity / 100 * 0.3}) 40%,
              hsla(220, 20%, 85%, ${intensity / 100 * 0.2}) 80%,
              transparent 100%
            ),
            linear-gradient(
              45deg,
              hsla(190, 25%, 92%, ${intensity / 100 * 0.2}) 0%,
              hsla(200, 30%, 88%, ${intensity / 100 * 0.15}) 100%
            )
          `,
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Frost patterns */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at 20% 30%,
              hsla(200, 20%, 98%, ${frost / 100 * 0.6}) 0%,
              hsla(210, 15%, 95%, ${frost / 100 * 0.3}) 20%,
              transparent 40%
            ),
            radial-gradient(
              circle at 80% 20%,
              hsla(190, 25%, 96%, ${frost / 100 * 0.5}) 0%,
              hsla(200, 20%, 90%, ${frost / 100 * 0.25}) 25%,
              transparent 50%
            ),
            radial-gradient(
              circle at 60% 80%,
              hsla(210, 30%, 94%, ${frost / 100 * 0.7}) 0%,
              hsla(220, 25%, 88%, ${frost / 100 * 0.35}) 15%,
              transparent 35%
            )
          `,
          mixBlendMode: 'screen',
          filter: 'blur(0.5px)'
        }}
      />
      
      {/* Ice crystal scratches */}
      {cracks > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                ${Math.random() * 360}deg,
                transparent 0%,
                hsla(200, 10%, 70%, ${cracks / 100 * 0.4}) 48%,
                hsla(200, 10%, 70%, ${cracks / 100 * 0.4}) 52%,
                transparent 100%
              ),
              linear-gradient(
                ${Math.random() * 360 + 90}deg,
                transparent 0%,
                hsla(210, 15%, 75%, ${cracks / 100 * 0.3}) 47%,
                hsla(210, 15%, 75%, ${cracks / 100 * 0.3}) 53%,
                transparent 100%
              ),
              linear-gradient(
                ${Math.random() * 360 + 180}deg,
                transparent 0%,
                hsla(190, 20%, 80%, ${cracks / 100 * 0.25}) 49%,
                hsla(190, 20%, 80%, ${cracks / 100 * 0.25}) 51%,
                transparent 100%
              )
            `,
            mixBlendMode: 'multiply'
          }}
        />
      )}
      
      {/* Ice reflection highlights */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 1.2}deg,
              transparent 0%,
              hsla(200, 50%, 95%, ${intensity / 100 * 0.5}) 20%,
              hsla(210, 60%, 98%, ${intensity / 100 * 0.7}) 40%,
              hsla(220, 40%, 92%, ${intensity / 100 * 0.3}) 60%,
              transparent 80%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8
        }}
      />
      
      {/* Subtle ice texture */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x / 4}deg,
              transparent 0px,
              hsla(200, 20%, 90%, ${intensity / 100 * 0.1}) 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              ${mousePosition.x / 4 + 90}deg,
              transparent 0px,
              hsla(210, 15%, 95%, ${intensity / 100 * 0.08}) 1px,
              transparent 4px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.6
        }}
      />
    </div>
  );
};
