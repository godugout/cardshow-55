
import React from 'react';
import type { EnhancedLightingData } from '../hooks/useEnhancedInteractiveLighting';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EnhancedInteractiveLightingLayerProps {
  lightingData: EnhancedLightingData | null;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const EnhancedInteractiveLightingLayer: React.FC<EnhancedInteractiveLightingLayerProps> = ({
  lightingData,
  effectValues,
  mousePosition
}) => {
  if (!lightingData) return null;
  
  // Get active effects for tailored lighting response
  const goldIntensity = (effectValues?.gold?.intensity as number) || 0;
  const chromeIntensity = (effectValues?.chrome?.intensity as number) || 0;
  const crystalIntensity = (effectValues?.crystal?.intensity as number) || 0;
  const holographicIntensity = (effectValues?.holographic?.intensity as number) || 0;
  
  // Calculate total effect intensity for smart scaling
  const totalEffectIntensity = goldIntensity + chromeIntensity + crystalIntensity + holographicIntensity;
  const effectScale = Math.min(totalEffectIntensity / 100, 1);
  
  // Determine dominant effect for specialized lighting
  const dominantEffect = Math.max(goldIntensity, chromeIntensity, crystalIntensity, holographicIntensity);
  const effectType = goldIntensity === dominantEffect ? 'gold' : 
                    chromeIntensity === dominantEffect ? 'chrome' :
                    crystalIntensity === dominantEffect ? 'crystal' : 'holographic';
  
  return (
    <>
      {/* Phase 1: Real-Time Shadow Casting - FURTHER REDUCED */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 200% 150% at 
              ${50 + lightingData.shadowX}% ${50 + lightingData.shadowY}%,
              rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.2 * effectScale}) 0%,
              rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.1 * effectScale}) 60%,
              transparent 90%
            )
          `,
          transform: `translateX(${lightingData.shadowX * 0.2}px) translateY(${lightingData.shadowY * 0.2}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Multi-layer shadows for depth - MUCH LIGHTER */}
      <div
        className="absolute inset-0 z-31 pointer-events-none"
        style={{
          boxShadow: `
            inset ${lightingData.shadowX * 0.1}px ${lightingData.shadowY * 0.1}px ${lightingData.shadowBlur * 1.5}px rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.12 * effectScale}),
            inset ${lightingData.shadowX * 0.2}px ${lightingData.shadowY * 0.2}px ${lightingData.shadowBlur * 3}px rgba(0, 0, 0, ${lightingData.shadowOpacity * 0.08 * effectScale})
          `,
          transition: 'box-shadow 0.1s ease-out'
        }}
      />

      {/* Phase 2: Dynamic Reflections - MUCH MORE SUBTLE */}
      {dominantEffect > 0 && (
        <>
          {/* Metallic streak reflections - HEAVILY REDUCED */}
          <div
            className="absolute inset-0 z-32 pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  ${lightingData.reflectionAngle + 90}deg,
                  transparent 0%,
                  ${effectType === 'gold' ? 'rgba(255, 215, 0, 0.15)' : 
                    effectType === 'chrome' ? 'rgba(255, 255, 255, 0.2)' :
                    effectType === 'crystal' ? 'rgba(200, 220, 255, 0.12)' :
                    'rgba(255, 100, 255, 0.1)'} ${40 - lightingData.reflectionSpread/4}%,
                  ${effectType === 'gold' ? 'rgba(255, 215, 0, 0.08)' : 
                    effectType === 'chrome' ? 'rgba(255, 255, 255, 0.1)' :
                    effectType === 'crystal' ? 'rgba(200, 220, 255, 0.06)' :
                    'rgba(255, 100, 255, 0.05)'} 50%,
                  transparent ${60 + lightingData.reflectionSpread/4}%
                )
              `,
              opacity: lightingData.reflectionIntensity * (dominantEffect / 100) * 0.3 * effectScale,
              mixBlendMode: 'screen',
              transform: `translateX(${lightingData.lightX * 3}px) translateY(${lightingData.lightY * 3}px)`,
              transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
            }}
          />
          
          {/* Surface-specific reflections - MUCH LARGER SPREAD, LOWER OPACITY */}
          <div
            className="absolute inset-0 z-33 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  ellipse 150% 100% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  ${effectType === 'gold' ? 'rgba(255, 223, 0, 0.12)' : 
                    effectType === 'chrome' ? 'rgba(240, 248, 255, 0.15)' :
                    effectType === 'crystal' ? 'rgba(173, 216, 230, 0.1)' :
                    'rgba(238, 130, 238, 0.08)'} 0%,
                  transparent 85%
                )
              `,
              opacity: lightingData.lightIntensity * (dominantEffect / 100) * 0.25 * effectScale,
              mixBlendMode: effectType === 'gold' ? 'overlay' : 'screen',
              transition: 'opacity 0.1s ease-out'
            }}
          />
        </>
      )}

      {/* Phase 3: Environmental Response - MINIMAL */}
      {/* Color temperature shifts - VERY SUBTLE */}
      <div
        className="absolute inset-0 z-36 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 250% 200% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${lightingData.colorTemperature > 0.5 ? 
                `rgba(255, 200, 150, ${lightingData.atmosphericScatter * 0.03 * effectScale})` : 
                `rgba(150, 200, 255, ${lightingData.atmosphericScatter * 0.03 * effectScale})`} 0%,
              transparent 90%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: lightingData.directionalBias * 0.2,
          transition: 'opacity 0.2s ease-out'
        }}
      />
      
      {/* Directional lighting indicator - MUCH SMALLER AND SUBTLER */}
      <div
        className="absolute top-2 left-2 z-40 pointer-events-none"
        style={{
          width: '2px',
          height: '2px',
          borderRadius: '50%',
          background: `radial-gradient(circle, 
            rgba(0, 255, 150, ${lightingData.lightIntensity * 0.3 * effectScale}) 0%, 
            rgba(0, 255, 150, ${lightingData.lightIntensity * 0.1 * effectScale}) 70%, 
            transparent 100%)`,
          boxShadow: `0 0 4px rgba(0, 255, 150, ${lightingData.lightIntensity * 0.2 * effectScale})`,
          animation: `pulse ${4000 / lightingData.lightIntensity}ms ease-in-out infinite`,
          transform: `translate(${lightingData.lightX * 2}px, ${lightingData.lightY * 2}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
    </>
  );
};
