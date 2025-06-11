
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
  // Use simplified face visibility
  const faceStyles = getFaceVisibility ? getFaceVisibility(true) : { 
    opacity: isFlipped ? 0 : 1, 
    zIndex: isFlipped ? 10 : 30,
    pointerEvents: (isFlipped ? 'none' : 'auto') as React.CSSProperties['pointerEvents']
  };

  // Enhanced debug logging for image loading
  console.log('🖼️ CardFrontContainer - ENHANCED Front Image Debug:', {
    cardTitle: card.title,
    hasCardImage: !!card.image_url,
    cardImageUrl: card.image_url,
    faceStyles,
    isFlipped,
    expectedImagePath: '/lovable-uploads/bd3d4ab6-d44a-44af-9f5b-f77c05329e1a.png'
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
      data-visibility={faceStyles.opacity}
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

      {/* Card Image - MAXIMUM Z-INDEX with enhanced error handling */}
      <div className="absolute inset-0 z-[100]">
        {card.image_url ? (
          <>
            <img 
              src={card.image_url}
              alt={card.title || "Card Front - Puff the Magic Dragon"}
              className="w-full h-full object-cover"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1000
              }}
              draggable={false}
              onLoad={() => {
                console.log('✅ SUCCESS: Card front image loaded successfully:', card.image_url);
                console.log('✅ This should be Puff the Magic Dragon!');
              }}
              onError={(e) => {
                console.error('❌ CRITICAL ERROR: Failed to load card front image:', {
                  src: card.image_url,
                  error: e,
                  expectedImage: 'Puff the Magic Dragon'
                });
              }}
            />
            {/* Debug overlay to confirm image is there */}
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded z-[1001]">
              FRONT: {card.title}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
            <div className="text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">No Image - Should be Puff!</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Content Overlay - Reduced opacity to show image better */}
      <div 
        className="absolute inset-0 p-6 flex flex-col z-[90]"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        <div className="mt-auto">
          <div className="bg-black bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-3 text-white">
            <h3 className="text-xl font-bold mb-1 opacity-70">{card.title}</h3>
            {card.rarity && (
              <p className="text-xs uppercase tracking-wide opacity-50">{card.rarity}</p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Lighting Overlay */}
      {isHovering && interactiveLighting && (
        <div 
          className="absolute inset-0 pointer-events-none z-[80]"
          style={{
            background: `radial-gradient(
              ellipse 120% 80% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, 0.06) 0%,
              rgba(255, 255, 255, 0.03) 40%,
              transparent 70%
            )`,
            mixBlendMode: 'soft-light',
            opacity: 0.3,
            transition: 'opacity 0.1s ease'
          }}
        />
      )}
    </div>
  );
};
