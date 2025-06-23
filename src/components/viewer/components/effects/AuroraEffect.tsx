
import React from 'react';
import type { EffectValues } from '../../hooks/effects/types';

interface AuroraEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const AuroraEffect: React.FC<AuroraEffectProps> = ({ effectValues, mousePosition }) => {
  const auroraEffect = effectValues.aurora;
  const intensity = (auroraEffect?.intensity as number) || 0;
  
  if (intensity === 0) return null;

  const flow = (auroraEffect?.flow as number) || 40;
  const colors = (auroraEffect?.colors as number) || 70;
  
  // Calculate animation timing based on flow
  const animationDuration = 8 - (flow / 100) * 6; // 2-8 seconds
  
  // Color range based on colors parameter
  const colorIntensity = colors / 100;
  
  return (
    <div 
      className="absolute inset-0 z-20 rounded-xl overflow-hidden"
      style={{
        opacity: intensity / 100,
        mixBlendMode: 'screen'
      }}
    >
      {/* Primary aurora waves */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 200% 100% at ${mousePosition.x}% ${mousePosition.y - 20}%,
              hsla(180, ${colorIntensity * 80}%, ${colorIntensity * 60}%, ${intensity / 100 * 0.4}) 0%,
              hsla(200, ${colorIntensity * 90}%, ${colorIntensity * 70}%, ${intensity / 100 * 0.3}) 20%,
              hsla(280, ${colorIntensity * 85}%, ${colorIntensity * 65}%, ${intensity / 100 * 0.25}) 40%,
              hsla(320, ${colorIntensity * 80}%, ${colorIntensity * 60}%, ${intensity / 100 * 0.2}) 60%,
              transparent 80%
            )
          `,
          animation: `aurora-flow ${animationDuration}s ease-in-out infinite alternate`,
          transform: `translateY(${Math.sin(Date.now() / 1000) * 10}px)`
        }}
      />
      
      {/* Secondary aurora layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 2}deg,
              transparent 0%,
              hsla(120, ${colorIntensity * 70}%, ${colorIntensity * 50}%, ${intensity / 100 * 0.3}) 20%,
              hsla(160, ${colorIntensity * 75}%, ${colorIntensity * 55}%, ${intensity / 100 * 0.25}) 40%,
              hsla(240, ${colorIntensity * 80}%, ${colorIntensity * 60}%, ${intensity / 100 * 0.2}) 60%,
              transparent 80%
            )
          `,
          animation: `aurora-shift ${animationDuration * 1.3}s ease-in-out infinite alternate-reverse`,
          opacity: 0.7
        }}
      />
      
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%,
              hsla(200, ${colorIntensity * 90}%, ${colorIntensity * 80}%, ${intensity / 100 * 0.2}) 0%,
              transparent 50%
            )
          `,
          animation: `aurora-shimmer ${animationDuration * 0.8}s ease-in-out infinite`,
          mixBlendMode: 'overlay'
        }}
      />
      
      <style>{`
        @keyframes aurora-flow {
          0% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-5px) scaleY(1.1); }
          100% { transform: translateY(5px) scaleY(0.9); }
        }
        
        @keyframes aurora-shift {
          0% { transform: skewX(0deg) translateX(0%); }
          50% { transform: skewX(2deg) translateX(2%); }
          100% { transform: skewX(-1deg) translateX(-1%); }
        }
        
        @keyframes aurora-shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};
