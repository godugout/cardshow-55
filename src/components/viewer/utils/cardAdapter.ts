
import type { CardData } from '@/types/card';

export interface Simple3DCard {
  id: string;
  title: string;
  image_url?: string;
}

export const cardAdapter = (card: CardData): Simple3DCard => {
  return {
    id: card.id || `card_${Date.now()}`,
    title: card.title,
    image_url: card.image_url
  };
};

export const adaptCardForSpaceRenderer = (card: CardData): Simple3DCard => {
  return {
    id: card.id || `card_${Date.now()}`,
    title: card.title,
    image_url: card.image_url
  };
};

// Convert Simple3DCard back to CardData for components that need full CardData
export const simpleCardToCardData = (simpleCard: Simple3DCard): CardData => {
  return {
    id: simpleCard.id,
    title: simpleCard.title,
    image_url: simpleCard.image_url,
    rarity: 'common',
    tags: [],
    design_metadata: {},
    visibility: 'private',
    creator_attribution: {},
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: false,
      print_available: false,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    }
  };
};
