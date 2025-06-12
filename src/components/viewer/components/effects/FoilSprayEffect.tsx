
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface FoilSprayEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const FoilSprayEffect: React.FC<FoilSprayEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const foilsprayIntensity = getEffectParam('foilspray', 'intensity', 0);
  const density = getEffectParam('foilspray', 'density', 60);
  const direction = getEffectParam('foilspray', 'direction', 135);

  if (foilsprayIntensity <= 0) return null;

  // Optimized foil spray - subtle and realistic
  const baseOpacity = Math.min(0.25, (foilsprayIntensity / 100) * 0.25); // Max 25% opacity
  const sparkleIntensity = (density / 100) * 0.15; // Much more subtle

  // Calculate realistic light interaction
  const lightAngle = Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI);
  const lightIntensity = Math.sqrt(Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2));

  return (
    <>
      {/* Primary Foil Reflection - Realistic metallic sparkles */}
      <div
        className="absolute inset-0 z-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, ${baseOpacity * 0.8}) 0.5px, transparent 2px),
            radial-gradient(circle at 70% 20%, rgba(255, 240, 200, ${baseOpacity * 0.6}) 0.5px, transparent 2px),
            radial-gradient(circle at 25% 75%, rgba(200, 230, 255, ${baseOpacity * 0.6}) 0.5px, transparent 2px),
            radial-gradient(circle at 80% 80%, rgba(255, 200, 240, ${baseOpacity * 0.5}) 0.5px, transparent 2px)
          `,
          backgroundSize: '120px 120px, 150px 150px, 100px 100px, 130px 130px',
          backgroundPosition: `${mousePosition.x * 8}px ${mousePosition.y * 8}px, 
                             ${mousePosition.x * -6}px ${mousePosition.y * 10}px,
                             ${mousePosition.x * 12}px ${mousePosition.y * -4}px,
                             ${mousePosition.x * -8}px ${mousePosition.y * 6}px`,
          mixBlendMode: 'screen',
          opacity: 0.6 + lightIntensity * 0.3,
          transform: `rotate(${direction + lightAngle * 0.1}deg)`
        }}
      />

      {/* Secondary Foil Texture - Fine metallic grain */}
      <div
        className="absolute inset-0 z-21"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 60%, rgba(255, 255, 255, ${sparkleIntensity * 0.7}) 0.3px, transparent 1px),
            radial-gradient(circle at 85% 30%, rgba(255, 230, 180, ${sparkleIntensity * 0.5}) 0.3px, transparent 1px),
            radial-gradient(circle at 45% 15%, rgba(180, 220, 255, ${sparkleIntensity * 0.5}) 0.3px, transparent 1px),
            radial-gradient(circle at 60% 85%, rgba(255, 180, 220, ${sparkleIntensity * 0.4}) 0.3px, transparent 1px)
          `,
          backgroundSize: '80px 80px, 90px 90px, 70px 70px, 85px 85px',
          backgroundPosition: `${mousePosition.x * 4}px ${mousePosition.y * 5}px, 
                             ${mousePosition.x * -3}px ${mousePosition.y * 6}px,
                             ${mousePosition.x * 7}px ${mousePosition.y * -2}px,
                             ${mousePosition.x * -5}px ${mousePosition.y * 3}px`,
          mixBlendMode: 'overlay',
          opacity: 0.4 + lightIntensity * 0.2,
          transform: `rotate(${direction - 10}deg)`
        }}
      />

      {/* Directional Foil Streaks - Subtle metallic flow */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            linear-gradient(
              ${direction}deg,
              transparent 0%,
              rgba(255, 255, 255, ${baseOpacity * 0.3}) 45%,
              rgba(255, 255, 255, ${baseOpacity * 0.5}) 50%,
              rgba(255, 255, 255, ${baseOpacity * 0.3}) 55%,
              transparent 100%
            )
          `,
          opacity: lightIntensity * 0.6,
          mixBlendMode: 'soft-light'
        }}
      />
    </>
  );
};
