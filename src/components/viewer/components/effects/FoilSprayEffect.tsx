
import React from 'react';
import type { EffectValues } from '../../hooks/effects/types';

interface FoilSprayEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const FoilSprayEffect: React.FC<FoilSprayEffectProps> = ({ effectValues, mousePosition }) => {
  const foilSprayEffect = effectValues.foilspray;
  const intensity = (foilSprayEffect?.intensity as number) || 0;
  
  if (intensity === 0) return null;

  const density = (foilSprayEffect?.density as number) || 50;
  const size = (foilSprayEffect?.size as number) || 30;
  
  // Generate sparkle positions based on density
  const sparkleCount = Math.floor((density / 100) * 20) + 5;
  const sparkles = Array.from({ length: sparkleCount }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: (size / 100) * (Math.random() * 3 + 1),
    delay: Math.random() * 2,
    hue: Math.random() * 60 + 180 // Blue to cyan range
  }));
  
  return (
    <div 
      className="absolute inset-0 z-20 rounded-xl overflow-hidden"
      style={{
        opacity: intensity / 100,
        mixBlendMode: 'screen'
      }}
    >
      {/* Base foil background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 200% 150% at ${mousePosition.x}% ${mousePosition.y}%,
              hsla(200, 70%, 80%, ${intensity / 100 * 0.3}) 0%,
              hsla(220, 80%, 85%, ${intensity / 100 * 0.2}) 30%,
              hsla(240, 60%, 75%, ${intensity / 100 * 0.15}) 60%,
              transparent 100%
            )
          `,
          filter: 'blur(1px)'
        }}
      />
      
      {/* Individual sparkles */}
      {sparkles.map((sparkle, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: `
              radial-gradient(
                circle,
                hsla(${sparkle.hue}, 100%, 90%, ${intensity / 100 * 0.9}) 0%,
                hsla(${sparkle.hue + 20}, 100%, 85%, ${intensity / 100 * 0.6}) 30%,
                transparent 70%
              )
            `,
            borderRadius: '50%',
            animation: `foil-sparkle ${2 + sparkle.delay}s ease-in-out infinite`,
            animationDelay: `${sparkle.delay}s`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Concentrated spray pattern near mouse */}
      <div
        className="absolute"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          width: `${50 + (density / 100) * 100}px`,
          height: `${50 + (density / 100) * 100}px`,
          background: `
            radial-gradient(
              circle,
              hsla(190, 90%, 85%, ${intensity / 100 * 0.6}) 0%,
              hsla(210, 80%, 80%, ${intensity / 100 * 0.4}) 20%,
              hsla(230, 70%, 75%, ${intensity / 100 * 0.2}) 50%,
              transparent 80%
            )
          `,
          transform: 'translate(-50%, -50%)',
          animation: `foil-pulse 3s ease-in-out infinite`
        }}
      />
      
      {/* Directional spray streaks */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 1.5}deg,
              transparent 0%,
              hsla(200, 80%, 85%, ${intensity / 100 * 0.3}) 30%,
              hsla(220, 90%, 90%, ${intensity / 100 * 0.4}) 50%,
              hsla(240, 80%, 85%, ${intensity / 100 * 0.2}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7
        }}
      />
      
      <style jsx>{`
        @keyframes foil-sparkle {
          0%, 100% { 
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        
        @keyframes foil-pulse {
          0%, 100% { 
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};
