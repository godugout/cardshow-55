
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { CardEffectsLayer } from './CardEffectsLayer';

interface SimplifiedEnhancedCardContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting: boolean;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  environmentControls: any;
  showBackgroundInfo: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const SimplifiedEnhancedCardContainer: React.FC<SimplifiedEnhancedCardContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  console.log('🎯 SimplifiedEnhancedCardContainer rendering:', {
    cardTitle: card.title,
    cardImage: card.image_url,
    isFlipped,
    zoom,
    rotation
  });

  return (
    <div 
      className={`relative select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        zIndex: 10
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 3D Card Container */}
      <div
        className="relative"
        style={{
          width: '400px',
          height: '560px',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.1s ease',
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8))'
        }}
        onClick={onClick}
      >
        {/* Card Front */}
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            backfaceVisibility: 'hidden',
            opacity: isFlipped ? 0 : 1,
            zIndex: isFlipped ? 1 : 10,
            transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
            ...frameStyles
          }}
        >
          {/* Surface Texture - Base Layer */}
          <div className="absolute inset-0 z-10">
            {SurfaceTexture}
          </div>

          {/* Full Bleed Card Image - Above Surface */}
          <div className="absolute inset-0 z-20">
            {card.image_url ? (
              <img 
                src={card.image_url} 
                alt={card.title}
                className="w-full h-full object-cover"
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  pointerEvents: 'none'
                }}
                draggable={false}
                onError={(e) => {
                  console.error('🚨 Card image failed to load:', card.image_url);
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                <div className="text-center text-gray-300">
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

          {/* Effects Layer - Above Image for Full Coverage */}
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

          {/* Card Content Overlay - Top Layer */}
          <div className="absolute inset-0 p-6 flex flex-col z-40" style={{ pointerEvents: 'none' }}>
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

          {/* Interactive Lighting - Top Layer */}
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
                transition: 'opacity 0.1s ease'
              }}
            />
          )}
        </div>

        {/* Card Back */}
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            opacity: isFlipped ? 1 : 0,
            zIndex: isFlipped ? 10 : 1,
            transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.4) 0%, rgba(45, 45, 45, 0.6) 50%, rgba(26, 26, 26, 0.4) 100%)',
            ...frameStyles
          }}
        >
          {/* Surface Texture - Base Layer */}
          <div className="absolute inset-0 z-10">
            {SurfaceTexture}
          </div>

          {/* CRD Logo Background */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
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

          {/* Back Effects Layer - Above Logo */}
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

          {/* Interactive Lighting on Back - Top Layer */}
          {interactiveLighting && isHovering && (
            <div className="absolute inset-0 pointer-events-none z-40">
              <div
                style={{
                  background: `radial-gradient(
                    ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                    rgba(255, 255, 255, 0.12) 0%,
                    rgba(255, 255, 255, 0.06) 30%,
                    transparent 70%
                  )`,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 0.2s ease'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
