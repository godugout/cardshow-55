
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
  // Improved visibility calculation for front face
  const getVisibility = () => {
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((rotation.y % 360) + 360) % 360;
    
    // Front is visible from 270° to 90° (crossing 0°/360°)
    const isFrontVisible = normalizedRotation >= 270 || normalizedRotation <= 90;
    
    console.log('🔄 Card Front - Rotation:', normalizedRotation.toFixed(1), 'Visible:', isFrontVisible);
    
    if (!isFrontVisible) {
      return { opacity: 0, zIndex: 5, display: 'none' as const };
    }
    
    // Calculate smooth opacity transitions
    let opacity = 1;
    const fadeRange = 20; // Degrees for fade transition
    
    if (normalizedRotation >= 270 && normalizedRotation <= 270 + fadeRange) {
      // Fade in from 270° to 290°
      opacity = (normalizedRotation - 270) / fadeRange;
    } else if (normalizedRotation >= 90 - fadeRange && normalizedRotation <= 90) {
      // Fade out from 70° to 90°
      opacity = (90 - normalizedRotation) / fadeRange;
    }
    
    return { 
      opacity: Math.max(0.1, opacity),
      zIndex: opacity > 0.5 ? 25 : 15,
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
      onClick={onClick}
    >
      {/* Base Card Frame */}
      <div className="absolute inset-0 z-10" style={frameStyles} />
      
      {/* Effects Layer */}
      <div className="absolute inset-0 z-20">
        <CardEffectsLayer
          showEffects={showEffects}
          isHovering={isHovering}
          effectIntensity={[50]} // Keep for backward compatibility
          mousePosition={mousePosition}
          physicalEffectStyles={enhancedEffectStyles}
          effectValues={effectValues}
          interactiveLighting={interactiveLighting}
          applyToFrame={false} // Apply to full card
        />
        
        {/* Surface Texture */}
        <div className="relative z-20">
          {SurfaceTexture}
        </div>
      </div>
      
      {/* Card Image */}
      <div className="relative h-full z-30">
        {card.image_url ? (
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover object-center rounded-xl"
            style={{
              filter: showEffects 
                ? 'brightness(1.05) contrast(1.02)' 
                : 'none',
              transition: 'filter 0.3s ease'
            }}
            draggable="false"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Content Overlay */}
      <div className="absolute inset-0 z-40 p-6 pointer-events-none">
        <div className="h-full flex flex-col">
          <div className="mt-auto">
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-3">
              {card.title && (
                <h3 className="text-white text-xl font-bold mb-1">{card.title}</h3>
              )}
              {card.description && (
                <p className="text-white text-sm opacity-90">{card.description}</p>
              )}
              {card.rarity && (
                <p className="text-white text-xs uppercase tracking-wide opacity-75 mt-1">{card.rarity}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Lighting */}
      {interactiveLighting && isHovering && (
        <div
          className="absolute inset-0 z-50 pointer-events-none rounded-xl"
          style={{
            background: `
              radial-gradient(
                ellipse 180% 140% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.03) 0%,
                rgba(255, 255, 255, 0.01) 50%,
                transparent 85%
              )
            `,
            mixBlendMode: 'soft-light',
            transition: 'opacity 0.2s ease',
            opacity: showEffects ? 0.6 : 0.3
          }}
        />
      )}
    </div>
  );
};
