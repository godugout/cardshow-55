
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
  // Use physics-based visibility when available, otherwise ensure front face is visible by default
  const faceStyles = getFaceVisibility ? getFaceVisibility(true) : { 
    opacity: isFlipped ? 0 : 1, 
    zIndex: isFlipped ? 10 : 30,
    pointerEvents: (isFlipped ? 'none' : 'auto') as React.CSSProperties['pointerEvents']
  };

  // Debug logging for image loading
  console.log('🖼️ CardFrontContainer - Front Image Setup:', {
    cardTitle: card.title,
    hasCardImage: !!card.image_url,
    cardImageUrl: card.image_url,
    faceStyles,
    isFlipped
  });

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        ...frameStyles,
        ...faceStyles,
        transform: 'rotateY(0deg)', // Front face - no rotation
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
      data-face="front"
      data-card-title={card.title}
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

      {/* Card Image - HIGHEST Z-INDEX for visibility */}
      <div className="absolute inset-0 z-50">
        {card.image_url ? (
          <img 
            src={card.image_url}
            alt={card.title || "Card Front"}
            className="w-full h-full object-cover"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              pointerEvents: 'none'
            }}
            draggable={false}
            onLoad={() => console.log('✅ Card front image loaded successfully:', card.image_url)}
            onError={(e) => {
              console.error('❌ Error loading card front image:', {
                src: card.image_url,
                error: e
              });
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
            <div className="text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Subtle Card Content Overlay */}
      <div 
        className="absolute inset-0 p-6 flex flex-col z-60"
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
          className="absolute inset-0 pointer-events-none z-70"
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
