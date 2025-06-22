
import React, { useState, useCallback } from 'react';
import { Card } from '@/types/cardshow';
import { CardItem } from './CardItem';

interface CardGridProps {
  cards: Card[];
  onCardSelect?: (card: Card) => void;
  onCardTrade?: (card: Card) => void;
  onCardShare?: (card: Card) => void;
  onCardFavorite?: (cardId: string) => void;
  loading?: boolean;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardSelect,
  onCardTrade,
  onCardShare,
  onCardFavorite,
  loading = false
}) => {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const handleCardTap = useCallback((card: Card) => {
    if (multiSelectMode) {
      const newSelected = new Set(selectedCards);
      if (newSelected.has(card.id)) {
        newSelected.delete(card.id);
      } else {
        newSelected.add(card.id);
      }
      setSelectedCards(newSelected);
    } else {
      onCardSelect?.(card);
    }
  }, [multiSelectMode, selectedCards, onCardSelect]);

  const handleCardLongPress = useCallback((card: Card) => {
    if (!multiSelectMode) {
      setMultiSelectMode(true);
      setSelectedCards(new Set([card.id]));
    }
  }, [multiSelectMode]);

  const exitMultiSelect = useCallback(() => {
    setMultiSelectMode(false);
    setSelectedCards(new Set());
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="aspect-[2.5/3.5] bg-[#2d2d2d] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {multiSelectMode && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#00C851] p-4 flex items-center justify-between">
          <span className="text-black font-semibold">
            {selectedCards.size} selected
          </span>
          <button
            onClick={exitMultiSelect}
            className="text-black font-semibold px-4 py-2 bg-white/20 rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4 mb-20">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            isSelected={selectedCards.has(card.id)}
            multiSelectMode={multiSelectMode}
            onTap={handleCardTap}
            onLongPress={handleCardLongPress}
            onFavorite={onCardFavorite}
          />
        ))}
      </div>
    </div>
  );
};
