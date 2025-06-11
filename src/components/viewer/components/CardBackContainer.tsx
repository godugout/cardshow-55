
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { CardBackLogo } from './CardBackLogo';

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
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
        backfaceVisibility: 'hidden',
        opacity: isFlipped ? 1 : 0,
        zIndex: isFlipped ? 10 : 1,
        transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.4) 0%, rgba(45, 45, 45, 0.6) 50%, rgba(26, 26, 26, 0.4) 100%)',
        ...frameStyles
      }}
    >
      {/* Surface Texture - Base Layer */}
      <div className="absolute inset-0 z-10">
        {SurfaceTexture}
      </div>

      {/* CRD Logo and Interactive Lighting */}
      <CardBackLogo
        isHovering={isHovering}
        mousePosition={mousePosition}
        interactiveLighting={interactiveLighting}
      />

      {/* Back Effects Layer - Above Logo */}
      <div className="absolute inset-0 z-30">
        <CardEffectsLayer
          showEffects={showEffects}
          isHovering={isHovering}
          effectIntensity={[50]}
          mousePosition={mousePosition}
          physicalEffectStyles={enhancedEffectStyles}
          effectValues={effectValues}
          interactiveLighting={interactiveLighting}
          applyToFrame={false}
        />
      </div>
    </div>
  );
};
