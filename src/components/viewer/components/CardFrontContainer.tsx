
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { CardImageLayer } from './CardImageLayer';
import { CardContentOverlay } from './CardContentOverlay';
import { InteractiveLightingLayer } from './InteractiveLightingLayer';

interface CardFrontContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
  onClick: () => void;
}

export const CardFrontContainer: React.FC<CardFrontContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
  onClick
}) => {
  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden',
        opacity: isFlipped ? 0 : 1,
        zIndex: isFlipped ? 1 : 10,
        transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
        ...frameStyles
      }}
    >
      {/* Surface Texture - Base Layer */}
      <div className="absolute inset-0 z-10">
        {SurfaceTexture}
      </div>

      {/* Full Bleed Card Image - Above Surface */}
      <CardImageLayer card={card} />

      {/* Effects Layer - Above Image for Full Coverage */}
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

      {/* Card Content Overlay - Top Layer */}
      <CardContentOverlay card={card} />

      {/* Interactive Lighting - Top Layer */}
      <InteractiveLightingLayer
        isHovering={isHovering}
        interactiveLighting={interactiveLighting}
        mousePosition={mousePosition}
      />
    </div>
  );
};
