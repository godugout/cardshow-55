import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface EffectsLayerProps {
  effectValues: EffectValues;
  showEffects: boolean;
  interactiveLighting?: boolean;
  mousePosition?: { x: number; y: number };
}

/**
 * Pure effects layer - applies visual effects without touching base card
 */
export const EffectsLayer: React.FC<EffectsLayerProps> = ({
  effectValues,
  showEffects,
  interactiveLighting = false,
  mousePosition = { x: 0.5, y: 0.5 }
}) => {
  if (!showEffects) return null;

  // Calculate total effect intensity
  const totalIntensity = Object.entries(effectValues).reduce((sum, [key, effect]) => {
    if (typeof effect === 'object' && effect && 'intensity' in effect) {
      const intensity = effect.intensity;
      return sum + (typeof intensity === 'number' ? intensity : 0);
    }
    return sum;
  }, 0);

  if (totalIntensity === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Holographic Effect */}
      {effectValues.holographic && typeof effectValues.holographic.intensity === 'number' && effectValues.holographic.intensity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              transparent 0%,
              rgba(255,0,255,${effectValues.holographic.intensity / 100 * 0.3}) 25%,
              rgba(0,255,255,${effectValues.holographic.intensity / 100 * 0.3}) 50%,
              rgba(255,255,0,${effectValues.holographic.intensity / 100 * 0.3}) 75%,
              transparent 100%
            )`,
            mixBlendMode: 'screen',
            opacity: effectValues.holographic.intensity / 100
          }}
        />
      )}

      {/* Chrome Effect */}
      {effectValues.chrome && typeof effectValues.chrome.intensity === 'number' && effectValues.chrome.intensity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(192,192,192,${effectValues.chrome.intensity / 100 * 0.6}) 0%,
              rgba(169,169,169,${effectValues.chrome.intensity / 100 * 0.4}) 50%,
              transparent 100%
            )`,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Brushed Metal Effect */}
      {effectValues.brushedmetal && typeof effectValues.brushedmetal.intensity === 'number' && effectValues.brushedmetal.intensity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              ${effectValues.brushedmetal.direction || 45}deg,
              rgba(160,160,160,${effectValues.brushedmetal.intensity / 100 * 0.3}) 0px,
              rgba(200,200,200,${effectValues.brushedmetal.intensity / 100 * 0.2}) 2px,
              rgba(160,160,160,${effectValues.brushedmetal.intensity / 100 * 0.3}) 4px
            )`,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Interactive Lighting */}
      {interactiveLighting && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255,255,255,0.2) 0%,
              rgba(255,255,255,0.1) 30%,
              transparent 60%
            )`,
            mixBlendMode: 'screen'
          }}
        />
      )}
    </div>
  );
};