
import React from 'react';
import { X, Heart, Share, ArrowLeftRight } from 'lucide-react';
import { Card } from '@/types/cardshow';

interface CardDetailModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: (cardId: string) => void;
  onTrade?: (card: Card) => void;
  onShare?: (card: Card) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  onFavorite,
  onTrade,
  onShare
}) => {
  if (!isOpen || !card) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#2d2d2d] rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="text-white text-lg font-semibold truncate">{card.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Card image */}
        <div className="relative aspect-[2.5/3.5] bg-black/20">
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card details */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Type</p>
              <p className="text-white font-medium">{card.type}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm">Rarity</p>
              <p className={`font-medium capitalize ${
                card.rarity === 'legendary' ? 'text-orange-400' :
                card.rarity === 'epic' ? 'text-purple-400' :
                card.rarity === 'rare' ? 'text-blue-400' :
                'text-gray-400'
              }`}>
                {card.rarity}
              </p>
            </div>
          </div>

          {card.stats && (
            <div>
              <p className="text-gray-300 text-sm mb-2">Stats</p>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(card.stats).map(([stat, value]) => (
                  <div key={stat} className="text-center">
                    <p className="text-gray-400 text-xs capitalize">{stat}</p>
                    <p className="text-white font-bold text-lg">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {card.description && (
            <div>
              <p className="text-gray-300 text-sm mb-1">Description</p>
              <p className="text-gray-100 text-sm leading-relaxed">{card.description}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="p-4 border-t border-gray-600 flex gap-3">
          <button
            onClick={() => onFavorite?.(card.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors min-h-[44px] ${
              card.favorite 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${card.favorite ? 'fill-red-400' : ''}`} />
            <span className="font-medium">Favorite</span>
          </button>
          
          <button
            onClick={() => onTrade?.(card)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#00C851] text-black rounded-lg font-medium hover:bg-[#00C851]/90 transition-colors min-h-[44px]"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Trade</span>
          </button>
          
          <button
            onClick={() => onShare?.(card)}
            className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
