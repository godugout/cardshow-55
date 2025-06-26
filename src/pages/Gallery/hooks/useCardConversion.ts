
import { useCallback } from 'react';
import type { Tables } from '@/integrations/supabase/types';
import type { CardData } from '@/hooks/useCardEditor';

type Card = Tables<'cards'>;

export const useCardConversion = () => {
  const convertCardsToCardData = useCallback((cards: Card[]): CardData[] => {
    return cards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description || '',
      image_url: card.image_url,
      rarity: card.rarity || 'common',
      creator_id: card.creator_id,
      created_at: card.created_at,
      updated_at: card.updated_at,
      tags: card.tags || [],
      visibility: card.visibility || 'private',
      is_public: card.is_public || false,
      design_metadata: card.design_metadata || {},
      current_market_value: card.current_market_value,
      view_count: card.view_count || 0,
      favorite_count: card.favorite_count || 0
    }));
  }, []);

  const convertCardDataToCard = useCallback((cardData: CardData): Partial<Card> => {
    return {
      id: cardData.id,
      title: cardData.title,
      description: cardData.description,
      image_url: cardData.image_url,
      rarity: cardData.rarity,
      creator_id: cardData.creator_id,
      tags: cardData.tags,
      visibility: cardData.visibility,
      is_public: cardData.is_public,
      design_metadata: cardData.design_metadata
    };
  }, []);

  return {
    convertCardsToCardData,
    convertCardDataToCard
  };
};
