
import React from 'react';
import type { EffectValues } from '../../hooks/effects/types';

interface MetallicEffectsProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const MetallicEffects: React.FC<MetallicEffectsProps> = ({ effectValues, mousePosition }) => {
  const chromeEffect = effectValues.chrome;
  const brushedMetalEffect = effectValues.brushedmetal;
  
  const chromeIntensity = (chromeEffect?.intensity as number) || 0;
  const brushedIntensity = (brushedMetalEffect?.intensity as number) || 0;
  
  if (chromeIntensity === 0 && brushedIntensity === 0) return null;
  
  return (
    <>
      {/* Chrome Effect */}
      {chromeIntensity > 0 && (
        <div 
          className="absolute inset-0 z-20 rounded-xl"
          style={{
            opacity: chromeIntensity / 100,
            mixBlendMode: 'screen'
          }}
        >
          <div
            style={{
              background: `
                radial-gradient(
                  ellipse 150% 100% at ${mousePosition.x}% ${mousePosition.y}%,
                  hsla(0, 0%, 95%, ${chromeIntensity / 100 * 0.6}) 0%,
                  hsla(0, 0%, 85%, ${chromeIntensity / 100 * 0.4}) 30%,
                  hsla(0, 0%, 75%, ${chromeIntensity / 100 * 0.2}) 60%,
                  transparent 100%
                ),
                linear-gradient(
                  ${mousePosition.x * 1.8}deg,
                  hsla(0, 0%, 100%, ${chromeIntensity / 100 * 0.8}) 0%,
                  hsla(0, 0%, 90%, ${chromeIntensity / 100 * 0.4}) 50%,
                  hsla(0, 0%, 100%, ${chromeIntensity / 100 * 0.6}) 100%
                )
              `,
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              filter: `blur(${Math.max(0, 2 - chromeIntensity / 50)}px)`
            }}
          />
        </div>
      )}
      
      {/* Brushed Metal Effect */}
      {brushedIntensity > 0 && (
        <div 
          className="absolute inset-0 z-19 rounded-xl"
          style={{
            opacity: brushedIntensity / 100,
            mixBlendMode: 'overlay'
          }}
        >
          <div
            style={{
              background: `
                repeating-linear-gradient(
                  ${(brushedMetalEffect?.direction as number) || 0}deg,
                  transparent 0px,
                  hsla(0, 0%, 100%, ${brushedIntensity / 100 * 0.3}) 1px,
                  hsla(0, 0%, 80%, ${brushedIntensity / 100 * 0.2}) 2px,
                  transparent 3px,
                  transparent 4px
                ),
                linear-gradient(
                  ${mousePosition.x * 0.5}deg,
                  hsla(0, 0%, 90%, ${brushedIntensity / 100 * 0.4}) 0%,
                  hsla(0, 0%, 70%, ${brushedIntensity / 100 * 0.2}) 50%,
                  hsla(0, 0%, 85%, ${brushedIntensity / 100 * 0.3}) 100%
                )
              `,
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit'
            }}
          />
        </div>
      )}
    </>
  );
};
