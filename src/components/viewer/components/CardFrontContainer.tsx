
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';

interface CardFrontContainerProps {
  card: CardData;
  rotation: { x: number; y: number };
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
}

export const CardFrontContainer: React.FC<CardFrontContainerProps> = ({
  card,
  rotation,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
}) => {
  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        ...frameStyles,
        pointerEvents: 'auto',
        zIndex: 1,
        backgroundColor: '#ffffff' // Solid white background
      }}
      data-front-rotation={rotation.y.toFixed(1)}
    >
      {/* Card Image - Base Layer (z-10) */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        {card.image_url && (
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover rounded-xl"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              pointerEvents: 'none',
              backfaceVisibility: 'hidden'
            }}
            draggable={false}
          />
        )}
      </div>

      {/* Effects Layer - Applied over image (z-20) */}
      <div className="absolute inset-0" style={{ zIndex: 20 }}>
        <CardEffectsLayer
          showEffects={showEffects}
          isHovering={isHovering}
          effectIntensity={[50]}
          mousePosition={mousePosition}
          physicalEffectStyles={enhancedEffectStyles}
          effectValues={effectValues}
          interactiveLighting={interactiveLighting}
          applyToFrame={false} // Apply to entire card front
        />
      </div>
            
      {/* Surface Texture Overlay (z-25) */}
      <div className="absolute inset-0" style={{ zIndex: 25 }}>
        {SurfaceTexture}
      </div>

      {/* Card Content - Text Overlay (z-30) */}
      <div 
        className="absolute inset-0 p-6 flex flex-col justify-end"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none',
          backfaceVisibility: 'hidden',
          zIndex: 30
        }}
      >
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
          <h3 className="text-xl font-bold mb-1">{card.title}</h3>
          {card.description && (
            <p className="text-sm mb-1">{card.description}</p>
          )}
          {card.rarity && (
            <p className="text-xs uppercase tracking-wide opacity-75">{card.rarity}</p>
          )}
        </div>
      </div>

      {/* Interactive Lighting Overlay - Top Layer (z-40) */}
      {isHovering && interactiveLighting && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(
              ellipse 120% 80% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0.08) 40%,
              transparent 70%
            )`,
            mixBlendMode: 'soft-light',
            opacity: 0.8,
            transition: 'opacity 0.1s ease',
            backfaceVisibility: 'hidden',
            zIndex: 40
          }}
        />
      )}
    </div>
  );
};
