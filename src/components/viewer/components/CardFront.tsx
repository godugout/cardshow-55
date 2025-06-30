
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';
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
      {/* Your Image - Clean and Prominent */}
      <div className="absolute inset-0 z-40">
        {card.image_url ? (
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover object-center"
            style={{
              filter: showEffects 
                ? 'brightness(1.02) contrast(1.01)' 
                : 'none',
              transition: 'filter 0.3s ease'
            }}
            draggable="false"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">Your Image Here</p>
            </div>
          </div>
        )}
      </div>

      {/* Subtle Border Frame for Effects */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <div 
          className="w-full h-full rounded-xl"
          style={{
            border: '2px solid transparent',
            background: showEffects ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)' : 'none',
            ...frameStyles
          }}
        />
      </div>

      {/* Effects Layer - Subtle on Front */}
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

      {/* Very Subtle Interactive Lighting */}
      {interactiveLighting && isHovering && (
        <div
          className="absolute inset-0 z-35 pointer-events-none rounded-xl"
          style={{
            background: `
              radial-gradient(
                ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.02) 0%,
                rgba(255, 255, 255, 0.01) 40%,
                transparent 70%
              )
            `,
            mixBlendMode: 'soft-light',
            transition: 'opacity 0.2s ease',
            opacity: 0.6
          }}
        />
      )}
    </div>
  );
};
