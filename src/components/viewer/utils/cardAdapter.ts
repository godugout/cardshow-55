
import type { CardData } from '@/types/card';
import type { CardData as EditorCardData } from '@/hooks/useCardEditor';

export interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
  rarity?: string;
  description?: string;
}

export const adaptCardForSpaceRenderer = (card: CardData | EditorCardData): Simple3DCard => {
  return {
    id: card.id || `card_${Date.now()}`,
    title: card.title,
    image_url: card.image_url,
    rarity: typeof card.rarity === 'string' ? card.rarity : 'common',
    description: card.description
  };
};

// Helper to convert Simple3DCard back to CardData format when needed
export const expandSimpleCardToCardData = (simpleCard: Simple3DCard): CardData => {
  return {
    id: simpleCard.id,
    title: simpleCard.title,
    description: simpleCard.description || '',
    rarity: (simpleCard.rarity as any) || 'common',
    tags: [],
    image_url: simpleCard.image_url,
    design_metadata: {},
    visibility: 'private',
    creator_attribution: {},
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: false,
      print_available: false,
      pricing: {
        currency: 'USD'
      }
    }
  };
};
