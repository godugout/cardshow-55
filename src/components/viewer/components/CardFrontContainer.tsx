
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
  onClick: () => void;
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
  onClick
}) => {
  // Simplified visibility calculation with clear angle ranges
  const getVisibility = () => {
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((rotation.y % 360) + 360) % 360;
    
    // Front is visible from 315° to 45° (centered at 0°/360°)
    const isFrontVisible = normalizedRotation >= 315 || normalizedRotation <= 45;
    
    // Debug logging
    console.log('🔄 Card Front - Rotation:', normalizedRotation.toFixed(1), 'Visible:', isFrontVisible);
    
    if (!isFrontVisible) {
      return { opacity: 0, zIndex: 5, display: 'none' as const };
    }
    
    // Calculate smooth opacity transitions at edges
    let opacity = 1;
    const fadeRange = 15; // 15 degrees fade at each edge
    
    if (normalizedRotation >= 315 && normalizedRotation <= 315 + fadeRange) {
      // Fade in from 315° to 330°
      opacity = (normalizedRotation - 315) / fadeRange;
    } else if (normalizedRotation >= 45 - fadeRange && normalizedRotation <= 45) {
      // Fade out from 30° to 45°
      opacity = (45 - normalizedRotation) / fadeRange;
    }
    
    return { 
      opacity: Math.max(0.1, opacity),
      zIndex: opacity > 0.5 ? 25 : 15, // Higher z-index when more visible
      display: 'block' as const
    };
  };

  const { opacity: frontOpacity, zIndex: frontZIndex, display } = getVisibility();

  // Don't render at all if not visible
  if (display === 'none') {
    return null;
  }

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        opacity: frontOpacity,
        zIndex: frontZIndex,
        transition: 'opacity 0.3s ease, z-index 0.1s ease',
        backfaceVisibility: 'hidden',
        ...frameStyles
      }}
      data-visibility={frontOpacity > 0.1 ? 'visible' : 'hidden'}
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
