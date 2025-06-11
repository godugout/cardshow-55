
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

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
          className="absolute inset-0 backface-hidden"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s',
            ...frameStyles,
            ...enhancedEffectStyles
          }}
        >
          {/* Enhanced visual effects background */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            {SurfaceTexture}
            
            {/* Enhanced effect layers */}
            {showEffects && Object.entries(effectValues).map(([effectId, effect]) => {
              if (!effect.intensity || effect.intensity === 0) return null;
              
              return (
                <div
                  key={effectId}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    opacity: (effect.intensity as number) / 100 * 0.3,
                    mixBlendMode: 'overlay',
                    background: getEffectGradient(effectId, mousePosition)
                  }}
                />
              );
            })}
          </div>

          {/* Card Content */}
          <div className="relative h-full p-6 flex flex-col bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-700">
            {/* Card Image */}
            <div className="flex-1 mb-4 relative overflow-hidden rounded-md">
              {card.image_url ? (
                <img 
                  src={card.image_url} 
                  alt={card.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('🚨 Card image failed to load:', card.image_url);
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <span className="text-white/50 text-sm">No Image</span>
                </div>
              )}
            </div>
            
            {/* Card Details */}
            <div className="mt-auto bg-black/80 p-4 rounded-md">
              <h3 className="text-white text-xl font-bold mb-2">{card.title}</h3>
              {card.description && (
                <p className="text-gray-300 text-sm mb-2">{card.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs uppercase">{card.rarity}</span>
                <span className="text-purple-400 text-xs">★ Collectible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Back */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
            transition: 'transform 0.6s',
            ...frameStyles
          }}
        >
          <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-600 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="text-6xl mb-4">🎴</div>
              <h3 className="text-xl font-bold mb-2">CRD Card</h3>
              <p className="text-gray-300 text-sm">Collectible Trading Card</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate effect gradients
const getEffectGradient = (effectId: string, mousePosition: { x: number; y: number }) => {
  const { x, y } = mousePosition;
  
  switch (effectId) {
    case 'holographic':
      return `linear-gradient(${x * 360}deg, 
        rgba(255, 0, 255, 0.3) 0%, 
        rgba(0, 255, 255, 0.3) 50%, 
        rgba(255, 255, 0, 0.3) 100%)`;
    case 'chrome':
      return `radial-gradient(circle at ${x * 100}% ${y * 100}%, 
        rgba(255, 255, 255, 0.4) 0%, 
        rgba(192, 192, 192, 0.2) 50%, 
        transparent 100%)`;
    case 'prizm':
      return `linear-gradient(${(x + y) * 180}deg, 
        rgba(255, 0, 100, 0.3), 
        rgba(100, 255, 0, 0.3), 
        rgba(0, 100, 255, 0.3))`;
    case 'foilspray':
      return `radial-gradient(circle at ${x * 100}% ${y * 100}%, 
        rgba(255, 215, 0, 0.4) 0%, 
        rgba(255, 223, 0, 0.2) 50%, 
        transparent 100%)`;
    default:
      return `linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`;
  }
};
