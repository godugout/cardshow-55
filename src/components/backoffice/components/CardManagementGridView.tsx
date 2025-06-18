
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Card } from '@/types/card';

interface CardManagementGridViewProps {
  cards: Card[];
  onToggleVisibility: (cardId: string, currentVisibility: boolean) => void;
  onDeleteCard: (cardId: string) => void;
  getRarityColor: (rarity: string) => string;
}

export const CardManagementGridView: React.FC<CardManagementGridViewProps> = ({
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.id} className="bg-crd-mediumGray/30 rounded-lg overflow-hidden hover:bg-crd-mediumGray/50 transition-colors">
          {card.thumbnail_url && (
            <div className="aspect-[5/7] bg-crd-darkGray">
              <img 
                src={card.thumbnail_url} 
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-3">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-medium text-sm truncate flex-1">{card.title}</h3>
              <div className="flex items-center space-x-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleVisibility(card.id, card.is_public)}
                  className="text-crd-lightGray hover:text-white h-6 w-6 p-0"
                >
                  {card.is_public ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-crd-lightGray hover:text-white h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
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
            
            {card.description && (
              <p className="text-xs text-crd-lightGray mb-2 line-clamp-2">
                {card.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
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
      ))}
    </div>
  );
};
