
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
  // Calculate visibility based on Y rotation angle with proper front-face detection
  const getVisibility = () => {
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((rotation.y % 360) + 360) % 360;
    
    // Front is visible from 315° to 45° (spanning 0°) - expanded range for smoother transitions
    const isFrontVisible = normalizedRotation >= 315 || normalizedRotation <= 45;
    
    if (!isFrontVisible) {
      return { opacity: 0, display: 'none' };
    }
    
    // Calculate opacity with smooth transitions only when visible
    let opacity = 1;
    if (normalizedRotation >= 315) {
      // From 315° to 360°: fade in
      opacity = Math.min(1, (normalizedRotation - 315) / 30);
    } else if (normalizedRotation <= 45) {
      // From 0° to 45°: fade out
      opacity = Math.max(0, 1 - (normalizedRotation / 30));
    }
    
    return { 
      opacity: Math.max(0.1, opacity), // Minimum opacity to prevent complete disappearance
      display: 'block'
    };
  };

  const { opacity: frontOpacity, display } = getVisibility();

  // Don't render at all if not visible to prevent Z-fighting
  if (display === 'none') {
    return null;
  }

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        opacity: frontOpacity,
        transition: 'opacity 0.1s ease',
        backfaceVisibility: 'hidden',
        transform: 'rotateY(0deg)', // Ensure front face orientation
        zIndex: frontOpacity > 0.5 ? 20 : 10, // Higher z-index when fully visible
        ...frameStyles
      }}
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
