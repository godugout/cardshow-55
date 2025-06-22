
import React, { useState } from 'react';
import { Heart, Star, Share2, ShoppingCart } from 'lucide-react';
import { Card } from '@/types/cardshow';
import { useAdvancedTouch } from '@/hooks/useAdvancedTouch';

interface AdvancedCardItemProps {
  card: Card;
  onFavorite?: (cardId: string) => void;
  onTrade?: (cardId: string) => void;
  onShare?: (cardId: string) => void;
  onView?: (card: Card) => void;
  onCompare?: (card: Card) => void;
}

export const AdvancedCardItem: React.FC<AdvancedCardItemProps> = ({
  card,
  onFavorite,
  onTrade,
  onShare,
  onView,
  onCompare
}) => {
  const [scale, setScale] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGestureHint, setShowGestureHint] = useState(false);

  const { touchHandlers, isLongPressing } = useAdvancedTouch({
    onTap: () => onView?.(card),
    onDoubleTap: () => setIsFlipped(!isFlipped),
    onLongPress: () => setShowGestureHint(true),
    onSwipeLeft: () => onTrade?.(card.id),
    onSwipeRight: () => onFavorite?.(card.id),
    onSwipeUp: () => setIsFlipped(!isFlipped),
    onPinch: (newScale) => setScale(Math.max(0.5, Math.min(3, newScale))),
    onTwoFingerTap: () => onCompare?.(card),
    enableHaptic: true
  });

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-orange-400 to-orange-600'
  };

  const rarityGlow = {
    common: 'shadow-gray-400/20',
    rare: 'shadow-blue-400/30',
    epic: 'shadow-purple-400/40',
    legendary: 'shadow-orange-400/50'
  };

  return (
    <div className="relative">
      <div
        {...touchHandlers}
        className={`
          relative aspect-[2.5/3.5] bg-[#2d2d2d] rounded-lg overflow-hidden
          transition-all duration-300 transform cursor-pointer
          ${rarityGlow[card.rarity]} shadow-lg
          ${isLongPressing ? 'scale-95 ring-2 ring-[#00C851]' : ''}
          touch-manipulation select-none
        `}
        style={{ 
          transform: `scale(${scale}) ${isFlipped ? 'rotateY(180deg)' : ''}`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Rarity border */}
        <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[card.rarity]} opacity-20 z-0`} />
        
        {/* Front of card */}
        <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
          <div className="relative w-full h-2/3 overflow-hidden">
            <img
              src={card.image}
              alt={card.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjMkQyRDJEIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTQwIiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+Q2FyZDwvdGV4dD4KPC9zdmc+';
              }}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">{card.name}</h3>
                <p className="text-gray-300 text-xs truncate">{card.type}</p>
              </div>
              <Star className={`w-4 h-4 ${
                card.rarity === 'legendary' ? 'text-orange-400 fill-orange-400' :
                card.rarity === 'epic' ? 'text-purple-400 fill-purple-400' :
                card.rarity === 'rare' ? 'text-blue-400 fill-blue-400' :
                'text-gray-400 fill-gray-400'
              }`} />
            </div>
          </div>
        </div>

        {/* Back of card - Stats */}
        <div className={`absolute inset-0 bg-[#2d2d2d] p-4 flex flex-col justify-center backface-hidden ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
             style={{ transform: 'rotateY(180deg)' }}>
          <div className="text-center text-white">
            <h3 className="font-bold text-lg mb-4">{card.name}</h3>
            {card.stats && (
              <div className="space-y-2">
                {Object.entries(card.stats).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between">
                    <span className="capitalize text-gray-300">{stat}:</span>
                    <span className="font-bold text-[#00C851]">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {card.description && (
              <p className="text-xs text-gray-400 mt-4">{card.description}</p>
            )}
          </div>
        </div>

        {/* Favorite indicator */}
        {card.favorite && (
          <div className="absolute top-2 right-2 z-10">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
        )}
      </div>

      {/* Gesture hint overlay */}
      {showGestureHint && (
        <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center z-20">
          <div className="text-center text-white p-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>Swipe →</span>
              </div>
              <div className="flex items-center gap-1">
                <ShoppingCart className="w-3 h-3" />
                <span>Swipe ←</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                <span>2 fingers</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>Double tap</span>
              </div>
            </div>
            <button
              onClick={() => setShowGestureHint(false)}
              className="mt-3 text-[#00C851] text-sm"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Scale indicator */}
      {scale !== 1 && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
};
