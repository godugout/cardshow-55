
import type { Tables } from '@/integrations/supabase/types';

// Use the database type directly
type DbCard = Tables<'cards'>;

export interface CardData {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
  metadata: {
    rarity?: string;
    effects?: {
      holographic: boolean;
      chrome: boolean;
      foil: boolean;
      intensity: number;
    };
    template?: {
      id: string;
      name: string;
      category: string;
    };
  };
  createdAt: string;
}

export const useCardConversion = () => {
  const convertCardsToCardData = (dbCards: DbCard[]): CardData[] => {
    return dbCards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description || undefined,
      imageUrl: card.image_url || card.thumbnail_url || '',
      thumbnailUrl: card.thumbnail_url || undefined,
      creator: {
        id: card.creator_id,
        username: 'Creator', // We'd get this from profiles in a real app
        avatar: undefined
      },
      metadata: {
        rarity: card.rarity || 'common',
        effects: {
          holographic: false,
          chrome: false,
          foil: false,
          intensity: 0.5
        },
        template: {
          id: card.template_id || 'default',
          name: 'Default Template',
          category: 'custom'
        }
      },
      createdAt: card.created_at || new Date().toISOString()
    }));
  };

  return { convertCardsToCardData };
};
