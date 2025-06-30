
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { CardBackMaterial } from '../hooks/useDynamicCardBackMaterials';

interface EnhancedCardBackProps {
  selectedMaterial: CardBackMaterial;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  interactiveLighting: boolean;
  dynamicBrightness: number;
  activeEffectsCount: number;
}

export const EnhancedCardBack: React.FC<EnhancedCardBackProps> = ({
  selectedMaterial,
  effectValues,
  mousePosition,
  isHovering,
  interactiveLighting,
  dynamicBrightness,
  activeEffectsCount
}) => {
  
  // Generate effect-specific visual elements
  const getEffectElements = () => {
    const elements: React.ReactNode[] = [];
    
    Object.entries(effectValues).forEach(([effectId, params], index) => {
      const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
      if (intensity < 15) return;
      
      const normalizedIntensity = intensity / 100;
      
      // Holographic rainbow effect
      if (effectId === 'holographic') {
        elements.push(
          <div
            key={`${effectId}-rainbow`}
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                linear-gradient(45deg, 
                  rgba(255, 107, 107, ${normalizedIntensity * 0.4}) 0%, 
                  rgba(78, 205, 196, ${normalizedIntensity * 0.4}) 25%, 
                  rgba(69, 183, 209, ${normalizedIntensity * 0.4}) 50%, 
                  rgba(150, 206, 180, ${normalizedIntensity * 0.4}) 75%, 
                  rgba(255, 234, 167, ${normalizedIntensity * 0.4}) 100%
                )
              `,
              backgroundSize: '200% 200%',
              animation: `holographicShift 3s ease-in-out infinite`
            }}
          />
        );
      }
      
      // Chrome reflective surface
      if (effectId === 'chrome') {
        elements.push(
          <div
            key={`${effectId}-chrome`}
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(192, 192, 192, ${normalizedIntensity * 0.5}) 0%, 
                  rgba(255, 255, 255, ${normalizedIntensity * 0.7}) 30%, 
                  rgba(160, 160, 160, ${normalizedIntensity * 0.4}) 70%, 
                  rgba(192, 192, 192, ${normalizedIntensity * 0.5}) 100%
                )
              `,
              backdropFilter: `blur(${normalizedIntensity * 2}px)`
            }}
          />
        );
      }
      
      // Gold luxury effect
      if (effectId === 'gold') {
        const goldTone = params.goldTone || 'classic';
        const goldColors = goldTone === 'solar' 
          ? ['#FFD700', '#FF8C00', '#FF4500']
          : ['#FFD700', '#B8860B', '#8B6914'];
        
        elements.push(
          <div
            key={`${effectId}-gold`}
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at center, 
                  ${goldColors[0]}40 0%, 
                  ${goldColors[1]}30 50%, 
                  ${goldColors[2]}20 100%
                )
              `,
              opacity: normalizedIntensity,
              boxShadow: `0 0 ${normalizedIntensity * 30}px ${goldColors[0]}60`
            }}
          />
        );
      }
      
      // Crystal prismatic effect
      if (effectId === 'crystal') {
        elements.push(
          <div
            key={`${effectId}-crystal`}
            className="absolute inset-0"
            style={{
              background: `
                conic-gradient(from 45deg, 
                  rgba(147, 197, 253, ${normalizedIntensity * 0.3}) 0deg,
                  rgba(196, 181, 253, ${normalizedIntensity * 0.4}) 90deg,
                  rgba(167, 243, 208, ${normalizedIntensity * 0.3}) 180deg,
                  rgba(252, 211, 77, ${normalizedIntensity * 0.3}) 270deg,
                  rgba(147, 197, 253, ${normalizedIntensity * 0.3}) 360deg
                )
              `,
              backdropFilter: `blur(${normalizedIntensity * 3}px)`,
              animation: `crystallineShift 4s ease-in-out infinite`
            }}
          />
        );
      }
      
      // Neon glow effect
      if (effectId === 'neon') {
        const neonColor = params.neonColor || '#00ff00';
        elements.push(
          <div
            key={`${effectId}-neon`}
            className="absolute inset-0"
            style={{
              boxShadow: `
                inset 0 0 ${normalizedIntensity * 15}px ${neonColor}40,
                0 0 ${normalizedIntensity * 25}px ${neonColor}30,
                0 0 ${normalizedIntensity * 40}px ${neonColor}20
              `,
              border: `1px solid ${neonColor}60`,
              animation: `neonPulse 2s ease-in-out infinite alternate`
            }}
          />
        );
      }
    });
    
    return elements;
  };
  
  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden">
      {/* Base Material Layer */}
      <div
        className="absolute inset-0"
        style={{
          background: selectedMaterial.background,
          border: `2px solid ${selectedMaterial.borderColor}`,
          filter: `brightness(${dynamicBrightness})`,
          ...(selectedMaterial.blur && {
            backdropFilter: `blur(${selectedMaterial.blur}px)`
          })
        }}
      />
      
      {/* CRD Logo and Branding */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="text-6xl font-black text-white/90 tracking-wider">
            CRD
          </div>
          <div className="text-sm font-medium text-white/70 tracking-[0.2em]">
            CARDSHOW
          </div>
          <div className="text-xs text-white/50 tracking-wide">
            PREMIUM COLLECTION
          </div>
        </div>
        
        {/* Effect Status Indicators */}
        {activeEffectsCount > 0 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(activeEffectsCount, 5) }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/60"
                  style={{
                    animation: `effectPulse 1s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Dynamic Effect Layers */}
      {getEffectElements()}
      
      {/* Interactive Lighting Overlay */}
      {interactiveLighting && isHovering && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse 150% 120% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.08) 40%,
                transparent 70%
              )
            `,
            mixBlendMode: 'soft-light',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      
      {/* Enhanced Glow Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: `
            0 0 50px ${selectedMaterial.borderColor}40,
            inset 0 0 30px rgba(255, 255, 255, 0.1)
          `
        }}
      />
    </div>
  );
};
