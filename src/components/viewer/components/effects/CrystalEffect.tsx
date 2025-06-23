
import React from 'react';
import type { EffectValues } from '../../hooks/effects/types';

interface CrystalEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const CrystalEffect: React.FC<CrystalEffectProps> = ({ effectValues, mousePosition }) => {
  const crystalEffect = effectValues.crystal;
  const intensity = (crystalEffect?.intensity as number) || 0;
  
  if (intensity === 0) return null;

  const facets = (crystalEffect?.facets as number) || 8;
  const clarity = (crystalEffect?.clarity as number) || 85;
  
  // Generate facet angles based on facets count
  const facetAngles = Array.from({ length: facets }, (_, i) => (360 / facets) * i);
  
  return (
    <div 
      className="absolute inset-0 z-20 rounded-xl overflow-hidden"
      style={{
        opacity: intensity / 100,
        filter: `brightness(${1 + clarity / 200})`
      }}
    >
      {/* Crystal facet reflections */}
      {facetAngles.map((angle, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                ${angle + mousePosition.x / 2}deg,
                transparent 0%,
                hsla(${angle + 180}, 70%, 85%, ${intensity / 100 * 0.3}) ${30 + index * 5}%,
                hsla(${angle + 200}, 80%, 90%, ${intensity / 100 * 0.2}) ${40 + index * 5}%,
                transparent ${60 + index * 3}%
              )
            `,
            mixBlendMode: index % 2 === 0 ? 'screen' : 'overlay',
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'center'
          }}
        />
      ))}
      
      {/* Diamond sparkles */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%,
              hsla(0, 0%, 100%, ${intensity / 100 * 0.8}) 0%,
              hsla(0, 0%, 100%, ${intensity / 100 * 0.4}) 1%,
              transparent 2%
            ),
            radial-gradient(
              circle at ${mousePosition.x + 20}% ${mousePosition.y - 15}%,
              hsla(180, 100%, 90%, ${intensity / 100 * 0.6}) 0%,
              hsla(180, 100%, 90%, ${intensity / 100 * 0.3}) 1%,
              transparent 2%
            ),
            radial-gradient(
              circle at ${mousePosition.x - 15}% ${mousePosition.y + 20}%,
              hsla(240, 100%, 95%, ${intensity / 100 * 0.7}) 0%,
              hsla(240, 100%, 95%, ${intensity / 100 * 0.35}) 1%,
              transparent 2%
            )
          `,
          animation: `crystal-sparkle 2s ease-in-out infinite`,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Crystal structure overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 3.6}deg at 50% 50%,
              transparent 0deg,
              hsla(0, 0%, 100%, ${intensity / 100 * 0.2}) ${360 / facets}deg,
              transparent ${720 / facets}deg,
              hsla(0, 0%, 100%, ${intensity / 100 * 0.15}) ${1080 / facets}deg,
              transparent ${1440 / facets}deg
            )
          `,
          mixBlendMode: 'overlay',
          opacity: clarity / 100
        }}
      />
      
      <style jsx>{`
        @keyframes crystal-sparkle {
          0%, 100% { 
            opacity: 0.8;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};
