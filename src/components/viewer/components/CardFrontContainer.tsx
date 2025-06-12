
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
  // Calculate total effect intensity for image enhancement
  const totalEffectIntensity = React.useMemo(() => {
    if (!effectValues) return 0;
    return Object.values(effectValues).reduce((total, effect) => {
      const intensity = effect.intensity as number;
      return total + (typeof intensity === 'number' ? intensity : 0);
    }, 0);
  }, [effectValues]);

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        // FIXED: Front face is always at rotateY(0deg) - shows card image
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s ease',
        zIndex: isFlipped ? 1 : 10,
        ...frameStyles
      }}
    >
      {/* Surface Texture - Base Layer */}
      <div className="absolute inset-0 z-10">
        {SurfaceTexture}
      </div>

      {/* Enhanced Card Image - Above Surface with dynamic enhancement */}
      <CardImageLayer 
        card={card} 
        effectValues={effectValues}
        totalEffectIntensity={totalEffectIntensity}
      />

      {/* Effects Layer - Above Image for Full Coverage but more subtle */}
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

      {/* Interactive Lighting - Top Layer but much more subtle */}
      <InteractiveLightingLayer
        isHovering={isHovering}
        interactiveLighting={interactiveLighting}
        mousePosition={mousePosition}
      />
    </div>
  );
};
