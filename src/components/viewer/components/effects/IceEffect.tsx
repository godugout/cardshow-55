
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface IceEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const IceEffect: React.FC<IceEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const iceIntensity = getEffectParam('ice', 'intensity', 0);

  if (iceIntensity <= 0) return null;

  const baseOpacity = (iceIntensity / 100) * 0.3;
  const scratchOpacity = baseOpacity * 0.8;

  return (
    <>
      {/* Ice base layer with frosted effect */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
            rgba(240, 249, 255, ${baseOpacity}) 0%,
            rgba(224, 242, 254, ${baseOpacity * 0.8}) 40%,
            rgba(186, 230, 253, ${baseOpacity * 0.6}) 70%,
            transparent 100%
          )`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Ice scratches and surface markings */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45) + mousePosition.x * 30;
        const length = 15 + (i * 8) % 30;
        const x = 20 + (i * 15) % 60;
        const y = 15 + (i * 12) % 70;
        
        return (
          <div
            key={`scratch-${i}`}
            className="absolute z-17"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${length}px`,
              height: '1px',
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, ${scratchOpacity}) 20%,
                rgba(224, 242, 254, ${scratchOpacity * 1.2}) 50%,
                rgba(255, 255, 255, ${scratchOpacity}) 80%,
                transparent 100%
              )`,
              transform: `rotate(${angle}deg)`,
              filter: 'blur(0.3px)',
              opacity: 0.7 + (i % 3) * 0.1
            }}
          />
        );
      })}

      {/* Deeper ice cracks */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i * 90) + mousePosition.y * 45;
        const x = 25 + (i * 20);
        const y = 20 + (i * 15);
        
        return (
          <div
            key={`crack-${i}`}
            className="absolute z-18"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: '40px',
              height: '2px',
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(186, 230, 253, ${scratchOpacity * 0.6}) 30%,
                rgba(125, 211, 252, ${scratchOpacity * 0.8}) 50%,
                rgba(186, 230, 253, ${scratchOpacity * 0.6}) 70%,
                transparent 100%
              )`,
              transform: `rotate(${angle}deg)`,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 3px rgba(125, 211, 252, ${scratchOpacity * 0.5})`
            }}
          />
        );
      })}

      {/* Frost patterns */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `conic-gradient(
            from ${mousePosition.x * 180}deg at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
            transparent 0deg,
            rgba(240, 249, 255, ${baseOpacity * 0.4}) 30deg,
            transparent 60deg,
            rgba(224, 242, 254, ${baseOpacity * 0.5}) 120deg,
            transparent 150deg,
            rgba(186, 230, 253, ${baseOpacity * 0.3}) 210deg,
            transparent 240deg,
            rgba(240, 249, 255, ${baseOpacity * 0.4}) 330deg,
            transparent 360deg
          )`,
          mixBlendMode: 'soft-light',
          filter: 'blur(1px)'
        }}
      />
    </>
  );
};
