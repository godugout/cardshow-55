
import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { Card, CardRarity } from '@/types/cardshow';

interface CardItemProps {
  card: Card;
  isSelected?: boolean;
  multiSelectMode?: boolean;
  onTap: (card: Card) => void;
  onLongPress: (card: Card) => void;
  onFavorite?: (cardId: string) => void;
}

const rarityColors: Record<CardRarity, string> = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-orange-400 to-orange-600'
};

const rarityGlow: Record<CardRarity, string> = {
  common: 'shadow-gray-400/20',
  rare: 'shadow-blue-400/30',
  epic: 'shadow-purple-400/40',
  legendary: 'shadow-orange-400/50'
};

export const CardItem: React.FC<CardItemProps> = ({
  card,
  isSelected = false,
  multiSelectMode = false,
  onTap,
  onLongPress,
  onFavorite
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      onLongPress(card);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleClick = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    onTap(card);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(card.id);
  };

  return (
    <div
      className={`
        relative aspect-[2.5/3.5] bg-[#2d2d2d] rounded-lg overflow-hidden cursor-pointer
        transition-all duration-300 transform
        ${isSelected ? 'scale-95 ring-2 ring-[#00C851]' : 'hover:scale-105'}
        ${rarityGlow[card.rarity]} shadow-lg
        touch-manipulation select-none
      `}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Rarity border */}
      <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[card.rarity]} opacity-20 z-0`} />
      
      {/* Multi-select checkbox */}
      {multiSelectMode && (
        <div className="absolute top-2 right-2 z-20">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected ? 'bg-[#00C851] border-[#00C851]' : 'bg-black/50 border-white'
          }`}>
            {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
          </div>
        </div>
      )}

      {/* Favorite button */}
      {!multiSelectMode && (
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 z-20 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${card.favorite ? 'text-red-500 fill-red-500' : 'text-white'}`}
          />
        </button>
      )}

      {/* Card image */}
      <div className="relative w-full h-2/3 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-600 animate-pulse" />
        )}
        <img
          src={card.image}
          alt={card.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjMkQyRDJEIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTQwIiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+Q2FyZDwvdGV4dD4KPC9zdmc+';
            setImageLoaded(true);
          }}
        />
      </div>

      {/* Card details */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{card.name}</h3>
            <p className="text-gray-300 text-xs truncate">{card.type}</p>
          </div>
          
          {/* Rarity indicator */}
          <div className="flex items-center ml-2">
            <Star className={`w-4 h-4 ${
              card.rarity === 'legendary' ? 'text-orange-400 fill-orange-400' :
              card.rarity === 'epic' ? 'text-purple-400 fill-purple-400' :
              card.rarity === 'rare' ? 'text-blue-400 fill-blue-400' :
              'text-gray-400 fill-gray-400'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};
