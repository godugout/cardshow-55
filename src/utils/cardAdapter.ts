
import type { Card } from '@/repositories/cardRepository';
import type { CardData } from '@/hooks/useCardEditor';

export const convertCardToCardData = (card: Card): CardData => {
  return {
    id: card.id,
    title: card.title,
    description: card.description,
    rarity: card.rarity as CardData['rarity'],
    tags: card.tags,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    design_metadata: card.design_metadata,
    visibility: card.is_public ? 'public' : 'private',
    is_public: card.is_public,
    template_id: card.template_id,
    collection_id: card.collection_id,
    team_id: card.team_id,
    creator_id: card.creator_id,
    price: card.price,
    edition_size: card.edition_size,
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: card.is_public,
      crd_catalog_inclusion: true,
      print_available: !!card.price,
      pricing: {
        currency: 'USD',
        base_price: card.price
      },
      distribution: {
        limited_edition: card.edition_size > 1,
        edition_size: card.edition_size
      }
    }
  };
};

export const convertCardDataToCard = (cardData: CardData, creatorId: string): Omit<Card, 'created_at' | 'updated_at'> => {
  return {
    id: cardData.id || '',
    title: cardData.title,
    description: cardData.description,
    creator_id: creatorId,
    team_id: cardData.team_id,
    collection_id: cardData.collection_id,
    image_url: cardData.image_url,
    thumbnail_url: cardData.thumbnail_url,
    rarity: cardData.rarity,
    tags: cardData.tags,
    design_metadata: cardData.design_metadata,
    edition_size: cardData.publishing_options.distribution?.edition_size || 1,
    price: cardData.publishing_options.pricing?.base_price,
    is_public: cardData.visibility === 'public',
    template_id: cardData.template_id
  };
};
