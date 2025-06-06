
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { Badge } from '@/components/ui/badge';

interface CompactCardDetailsProps {
  card: CardData;
}

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'legendary':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
    case 'rare':
      return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
    case 'uncommon':
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    case 'common':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const CompactCardDetails: React.FC<CompactCardDetailsProps> = ({ card }) => {
  return (
    <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-lg p-3 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-sm truncate max-w-[200px]">
          {card.title}
        </h3>
        <Badge className={`text-xs font-bold ${getRarityColor(card.rarity)} border-0`}>
          {card.rarity.toUpperCase()}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-4 text-xs text-gray-300">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-crd-purple rounded-full"></span>
          <span>{card.template_id}</span>
        </span>
        
        {card.tags && card.tags.length > 0 && (
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-crd-green rounded-full"></span>
            <span>{card.tags[0]}</span>
            {card.tags.length > 1 && <span>+{card.tags.length - 1}</span>}
          </span>
        )}
        
        {card.design_metadata?.effects && (
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-crd-orange rounded-full"></span>
            <span>Enhanced</span>
          </span>
        )}
      </div>
    </div>
  );
};
