
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
      className={`absolute inset-0 rounded-xl overflow-hidden transition-all duration-600 ${
        isFlipped ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        ...frameStyles
      }}
    >
      {/* Enhanced Effects Layer with Individual Effect Values */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={[50]} // Keep for backward compatibility
        mousePosition={mousePosition}
        physicalEffectStyles={enhancedEffectStyles}
        effectValues={effectValues}
        interactiveLighting={interactiveLighting}
      />

      {/* Surface Texture - Now layered properly */}
      <div className="relative z-20">
        {SurfaceTexture}
      </div>

      {/* Card Content with enhanced image visibility */}
      <div 
        className="relative h-full p-6 flex flex-col z-30"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        {/* Enhanced Image Section with proper visibility */}
        {card.image_url && (
          <div className="flex-1 mb-6 relative overflow-hidden rounded-lg bg-black/20">
            <img 
              src={card.image_url} 
              alt={card.title}
              className="w-full h-full object-cover transition-all duration-300"
              style={{
                filter: isHovering ? 
                  `brightness(${interactiveLighting ? 1.2 : 1.1}) contrast(${interactiveLighting ? 1.1 : 1.05}) saturate(1.1)` : 
                  'brightness(1) contrast(1) saturate(1)',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'none',
                position: 'relative',
                zIndex: 10
              }}
              draggable={false}
              onLoad={() => console.log('Card image loaded successfully:', card.title)}
              onError={() => console.log('Failed to load card image:', card.image_url)}
            />
            
            {/* Image loading overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-20 pointer-events-none" />
          </div>
        )}
        
        {/* Enhanced Details Section with better contrast */}
        <div 
          className="mt-auto p-4 rounded-lg backdrop-blur-sm border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            position: 'relative',
            zIndex: 20
          }}
        >
          <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">{card.title}</h3>
          {card.description && (
            <p className="text-gray-300 text-sm mb-2 drop-shadow-md">{card.description}</p>
          )}
          {card.rarity && (
            <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold">{card.rarity}</p>
          )}
        </div>
      </div>

      {/* Enhanced Interactive Lighting Effect with proper layering */}
      {isHovering && interactiveLighting && (
        <>
          {/* Primary soft light center */}
          <div 
            className="absolute inset-0 pointer-events-none z-40"
            style={{
              background: `radial-gradient(
                ellipse 120% 80% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.08) 40%,
                transparent 80%
              )`,
              mixBlendMode: 'overlay',
              transition: 'background 0.1s ease'
            }}
          />
          
          {/* Secondary diffusion layer */}
          <div 
            className="absolute inset-0 pointer-events-none z-41"
            style={{
              background: `radial-gradient(
                ellipse 180% 120% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.06) 0%,
                rgba(255, 255, 255, 0.03) 60%,
                transparent 90%
              )`,
              mixBlendMode: 'soft-light',
              transition: 'background 0.15s ease'
            }}
          />
        </>
      )}
    </div>
  );
};
