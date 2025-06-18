
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Card } from '@/types/card';

interface CardManagementCompactViewProps {
  cards: Card[];
  onToggleVisibility: (cardId: string, currentVisibility: boolean) => void;
  onDeleteCard: (cardId: string) => void;
  getRarityColor: (rarity: string) => string;
}

export const CardManagementCompactView: React.FC<CardManagementCompactViewProps> = ({
  cards,
  onToggleVisibility,
  onDeleteCard,
  getRarityColor
}) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-crd-lightGray">
        No cards found matching your criteria.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cards.map((card) => (
        <div key={card.id} className="flex items-center justify-between p-3 bg-crd-mediumGray/30 rounded-lg hover:bg-crd-mediumGray/50 transition-colors">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {card.thumbnail_url && (
              <img 
                src={card.thumbnail_url} 
                alt={card.title}
                className="w-8 h-11 object-cover rounded flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{card.title}</h3>
                  <p className="text-sm text-crd-lightGray truncate">
                    {card.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  <Badge className={`${getRarityColor(card.rarity)} text-white text-xs`}>
                    {card.rarity}
                  </Badge>
                  <Badge variant={card.is_public ? 'default' : 'secondary'} className="text-xs">
                    {card.is_public ? 'Public' : 'Private'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleVisibility(card.id, card.is_public)}
              className="text-crd-lightGray hover:text-white h-8 w-8 p-0"
            >
              {card.is_public ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-crd-lightGray hover:text-white h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-crd-darkGray border-crd-mediumGray">
                <DropdownMenuItem 
                  onClick={() => window.open(`/card/${card.id}`, '_blank')}
                  className="text-white hover:bg-crd-mediumGray"
                >
                  View Card
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteCard(card.id)}
                  className="text-red-400 hover:bg-crd-mediumGray focus:text-red-400"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};
