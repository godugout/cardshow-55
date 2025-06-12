
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

  // Enhanced starlight particle system - much brighter and more visible
  const particleOpacity = (foilsprayIntensity / 100) * 0.8; // Increased from 0.4
  const sparkleIntensity = (density / 100) * 0.6; // More visible sparkles

  return (
    <>
      {/* Primary Starlight Particles - Large bright spots */}
      <div
        className="absolute inset-0 z-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, ${particleOpacity * 0.9}) 1px, transparent 3px),
            radial-gradient(circle at 75% 20%, rgba(255, 220, 100, ${particleOpacity * 0.8}) 1px, transparent 3px),
            radial-gradient(circle at 20% 70%, rgba(255, 150, 255, ${particleOpacity * 0.8}) 1px, transparent 3px),
            radial-gradient(circle at 80% 80%, rgba(150, 255, 255, ${particleOpacity * 0.8}) 1px, transparent 3px),
            radial-gradient(circle at 50% 40%, rgba(255, 255, 150, ${particleOpacity * 0.9}) 1px, transparent 3px)
          `,
          backgroundSize: '60px 60px, 80px 80px, 70px 70px, 90px 90px, 55px 55px',
          backgroundPosition: `${mousePosition.x * 15}px ${mousePosition.y * 15}px, 
                             ${mousePosition.x * -12}px ${mousePosition.y * 18}px,
                             ${mousePosition.x * 20}px ${mousePosition.y * -8}px,
                             ${mousePosition.x * -15}px ${mousePosition.y * -12}px,
                             ${mousePosition.x * 8}px ${mousePosition.y * 20}px`,
          mixBlendMode: 'screen',
          opacity: 1.0,
          transform: `rotate(${direction}deg)`
        }}
      />

      {/* Secondary Sparkle Layer - Medium particles */}
      <div
        className="absolute inset-0 z-21"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 60%, rgba(255, 255, 255, ${sparkleIntensity}) 0.5px, transparent 2px),
            radial-gradient(circle at 85% 30%, rgba(255, 200, 150, ${sparkleIntensity}) 0.5px, transparent 2px),
            radial-gradient(circle at 40% 15%, rgba(200, 255, 200, ${sparkleIntensity}) 0.5px, transparent 2px),
            radial-gradient(circle at 60% 85%, rgba(200, 200, 255, ${sparkleIntensity}) 0.5px, transparent 2px),
            radial-gradient(circle at 30% 50%, rgba(255, 180, 255, ${sparkleIntensity}) 0.5px, transparent 2px),
            radial-gradient(circle at 70% 65%, rgba(180, 255, 255, ${sparkleIntensity}) 0.5px, transparent 2px)
          `,
          backgroundSize: '45px 45px, 50px 50px, 40px 40px, 55px 55px, 35px 35px, 48px 48px',
          backgroundPosition: `${mousePosition.x * 10}px ${mousePosition.y * 12}px, 
                             ${mousePosition.x * -8}px ${mousePosition.y * 14}px,
                             ${mousePosition.x * 16}px ${mousePosition.y * -6}px,
                             ${mousePosition.x * -12}px ${mousePosition.y * -10}px,
                             ${mousePosition.x * 6}px ${mousePosition.y * 16}px,
                             ${mousePosition.x * -14}px ${mousePosition.y * 8}px`,
          mixBlendMode: 'color-dodge',
          opacity: 0.8,
          transform: `rotate(${direction + 15}deg)`
        }}
      />

      {/* Fine Glitter Layer - Small particles for texture */}
      <div
        className="absolute inset-0 z-22"
        style={{
          backgroundImage: `
            radial-gradient(circle at 12% 88%, rgba(255, 255, 255, ${sparkleIntensity * 0.6}) 0.3px, transparent 1px),
            radial-gradient(circle at 88% 12%, rgba(255, 220, 180, ${sparkleIntensity * 0.6}) 0.3px, transparent 1px),
            radial-gradient(circle at 33% 77%, rgba(220, 255, 220, ${sparkleIntensity * 0.6}) 0.3px, transparent 1px),
            radial-gradient(circle at 77% 33%, rgba(220, 220, 255, ${sparkleIntensity * 0.6}) 0.3px, transparent 1px),
            radial-gradient(circle at 55% 22%, rgba(255, 200, 255, ${sparkleIntensity * 0.6}) 0.3px, transparent 1px),
            radial-gradient(circle at 22% 55%, rgba(200, 255, 255, ${sparkleIntensity * 0.6}) 0.3px, transparent 1px),
            radial-gradient(circle at 66% 44%, rgba(255, 240, 200, ${sparkleIntensity * 0.6}) 0.3px, transparent 1px),
            radial-gradient(circle at 44% 66%, rgba(240, 200, 255, ${sparkleIntensity * 0.6}) 0.3px, transparent 1px)
          `,
          backgroundSize: '30px 30px, 32px 32px, 28px 28px, 35px 35px, 25px 25px, 33px 33px, 29px 29px, 31px 31px',
          backgroundPosition: `${mousePosition.x * 8}px ${mousePosition.y * 10}px, 
                             ${mousePosition.x * -6}px ${mousePosition.y * 12}px,
                             ${mousePosition.x * 12}px ${mousePosition.y * -4}px,
                             ${mousePosition.x * -10}px ${mousePosition.y * -8}px,
                             ${mousePosition.x * 4}px ${mousePosition.y * 14}px,
                             ${mousePosition.x * -12}px ${mousePosition.y * 6}px,
                             ${mousePosition.x * 14}px ${mousePosition.y * -10}px,
                             ${mousePosition.x * -8}px ${mousePosition.y * 16}px`,
          mixBlendMode: 'screen',
          opacity: 0.7,
          transform: `rotate(${direction - 10}deg)`
        }}
      />
    </>
  );
};
