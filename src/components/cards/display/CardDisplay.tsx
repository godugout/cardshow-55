import React, { useState } from 'react';
import { CardData } from '@/types/card';

export type CardDisplayMode = 'front' | 'back' | 'both' | 'sandwich';
export type CardStyle = 'standard' | 'holographic' | 'gold' | 'vintage';

interface CardDisplayProps {
  card: CardData;
  mode?: CardDisplayMode;
  style?: CardStyle;
  className?: string;
  onFlip?: () => void;
  onEnlarge?: () => void;
  debug?: boolean;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  mode = 'front',
  style = 'standard',
  className = '',
  onFlip,
  onEnlarge,
  debug = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
    console.log(`🔄 Card flipped: ${card.title} - now showing ${!isFlipped ? 'back' : 'front'}`);
  };

  const handleDoubleClick = () => {
    setIsEnlarged(!isEnlarged);
    onEnlarge?.();
    console.log(`🔍 Card enlarged: ${card.title} - enlarged: ${!isEnlarged}`);
  };

  const getStyleClasses = (cardStyle: CardStyle, isBack = false) => {
    const baseCard = "w-[300px] h-[420px] rounded-xl shadow-lg border-2 cursor-pointer transition-all duration-300";
    
    if (isBack) {
      // Card back styling
      switch (cardStyle) {
        case 'holographic':
          return `${baseCard} bg-gradient-to-br from-purple-600 via-blue-500 to-purple-600 border-purple-400 animate-gradient-shift`;
        case 'gold':
          return `${baseCard} bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-400`;
        case 'vintage':
          return `${baseCard} bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 border-amber-500`;
        default:
          return `${baseCard} bg-gradient-to-br from-crd-darkGray via-crd-mediumGray to-crd-darkGray border-crd-mediumGray`;
      }
    }

    // Card front styling
    switch (cardStyle) {
      case 'holographic':
        return `${baseCard} bg-gradient-to-br from-slate-900 to-slate-800 border-purple-400 hover:shadow-purple-400/50 hover:border-purple-300`;
      case 'gold':
        return `${baseCard} bg-gradient-to-br from-slate-900 to-slate-800 border-yellow-400 hover:shadow-yellow-400/50 hover:border-yellow-300`;
      case 'vintage':
        return `${baseCard} bg-gradient-to-br from-amber-900 to-amber-800 border-amber-500 hover:shadow-amber-400/50 hover:border-amber-400`;
      default:
        return `${baseCard} bg-gradient-to-br from-slate-900 to-slate-800 border-crd-mediumGray hover:shadow-crd-green/30 hover:border-crd-green`;
    }
  };

  const getCardContent = (isBack = false) => {
    if (isBack) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* CRD Logo/Pattern */}
          <div className="text-6xl font-bold opacity-20 mb-4">CRD</div>
          <div className="text-sm opacity-60 text-center">
            CARDSHOW
            <br />
            DIGITAL COLLECTIBLE
          </div>
          
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-2 w-full h-full p-4">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="bg-current rounded-full aspect-square opacity-30" />
              ))}
            </div>
          </div>
          
          {/* Rarity indicator */}
          <div className="absolute bottom-4 right-4 text-xs opacity-80 font-semibold">
            {card.rarity.toUpperCase()}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full relative overflow-hidden">
        {/* Card Image */}
        {card.image_url && (
          <img
            src={card.image_url}
            alt={card.title}
            className="w-full h-[250px] object-cover"
          />
        )}
        
        {/* Card Info */}
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-2 truncate">{card.title}</h3>
          {card.description && (
            <p className="text-xs text-gray-300 mb-3 line-clamp-2">{card.description}</p>
          )}
          
          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {card.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs bg-crd-mediumGray px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Rarity Badge */}
          <div className="flex justify-between items-center">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
              card.rarity === 'legendary' ? 'bg-purple-600' :
              card.rarity === 'epic' ? 'bg-orange-600' :
              card.rarity === 'rare' ? 'bg-blue-600' :
              card.rarity === 'uncommon' ? 'bg-green-600' : 'bg-gray-600'
            }`}>
              {card.rarity.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">#{card.id.slice(-6)}</span>
          </div>
        </div>
        
        {/* Style Effect Overlay */}
        {style === 'holographic' && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 pointer-events-none animate-holographic-flow" />
        )}
        {style === 'gold' && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-yellow-400/20 pointer-events-none" />
        )}
        {style === 'vintage' && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-800/30 via-transparent to-amber-700/30 pointer-events-none" />
        )}
      </div>
    );
  };

  const renderCard = (showBack = false, additionalClasses = '') => (
    <div
      className={`
        ${getStyleClasses(style, showBack)}
        ${additionalClasses}
        hover:translate-y-[-10px]
        ${isEnlarged ? 'scale-150 z-50' : ''}
        ${debug ? (showBack ? 'border-blue-500 border-4' : 'border-red-500 border-4') : ''}
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
    >
      {getCardContent(showBack)}
      {debug && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {showBack ? 'BACK' : 'FRONT'}
        </div>
      )}
    </div>
  );

  // Handle different display modes
  switch (mode) {
    case 'back':
      return <div className={className}>{renderCard(true)}</div>;
      
    case 'both':
      return (
        <div className={`flex gap-5 ${className}`}>
          {renderCard(false)}
          {renderCard(true)}
        </div>
      );
      
    case 'sandwich':
      return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ perspective: '1000px' }}>
          {/* Left card - rotated */}
          <div
            className="absolute"
            style={{
              transform: 'rotateY(-15deg) translateX(-20px)',
              transformStyle: 'preserve-3d'
            }}
          >
            {renderCard(false)}
          </div>
          
          {/* Glowing orb effect */}
          <div className="absolute z-10 w-16 h-16 bg-gradient-to-br from-crd-green via-crd-blue to-crd-purple rounded-full animate-pulse shadow-2xl">
            <div className="w-full h-full bg-white/20 rounded-full animate-ping" />
          </div>
          
          {/* Right card - rotated */}
          <div
            className="absolute"
            style={{
              transform: 'rotateY(15deg) translateX(20px)',
              transformStyle: 'preserve-3d'
            }}
          >
            {renderCard(true)}
          </div>
        </div>
      );
      
    default:
      return (
        <div className={className}>
          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s'
            }}
          >
            <div style={{ backfaceVisibility: 'hidden' }}>
              {renderCard(false)}
            </div>
            <div 
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            >
              {renderCard(true)}
            </div>
          </div>
        </div>
      );
  }
};