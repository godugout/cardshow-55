
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface EdgeGlowRendererProps {
  side: 'left' | 'right';
  opacity: number;
  gasColor: string;
  intensity: number;
  edgeThickness: number;
  effectValues: EffectValues;
  isHovering: boolean;
}

export const EdgeGlowRenderer: React.FC<EdgeGlowRendererProps> = ({
  side,
  opacity,
  gasColor,
  intensity,
  edgeThickness,
  effectValues,
  isHovering
}) => {
  const isLeft = side === 'left';
  const hasSparkleEffects = (effectValues.holographic?.intensity as number > 20) || 
                           (effectValues.crystal?.intensity as number > 20) ||
                           (effectValues.prizm?.intensity as number > 20);

  return (
    <div 
      className="absolute top-0 h-full pointer-events-none z-15"
      style={{
        [isLeft ? 'left' : 'right']: '0px',
        opacity,
        transition: 'opacity 0.3s ease',
        width: `${edgeThickness}px`
      }}
      data-edge={side}
      data-opacity={opacity.toFixed(2)}
    >
      {/* Inner glow using box-shadow */}
      <div
        className={`absolute top-0 ${isLeft ? 'left' : 'right'}-0 h-full`}
        style={{
          width: `${edgeThickness}px`,
          background: gasColor,
          boxShadow: `
            inset ${isLeft ? '2px' : '-2px'} 0 ${edgeThickness}px ${gasColor},
            inset 0 0 ${edgeThickness / 2}px rgba(255, 255, 255, 0.3)
          `,
          filter: `brightness(${intensity}) blur(0.5px)`,
          borderRadius: isLeft ? '2px 0 0 2px' : '0 2px 2px 0'
        }}
      />
      
      {/* Subtle outer glow within card bounds */}
      <div
        className={`absolute top-0 ${isLeft ? 'left' : 'right'}-0 h-full`}
        style={{
          width: `${edgeThickness / 2}px`,
          background: `linear-gradient(to ${isLeft ? 'right' : 'left'}, ${gasColor} 0%, transparent 100%)`,
          animation: isHovering ? 'gas-pulse 2s ease-in-out infinite alternate' : 'gas-gentle 4s ease-in-out infinite alternate',
          filter: `brightness(${intensity * 0.8})`
        }}
      />

      {/* Enhanced sparkles for magical effects */}
      {hasSparkleEffects && (
        <div
          className="absolute top-0 h-full pointer-events-none"
          style={{
            [isLeft ? 'left' : 'right']: '2px',
            width: `${edgeThickness - 4}px`,
            background: `
              radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.8) 1px, transparent 2px),
              radial-gradient(circle at 50% 60%, rgba(255, 255, 255, 0.6) 1px, transparent 2px),
              radial-gradient(circle at 50% 85%, rgba(255, 255, 255, 0.7) 1px, transparent 2px)
            `,
            animation: 'sparkle-dance 3s ease-in-out infinite',
            filter: `brightness(${intensity})`,
            opacity
          }}
        />
      )}
    </div>
  );
};
