
import React from 'react';
import type { EffectValues } from '../../hooks/effects/types';

interface WavesEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const WavesEffect: React.FC<WavesEffectProps> = ({ effectValues, mousePosition }) => {
  const wavesEffect = effectValues.waves;
  const intensity = (wavesEffect?.intensity as number) || 0;
  
  if (intensity === 0) return null;

  const speed = (wavesEffect?.speed as number) || 30;
  const amplitude = (wavesEffect?.amplitude as number) || 40;
  
  // Calculate animation timing based on speed
  const animationDuration = 6 - (speed / 100) * 4; // 2-6 seconds
  
  return (
    <div 
      className="absolute inset-0 z-17 rounded-xl overflow-hidden"
      style={{
        opacity: intensity / 100,
        mixBlendMode: 'overlay'
      }}
    >
      {/* Primary wave layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 200% 150% at ${mousePosition.x}% ${mousePosition.y + 20}%,
              hsla(200, 60%, 80%, ${intensity / 100 * 0.4}) 0%,
              hsla(220, 70%, 85%, ${intensity / 100 * 0.3}) 30%,
              hsla(240, 50%, 75%, ${intensity / 100 * 0.2}) 60%,
              transparent 100%
            )
          `,
          animation: `wave-flow ${animationDuration}s ease-in-out infinite`,
          transform: `translateY(${Math.sin(Date.now() / 1000 * speed / 10) * (amplitude / 10)}px)`
        }}
      />
      
      {/* Secondary wave layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 0.5}deg,
              transparent 0%,
              hsla(180, 50%, 75%, ${intensity / 100 * 0.3}) 20%,
              hsla(210, 60%, 80%, ${intensity / 100 * 0.25}) 40%,
              hsla(190, 55%, 70%, ${intensity / 100 * 0.2}) 60%,
              transparent 80%
            )
          `,
          animation: `wave-shift ${animationDuration * 1.3}s ease-in-out infinite reverse`,
          transform: `translateX(${Math.cos(Date.now() / 1000 * speed / 15) * (amplitude / 15)}px)`
        }}
      />
      
      {/* Ripple effects */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%,
              hsla(200, 70%, 85%, ${intensity / 100 * 0.4}) 0%,
              hsla(220, 60%, 75%, ${intensity / 100 * 0.2}) 10%,
              transparent 30%
            ),
            radial-gradient(
              circle at ${mousePosition.x + 30}% ${mousePosition.y - 20}%,
              hsla(180, 80%, 90%, ${intensity / 100 * 0.3}) 0%,
              hsla(200, 70%, 80%, ${intensity / 100 * 0.15}) 8%,
              transparent 25%
            )
          `,
          animation: `wave-ripple ${animationDuration * 0.7}s ease-in-out infinite alternate`,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Depth layers for 3D effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x}deg at 50% 50%,
              transparent 0deg,
              hsla(210, 40%, 60%, ${intensity / 100 * 0.2}) 90deg,
              transparent 180deg,
              hsla(190, 50%, 70%, ${intensity / 100 * 0.15}) 270deg,
              transparent 360deg
            )
          `,
          animation: `wave-rotate ${animationDuration * 2}s linear infinite`,
          opacity: amplitude / 100
        }}
      />
      
      <style jsx>{`
        @keyframes wave-flow {
          0%, 100% { 
            transform: translateY(0px) scaleY(1);
            opacity: 0.8;
          }
          25% { 
            transform: translateY(-${amplitude / 8}px) scaleY(1.1);
            opacity: 1;
          }
          50% { 
            transform: translateY(${amplitude / 10}px) scaleY(0.9);
            opacity: 0.9;
          }
          75% { 
            transform: translateY(-${amplitude / 12}px) scaleY(1.05);
            opacity: 1;
          }
        }
        
        @keyframes wave-shift {
          0% { transform: translateX(0px) skewX(0deg); }
          33% { transform: translateX(${amplitude / 8}px) skewX(1deg); }
          66% { transform: translateX(-${amplitude / 10}px) skewX(-0.5deg); }
          100% { transform: translateX(0px) skewX(0deg); }
        }
        
        @keyframes wave-ripple {
          0% { 
            transform: scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: scale(1.1);
            opacity: 1;
          }
          100% { 
            transform: scale(0.95);
            opacity: 0.7;
          }
        }
        
        @keyframes wave-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
