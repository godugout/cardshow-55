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
  solidCardTransition?: boolean;
}

const getAxisFrontOpacity = (normalizedRotation: number): number => {
  const fadeRange = 30;
  const isFrontVisible = normalizedRotation <= 90 || normalizedRotation >= 270;
  if (!isFrontVisible) return 0;

  let opacity = 1;
  // Fading out from 60° to 90°
  if (normalizedRotation > 90 - fadeRange && normalizedRotation <= 90) {
    opacity = (90 - normalizedRotation) / fadeRange;
  }
  // Fading in from 270° to 300°
  else if (normalizedRotation >= 270 && normalizedRotation < 270 + fadeRange) {
    opacity = (normalizedRotation - 270) / fadeRange;
  }
  return opacity;
};

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
  solidCardTransition = false,
}) => {
  // Improved visibility calculation for both X and Y axes
  const getVisibility = () => {
    // Normalize rotations to 0-360 range
    const normalizedY = ((rotation.y % 360) + 360) % 360;
    const normalizedX = ((rotation.x % 360) + 360) % 360;

    const isStrictlyFrontVisible = (normalizedY <= 90 || normalizedY >= 270) && (normalizedX <= 90 || normalizedX >= 270);

    if (solidCardTransition) {
      return {
        opacity: isStrictlyFrontVisible ? 1 : 0,
        zIndex: isStrictlyFrontVisible ? 25 : 5,
      };
    }
    
    const opacityY = getAxisFrontOpacity(normalizedY);
    const opacityX = getAxisFrontOpacity(normalizedX);
    
    // Final opacity is the product of opacities from each axis.
    // This ensures the front is only visible when both axes are front-facing.
    const opacity = opacityY * opacityX;

    console.log('🔄 Card Front - Rotation X:', normalizedX.toFixed(1), 'Y:', normalizedY.toFixed(1), 'Opacity:', opacity.toFixed(2));
    
    return { 
      opacity: Math.max(0, opacity),
      zIndex: opacity > 0.3 ? 25 : 15, // Higher z-index when more visible
    };
  };

  const { opacity: frontOpacity, zIndex: frontZIndex } = getVisibility();

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        opacity: frontOpacity,
        zIndex: frontZIndex,
        transition: 'opacity 0.3s ease, z-index 0.1s ease',
        backfaceVisibility: 'hidden',
        ...frameStyles,
        pointerEvents: frontOpacity > 0.1 ? 'auto' : 'none',
      }}
      data-visibility={frontOpacity > 0.1 ? 'visible' : 'hidden'}
      data-front-rotation={rotation.y.toFixed(1)}
    >
      {/* Base Layer - Card Frame */}
      <div className="absolute inset-0 z-10" style={frameStyles} />
      
      {/* Effects Layer - Only on Frame */}
      <div className="absolute inset-0 z-20">
        <CardEffectsLayer
          showEffects={showEffects}
          isHovering={isHovering}
          effectIntensity={[50]} // Keep for backward compatibility
          mousePosition={mousePosition}
          physicalEffectStyles={enhancedEffectStyles}
          effectValues={effectValues}
          interactiveLighting={interactiveLighting}
          applyToFrame={true}
        />
        
        {/* Surface Texture - Only applied to frame areas */}
        <div className="relative">
          {SurfaceTexture}
        </div>
      </div>

      {/* Card Image - Always On Top */}
      <div className="absolute inset-0 z-40">
        {card.image_url && (
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover"
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

      {/* Card Content - Overlay */}
      <div 
        className="absolute inset-0 p-6 flex flex-col z-30"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="mt-auto">
          <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-lg p-3 text-white">
            <h3 className="text-xl font-bold mb-1">{card.title}</h3>
            {card.description && (
              <p className="text-sm mb-1">{card.description}</p>
            )}
            {card.rarity && (
              <p className="text-xs uppercase tracking-wide opacity-75">{card.rarity}</p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Lighting Overlay - Very Subtle */}
      {isHovering && interactiveLighting && (
        <div 
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: `radial-gradient(
              ellipse 120% 80% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, 0.06) 0%,
              rgba(255, 255, 255, 0.03) 40%,
              transparent 70%
            )`,
            mixBlendMode: 'soft-light',
            opacity: 0.5,
            transition: 'opacity 0.1s ease',
            backfaceVisibility: 'hidden'
          }}
        />
      )}
    </div>
  );
};
