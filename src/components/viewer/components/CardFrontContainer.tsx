
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';

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
  getFaceVisibility?: (isFront: boolean) => React.CSSProperties;
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
  onClick,
  getFaceVisibility
}) => {
  // Use physics-based visibility when available, but ensure front face is visible by default
  const faceStyles = getFaceVisibility ? getFaceVisibility(true) : { opacity: 1, zIndex: 20 };

  // Debug logging
  console.log('CardFrontContainer - isFlipped:', isFlipped, 'faceStyles:', faceStyles);

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        ...frameStyles,
        ...faceStyles,
        transform: 'rotateY(0deg)',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
      data-face="front"
    >
      {/* Base Layer - Card Frame */}
      <div className="absolute inset-0 z-10" style={frameStyles} />
      
      {/* Effects Layer - Only on Frame */}
      <div className="absolute inset-0 z-20">
        <CardEffectsLayer
          showEffects={showEffects}
          isHovering={isHovering}
          effectIntensity={[50]}
          mousePosition={mousePosition}
          physicalEffectStyles={enhancedEffectStyles}
          effectValues={effectValues}
          interactiveLighting={interactiveLighting}
          applyToFrame={true}
        />
        
        {/* Surface Texture */}
        <div className="relative">
          {SurfaceTexture}
        </div>
      </div>

      {/* Card Image - Use Puff the Magic Dragon - HIGHEST Z-INDEX */}
      <div className="absolute inset-0 z-40">
        <img 
          src="/lovable-uploads/0642fcd5-3a3f-471b-abd3-81eba9d4d456.png"
          alt="Puff the Magic Dragon"
          className="w-full h-full object-cover"
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            pointerEvents: 'none'
          }}
          draggable={false}
          onLoad={() => console.log('✅ Puff the Magic Dragon image loaded successfully')}
          onError={(e) => {
            console.error('❌ Error loading Puff the Magic Dragon image:', e);
            // Fallback to card image if available
            if (card.image_url) {
              e.currentTarget.src = card.image_url;
            }
          }}
        />
      </div>

      {/* Subtle Card Content Overlay */}
      <div 
        className="absolute inset-0 p-6 flex flex-col z-50"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        <div className="mt-auto">
          <div className="bg-black bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-3 text-white">
            <h3 className="text-xl font-bold mb-1 opacity-90">{card.title}</h3>
            {card.rarity && (
              <p className="text-xs uppercase tracking-wide opacity-60">{card.rarity}</p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Lighting Overlay */}
      {isHovering && interactiveLighting && (
        <div 
          className="absolute inset-0 pointer-events-none z-60"
          style={{
            background: `radial-gradient(
              ellipse 120% 80% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, 0.06) 0%,
              rgba(255, 255, 255, 0.03) 40%,
              transparent 70%
            )`,
            mixBlendMode: 'soft-light',
            opacity: 0.5,
            transition: 'opacity 0.1s ease'
          }}
        />
      )}
    </div>
  );
};
