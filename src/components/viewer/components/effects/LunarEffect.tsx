
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface LunarEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const LunarEffect: React.FC<LunarEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const lunarIntensity = getEffectParam('lunar', 'intensity', 0);
  const dustDensity = getEffectParam('lunar', 'dustDensity', 50);
  const atmosphere = getEffectParam('lunar', 'atmosphere', 60);
  const blueTint = getEffectParam('lunar', 'blueTint', 30);
  const surfaceRoughness = getEffectParam('lunar', 'surfaceRoughness', 70);

  if (lunarIntensity <= 0) return null;

  const baseOpacity = (lunarIntensity / 100) * 0.6;
  const atmosphereOpacity = (atmosphere / 100) * baseOpacity;
  const dustOpacity = (dustDensity / 100) * baseOpacity * 0.4;
  const blueInfluence = blueTint / 100;

  return (
    <>
      {/* Deep Space Atmosphere Base */}
      <div
        className="absolute inset-0 z-14"
        style={{
          background: `radial-gradient(
            ellipse at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
            rgba(30, 35, 48, ${atmosphereOpacity * 0.9}) 0%,
            rgba(45, 50, 65, ${atmosphereOpacity * 0.7}) 30%,
            rgba(60, 65, 80, ${atmosphereOpacity * 0.5}) 60%,
            rgba(75, 80, 95, ${atmosphereOpacity * 0.3}) 80%,
            transparent 100%
          )`,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Lunar Surface with Blue Undertones */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: `radial-gradient(
            ellipse at ${45 + mousePosition.x * 20}% ${45 + mousePosition.y * 20}%,
            rgba(${55 + blueInfluence * 10}, ${60 + blueInfluence * 15}, ${75 + blueInfluence * 25}, ${baseOpacity * 0.8}) 0%,
            rgba(${70 + blueInfluence * 8}, ${75 + blueInfluence * 12}, ${90 + blueInfluence * 20}, ${baseOpacity * 0.6}) 40%,
            rgba(${85 + blueInfluence * 6}, ${90 + blueInfluence * 10}, ${105 + blueInfluence * 15}, ${baseOpacity * 0.4}) 70%,
            transparent 100%
          )`,
          mixBlendMode: 'overlay',
          opacity: 0.8
        }}
      />

      {/* Surface Texture Roughness */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 45 + 15}deg,
              transparent 0px,
              rgba(${40 + blueInfluence * 8}, ${45 + blueInfluence * 12}, ${60 + blueInfluence * 18}, ${(surfaceRoughness / 100) * baseOpacity * 0.3}) 1px,
              transparent 2px,
              rgba(${50 + blueInfluence * 6}, ${55 + blueInfluence * 10}, ${70 + blueInfluence * 16}, ${(surfaceRoughness / 100) * baseOpacity * 0.2}) 3px,
              transparent 5px
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.6
        }}
      />

      {/* Scattered Moon Dust - Fine particles */}
      {Array.from({ length: Math.floor(20 * (dustDensity / 100)) }, (_, i) => {
        const x = 8 + (i * 7) % 84;
        const y = 12 + (i * 11) % 76;
        const size = 0.8 + (i % 4) * 0.4;
        const blueMod = blueInfluence * (i % 3) * 5;
        
        return (
          <div
            key={`fine-dust-${i}`}
            className="absolute z-17"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `rgba(${90 + blueMod}, ${95 + blueMod}, ${110 + blueMod * 1.2}, ${dustOpacity * (0.6 + (i % 3) * 0.3)})`,
              borderRadius: '50%',
              filter: 'blur(0.3px)',
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 2px rgba(${60 + blueMod}, ${65 + blueMod}, ${80 + blueMod}, ${dustOpacity * 0.4})`
            }}
          />
        );
      })}

      {/* Larger Moon Dust Clusters */}
      {Array.from({ length: Math.floor(12 * (dustDensity / 100)) }, (_, i) => {
        const x = 20 + (i * 13) % 60;
        const y = 25 + (i * 17) % 50;
        const size = 2 + (i % 3) * 1.2;
        const blueMod = blueInfluence * (i % 2) * 8;
        
        return (
          <div
            key={`dust-cluster-${i}`}
            className="absolute z-18"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(
                circle,
                rgba(${75 + blueMod}, ${80 + blueMod}, ${95 + blueMod * 1.1}, ${dustOpacity * 1.4}) 0%,
                rgba(${100 + blueMod}, ${105 + blueMod}, ${120 + blueMod}, ${dustOpacity * 0.9}) 60%,
                transparent 100%
              )`,
              borderRadius: '50%',
              filter: 'blur(0.6px)',
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      })}

      {/* Atmospheric Glow - Moonlight effect */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 60}deg at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              transparent 0deg,
              rgba(${80 + blueInfluence * 15}, ${90 + blueInfluence * 20}, ${120 + blueInfluence * 30}, ${atmosphereOpacity * 0.3}) 30deg,
              transparent 90deg,
              rgba(${70 + blueInfluence * 12}, ${80 + blueInfluence * 18}, ${110 + blueInfluence * 25}, ${atmosphereOpacity * 0.2}) 150deg,
              transparent 210deg,
              rgba(${90 + blueInfluence * 10}, ${100 + blueInfluence * 15}, ${130 + blueInfluence * 20}, ${atmosphereOpacity * 0.25}) 300deg,
              transparent 360deg
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.4
        }}
      />

      {/* Deep Space Shimmer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.y * 120 + 30}deg,
              transparent 0%,
              rgba(${60 + blueInfluence * 20}, ${70 + blueInfluence * 25}, ${100 + blueInfluence * 35}, ${baseOpacity * 0.15}) 25%,
              rgba(${50 + blueInfluence * 15}, ${60 + blueInfluence * 20}, ${90 + blueInfluence * 30}, ${baseOpacity * 0.2}) 50%,
              rgba(${70 + blueInfluence * 18}, ${80 + blueInfluence * 23}, ${110 + blueInfluence * 28}, ${baseOpacity * 0.12}) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'soft-light',
          filter: 'blur(3px)',
          opacity: 0.7
        }}
      />
    </>
  );
};
