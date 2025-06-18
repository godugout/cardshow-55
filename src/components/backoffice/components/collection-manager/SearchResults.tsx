
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SearchableCardItem } from './SearchableCardItem';
import { Card } from './types';

interface SearchResultsProps {
  cards: Card[];
  selectedCards: string[];
  totalCount: number;
  onToggleCardSelection: (cardId: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  cards,
  selectedCards,
  totalCount,
  onToggleCardSelection
}) => {
  return (
    <>
      <Separator className="bg-crd-mediumGray" />

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-crd-lightGray">
            Found {totalCount} cards • {selectedCards.length} selected
          </p>
          {selectedCards.length > 0 && (
            <Badge className="bg-crd-green text-black">
              {selectedCards.length} cards selected
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {cards.map((card) => (
            <SearchableCardItem
              key={card.id}
              card={card}
              isSelected={selectedCards.includes(card.id)}
              onToggleSelection={onToggleCardSelection}
            />
          ))}
        </div>
      </div>
    </>
  );
};
