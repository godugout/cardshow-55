
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';
import { InteractiveLightingLayer } from './InteractiveLightingLayer';

interface CardFace3DProps {
  card: CardData;
  isBack?: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
}

export const CardFace3D: React.FC<CardFace3DProps> = ({
  card,
  isBack = false,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false
}) => {
  // Calculate total effect intensity for image enhancement
  const totalEffectIntensity = React.useMemo(() => {
    if (!effectValues) return 0;
    return Object.values(effectValues).reduce((total, effect) => {
      const intensity = effect.intensity as number;
      return total + (typeof intensity === 'number' ? intensity : 0);
    }, 0);
  }, [effectValues]);

  return (
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        // Proper 3D positioning for front and back faces using CSS
        transform: isBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        ...frameStyles
      }}
    >
      {/* Surface Texture - Base Layer */}
      <div className="absolute inset-0 z-10">
        {SurfaceTexture}
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 z-20">
        {isBack ? (
          // Back Face - CRD Logo
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.4) 0%, rgba(45, 45, 45, 0.6) 50%, rgba(26, 26, 26, 0.4) 100%)'
            }}
          >
            <img 
              src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
              alt="CRD Logo" 
              className="w-64 h-auto opacity-60"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                pointerEvents: 'none'
              }}
              draggable={false}
            />
          </div>
        ) : (
          // Front Face - Card Image
          <div className="w-full h-full relative">
            {card.image_url ? (
              <img 
                src={card.image_url} 
                alt={card.title}
                className="w-full h-full object-cover object-center"
                style={{
                  filter: showEffects 
                    ? `brightness(${1.05 + totalEffectIntensity * 0.001}) contrast(${1.02 + totalEffectIntensity * 0.0005})` 
                    : 'none',
                  transition: 'filter 0.3s ease'
                }}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
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
        )}
      </div>

      {/* Effects Layer - Above Content */}
      <div className="absolute inset-0 z-30">
        <CardEffectsLayer
          showEffects={showEffects}
          isHovering={isHovering}
          effectIntensity={[50]}
          mousePosition={mousePosition}
          physicalEffectStyles={enhancedEffectStyles}
          effectValues={effectValues}
          interactiveLighting={interactiveLighting}
          applyToFrame={false}
        />
      </div>

      {/* Card Content Overlay - Only on Front */}
      {!isBack && card.title && (
        <div className="absolute inset-0 z-40 p-6 pointer-events-none">
          <div className="h-full flex flex-col">
            <div className="mt-auto">
              <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-lg p-3">
                <h3 className="text-white text-xl font-bold mb-1">{card.title}</h3>
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
      )}

      {/* Interactive Lighting - Top Layer */}
      <InteractiveLightingLayer
        isHovering={isHovering}
        interactiveLighting={interactiveLighting}
        mousePosition={mousePosition}
      />
    </div>
  );
};
