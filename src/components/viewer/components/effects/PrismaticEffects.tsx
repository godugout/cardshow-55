
import React from 'react';
import type { EffectValues } from '../../hooks/effects/types';

interface PrismaticEffectsProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  enhancedLightingData?: any;
}

export const PrismaticEffects: React.FC<PrismaticEffectsProps> = ({ 
  effectValues, 
  mousePosition, 
  enhancedLightingData 
}) => {
  const holographicEffect = effectValues.holographic;
  const interferenceEffect = effectValues.interference;
  const prizmEffect = effectValues.prizm;
  
  const holoIntensity = (holographicEffect?.intensity as number) || 0;
  const interferenceIntensity = (interferenceEffect?.intensity as number) || 0;
  const prizmIntensity = (prizmEffect?.intensity as number) || 0;
  
  if (holoIntensity === 0 && interferenceIntensity === 0 && prizmIntensity === 0) return null;
  
  const lightMultiplier = enhancedLightingData ? 1 + enhancedLightingData.lightIntensity * 0.5 : 1;
  
  return (
    <>
      {/* Holographic Effect */}
      {holoIntensity > 0 && (
        <div 
          className="absolute inset-0 z-22 rounded-xl"
          style={{
            opacity: (holoIntensity / 100) * lightMultiplier,
            mixBlendMode: 'screen'
          }}
        >
          <div
            style={{
              background: `
                conic-gradient(
                  from ${mousePosition.x * 3.6}deg at ${mousePosition.x}% ${mousePosition.y}%,
                  hsla(0, 100%, 70%, ${holoIntensity / 100 * 0.6}) 0deg,
                  hsla(60, 100%, 80%, ${holoIntensity / 100 * 0.7}) 60deg,
                  hsla(120, 100%, 70%, ${holoIntensity / 100 * 0.5}) 120deg,
                  hsla(180, 100%, 80%, ${holoIntensity / 100 * 0.6}) 180deg,
                  hsla(240, 100%, 75%, ${holoIntensity / 100 * 0.7}) 240deg,
                  hsla(300, 100%, 80%, ${holoIntensity / 100 * 0.5}) 300deg,
                  hsla(0, 100%, 70%, ${holoIntensity / 100 * 0.6}) 360deg
                )
              `,
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              animation: `holographic-shift ${8 - (holographicEffect?.shiftSpeed as number || 50) / 100 * 6}s ease-in-out infinite alternate`
            }}
          />
        </div>
      )}
      
      {/* Interference Effect */}
      {interferenceIntensity > 0 && (
        <div 
          className="absolute inset-0 z-21 rounded-xl"
          style={{
            opacity: interferenceIntensity / 100,
            mixBlendMode: 'overlay'
          }}
        >
          <div
            style={{
              background: `
                repeating-conic-gradient(
                  from 0deg at 50% 50%,
                  transparent 0deg,
                  hsla(200, 80%, 70%, ${interferenceIntensity / 100 * 0.3}) ${(interferenceEffect?.frequency as number || 50) / 10}deg,
                  transparent ${(interferenceEffect?.frequency as number || 50) / 5}deg
                )
              `,
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              animation: `interference-wave ${6 - (interferenceEffect?.amplitude as number || 30) / 100 * 4}s linear infinite`
            }}
          />
        </div>
      )}
      
      {/* Prizm Effect */}
      {prizmIntensity > 0 && (
        <div 
          className="absolute inset-0 z-23 rounded-xl"
          style={{
            opacity: prizmIntensity / 100,
            mixBlendMode: 'screen'
          }}
        >
          <div
            style={{
              background: `
                linear-gradient(
                  ${mousePosition.x * 2}deg,
                  hsla(0, 100%, 60%, ${prizmIntensity / 100 * 0.4}) 0%,
                  hsla(30, 100%, 70%, ${prizmIntensity / 100 * 0.3}) 16.66%,
                  hsla(60, 100%, 80%, ${prizmIntensity / 100 * 0.4}) 33.33%,
                  hsla(120, 100%, 70%, ${prizmIntensity / 100 * 0.3}) 50%,
                  hsla(240, 100%, 75%, ${prizmIntensity / 100 * 0.4}) 66.66%,
                  hsla(300, 100%, 80%, ${prizmIntensity / 100 * 0.3}) 83.33%,
                  hsla(0, 100%, 60%, ${prizmIntensity / 100 * 0.4}) 100%
                )
              `,
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              filter: `blur(${3 - (prizmEffect?.refraction as number || 60) / 100 * 2}px)`
            }}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes holographic-shift {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.02) rotate(1deg); }
          100% { transform: scale(1) rotate(-1deg); }
        }
        
        @keyframes interference-wave {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
