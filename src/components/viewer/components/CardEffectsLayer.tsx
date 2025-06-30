
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  effectValues?: EffectValues;
  materialSettings?: any;
  interactiveLighting?: boolean;
  applyToFrame?: boolean;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  effectIntensity,
  mousePosition,
  physicalEffectStyles,
  effectValues = {},
  materialSettings,
  interactiveLighting = false,
  applyToFrame = false
}) => {
  if (!showEffects) return null;

  // Get active effects
  const activeEffects = Object.entries(effectValues).filter(([_, params]) => {
    const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
    return intensity > 10; // Only show effects with meaningful intensity
  });

  // Generate effect styles based on active effects
  const getEffectStyles = (): React.CSSProperties => {
    let styles: React.CSSProperties = { ...physicalEffectStyles };

    activeEffects.forEach(([effectId, params]) => {
      const intensity = typeof params.intensity === 'number' ? params.intensity / 100 : 0;

      switch (effectId) {
        case 'holographic':
          styles.background = `
            ${styles.background || ''}, 
            linear-gradient(45deg, 
              rgba(255, 107, 107, ${intensity * 0.3}) 0%, 
              rgba(78, 205, 196, ${intensity * 0.3}) 25%, 
              rgba(69, 183, 209, ${intensity * 0.3}) 50%, 
              rgba(150, 206, 180, ${intensity * 0.3}) 75%, 
              rgba(255, 234, 167, ${intensity * 0.3}) 100%
            )
          `;
          styles.animation = 'holographicShift 3s ease-in-out infinite';
          break;

        case 'chrome':
          styles.background = `
            ${styles.background || ''}, 
            linear-gradient(135deg, 
              rgba(192, 192, 192, ${intensity * 0.4}) 0%, 
              rgba(255, 255, 255, ${intensity * 0.6}) 25%, 
              rgba(192, 192, 192, ${intensity * 0.4}) 50%, 
              rgba(160, 160, 160, ${intensity * 0.3}) 75%, 
              rgba(192, 192, 192, ${intensity * 0.4}) 100%
            )
          `;
          break;

        case 'gold':
          const goldTone = params.goldTone || 'classic';
          const goldColors = goldTone === 'solar' 
            ? ['rgba(255, 215, 0', 'rgba(255, 140, 0', 'rgba(255, 69, 0']
            : ['rgba(255, 215, 0', 'rgba(184, 134, 11', 'rgba(146, 103, 31'];
          
          styles.background = `
            ${styles.background || ''}, 
            linear-gradient(45deg, 
              ${goldColors[0]}, ${intensity * 0.4}) 0%, 
              ${goldColors[1]}, ${intensity * 0.5}) 50%, 
              ${goldColors[2]}, ${intensity * 0.4}) 100%
            )
          `;
          styles.boxShadow = `0 0 ${intensity * 20}px ${goldColors[0]}, 0.3)`;
          break;

        case 'crystal':
          styles.background = `
            ${styles.background || ''}, 
            linear-gradient(60deg, 
              rgba(147, 197, 253, ${intensity * 0.3}) 0%, 
              rgba(196, 181, 253, ${intensity * 0.4}) 33%, 
              rgba(167, 243, 208, ${intensity * 0.3}) 66%, 
              rgba(147, 197, 253, ${intensity * 0.3}) 100%
            )
          `;
          styles.backdropFilter = `blur(${intensity * 2}px)`;
          break;

        case 'neon':
          const neonColor = params.neonColor || '#00ff00';
          styles.boxShadow = `
            0 0 ${intensity * 10}px ${neonColor}80,
            0 0 ${intensity * 20}px ${neonColor}60,
            0 0 ${intensity * 30}px ${neonColor}40,
            inset 0 0 ${intensity * 5}px ${neonColor}20
          `;
          styles.border = `1px solid ${neonColor}60`;
          break;
      }
    });

    return styles;
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none rounded-xl"
      style={getEffectStyles()}
    >
      {/* Enhanced interactive lighting for effects */}
      {interactiveLighting && isHovering && activeEffects.length > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse 120% 100% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 40%,
                transparent 70%
              )
            `,
            mixBlendMode: 'soft-light',
            transition: 'opacity 0.2s ease'
          }}
        />
      )}

      {/* Special animated overlays for specific effects */}
      {activeEffects.map(([effectId, params]) => {
        const intensity = typeof params.intensity === 'number' ? params.intensity / 100 : 0;
        
        if (effectId === 'holographic' && intensity > 0.3) {
          return (
            <div
              key="holographic-overlay"
              className="absolute inset-0 opacity-60"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                animation: 'holographicShift 2s ease-in-out infinite'
              }}
            />
          );
        }

        if (effectId === 'chrome' && intensity > 0.4) {
          return (
            <div
              key="chrome-shine"
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.6) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
                animation: 'chromeShine 3s ease-in-out infinite'
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
};
