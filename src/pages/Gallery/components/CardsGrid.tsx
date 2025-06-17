
import React from 'react';
import { CardItem } from '@/components/shared/CardItem';
import { Skeleton } from '@/components/ui/skeleton';
import type { Tables } from '@/integrations/supabase/types';

type DbCard = Tables<'cards'>;

interface CardsGridProps {
  cards: DbCard[];
  loading: boolean;
  onCardClick: (card: DbCard) => void;
}

export const CardsGrid: React.FC<CardsGridProps> = ({ cards, loading, onCardClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="w-full aspect-[3/4] rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#777E90]">No cards found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          title={card.title}
          price="1.5"
          image={card.image_url || card.thumbnail_url || ''}
          onClick={() => onCardClick(card)}
          className="cursor-pointer hover:transform hover:scale-105 transition-transform duration-200"
        />
      ))}
    </div>
  );
};
