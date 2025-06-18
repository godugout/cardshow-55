
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card as CardType } from './types';

interface SearchableCardItemProps {
  card: CardType;
  isSelected: boolean;
  onToggleSelection: (cardId: string) => void;
}

export const SearchableCardItem: React.FC<SearchableCardItemProps> = ({
  card,
  isSelected,
  onToggleSelection
}) => {
  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected
          ? 'bg-crd-green/20 border-crd-green'
          : 'bg-crd-mediumGray border-crd-lightGray hover:border-crd-green/50'
      }`}
      onClick={() => onToggleSelection(card.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={isSelected}
            onChange={() => onToggleSelection(card.id)}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-crd-white font-medium truncate">{card.title}</h4>
            {card.description && (
              <p className="text-crd-lightGray text-sm mt-1 line-clamp-2">
                {card.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {card.rarity && (
                <Badge variant="secondary" className="text-xs">
                  {card.rarity}
                </Badge>
              )}
              {card.series && (
                <Badge variant="outline" className="text-xs">
                  {card.series}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
