
import React from 'react';
import type { EffectValues } from '../../hooks/effects/types';

interface GoldEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const GoldEffect: React.FC<GoldEffectProps> = ({ effectValues, mousePosition }) => {
  const goldEffect = effectValues.gold;
  const intensity = (goldEffect?.intensity as number) || 0;
  
  if (intensity === 0) return null;

  const warmth = (goldEffect?.warmth as number) || 75;
  const patina = (goldEffect?.patina as number) || 20;
  
  // Calculate gold color based on warmth
  const goldHue = 45 + (warmth / 100) * 15; // 45-60 degrees (yellow to orange)
  const goldSaturation = 80 + (warmth / 100) * 20; // 80-100%
  const goldLightness = 50 + (intensity / 100) * 30; // 50-80%
  
  // Patina creates darker, aged spots
  const patinaOpacity = (patina / 100) * 0.3;
  
  return (
    <div 
      className="absolute inset-0 z-20 rounded-xl"
      style={{
        background: `
          radial-gradient(
            ellipse 120% 80% at ${mousePosition.x}% ${mousePosition.y}%,
            hsla(${goldHue}, ${goldSaturation}%, ${goldLightness + 10}%, ${intensity / 100 * 0.4}) 0%,
            hsla(${goldHue}, ${goldSaturation}%, ${goldLightness}%, ${intensity / 100 * 0.3}) 30%,
            hsla(${goldHue - 10}, ${goldSaturation - 20}%, ${goldLightness - 20}%, ${intensity / 100 * 0.2}) 70%,
            transparent 100%
          ),
          linear-gradient(
            135deg,
            hsla(${goldHue + 5}, ${goldSaturation}%, ${goldLightness + 15}%, ${intensity / 100 * 0.3}) 0%,
            transparent 50%,
            hsla(${goldHue - 5}, ${goldSaturation - 10}%, ${goldLightness - 10}%, ${intensity / 100 * 0.2}) 100%
          )
        `,
        opacity: intensity / 100,
        mixBlendMode: 'soft-light',
        filter: `
          drop-shadow(0 0 ${intensity / 10}px hsla(${goldHue}, ${goldSaturation}%, ${goldLightness}%, 0.6))
        `
      }}
    >
      {/* Patina overlay for aged effect */}
      {patina > 0 && (
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `
              radial-gradient(
                ellipse 40% 60% at 20% 30%,
                hsla(${goldHue - 20}, 30%, 20%, ${patinaOpacity}) 0%,
                transparent 60%
              ),
              radial-gradient(
                ellipse 30% 40% at 80% 70%,
                hsla(${goldHue - 15}, 40%, 25%, ${patinaOpacity * 0.8}) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse 25% 35% at 60% 20%,
                hsla(${goldHue - 25}, 35%, 15%, ${patinaOpacity * 0.6}) 0%,
                transparent 40%
              )
            `,
            mixBlendMode: 'multiply'
          }}
        />
      )}
      
      {/* Gold highlight streaks */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 1.8}deg,
              transparent 0%,
              hsla(${goldHue + 10}, ${goldSaturation}%, ${goldLightness + 20}%, ${intensity / 100 * 0.4}) 45%,
              hsla(${goldHue + 10}, ${goldSaturation}%, ${goldLightness + 20}%, ${intensity / 100 * 0.4}) 55%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.6
        }}
      />
    </div>
  );
};
