
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';

interface CardBackContainerProps {
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
}

export const CardBackContainer: React.FC<CardBackContainerProps> = ({
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false
}) => {
  return (
    <div 
      className={`absolute inset-0 rounded-xl overflow-hidden`}
      style={{
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
        backfaceVisibility: 'hidden',
        opacity: isFlipped ? 1 : 0,
        zIndex: isFlipped ? 10 : 1,
        transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        ...frameStyles
      }}
    >
      {/* Back Effects Layer */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={[50]}
        mousePosition={mousePosition}
        physicalEffectStyles={enhancedEffectStyles}
        effectValues={effectValues}
        interactiveLighting={interactiveLighting}
      />

      {/* Surface Texture on Back */}
      <div className="relative z-20">
        {SurfaceTexture}
      </div>

      {/* CRD Logo */}
      <div className="relative h-full flex items-center justify-center z-30">
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-64 h-auto opacity-90"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            pointerEvents: 'none'
          }}
          draggable={false}
        />
      </div>

      {/* Interactive Lighting */}
      {interactiveLighting && isHovering && (
        <div className="absolute inset-0 pointer-events-none z-40">
          <div
            style={{
              background: `radial-gradient(
                ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.03) 30%,
                transparent 70%
              )`,
              mixBlendMode: 'overlay',
              transition: 'opacity 0.2s ease'
            }}
          />
        </div>
      )}
    </div>
  );
};
