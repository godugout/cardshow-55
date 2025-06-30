
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';
import { SafeCardImage } from './SafeCardImage';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface CardFrontProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  effectValues?: EffectValues;
  materialSettings?: any;
  interactiveLighting?: boolean;
}

export const CardFront: React.FC<CardFrontProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  frameStyles,
  physicalEffectStyles,
  SurfaceTexture,
  effectValues,
  materialSettings,
  interactiveLighting = false
}) => {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
      style={{
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Enhanced Image Display - Always Prominent */}
      <div className="absolute inset-0 z-40">
        <SafeCardImage
          card={card}
          className="w-full h-full object-cover object-center"
          priority={true}
        />
      </div>

      {/* Enhanced Border Frame for Effects */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <div 
          className="w-full h-full rounded-xl"
          style={{
            border: '2px solid transparent',
            background: showEffects 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)' 
              : 'none',
            ...frameStyles
          }}
        />
      </div>

      {/* Effects Layer - Refined Application */}
      {showEffects && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <CardEffectsLayer
            showEffects={showEffects}
            isHovering={isHovering}
            effectIntensity={effectIntensity}
            mousePosition={mousePosition}
            physicalEffectStyles={physicalEffectStyles}
            effectValues={effectValues}
            materialSettings={materialSettings}
            interactiveLighting={interactiveLighting}
            applyToFrame={true}
          />
        </div>
      )}

      {/* Enhanced Interactive Lighting */}
      {interactiveLighting && isHovering && (
        <div
          className="absolute inset-0 z-35 pointer-events-none rounded-xl"
          style={{
            background: `
              radial-gradient(
                ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.03) 0%,
                rgba(255, 255, 255, 0.015) 40%,
                transparent 70%
              )
            `,
            mixBlendMode: 'soft-light',
            transition: 'opacity 0.2s ease',
            opacity: 0.7
          }}
        />
      )}
    </div>
  );
};
