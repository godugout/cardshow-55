

import type { Tables } from '@/integrations/supabase/types';
import type { CardData } from '@/hooks/useCardEditor';

// Use the database type directly
type DbCard = Tables<'cards'>;

export const useCardConversion = () => {
  const convertCardsToCardData = (dbCards: DbCard[]): CardData[] => {
    return dbCards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description || undefined,
      rarity: (card.rarity as any) || 'common',
      tags: card.tags || [],
      image_url: card.image_url || card.thumbnail_url || '',
      thumbnail_url: card.thumbnail_url || undefined,
      design_metadata: typeof card.design_metadata === 'object' ? card.design_metadata as Record<string, any> : {},
      visibility: card.is_public ? 'public' : 'private',
      is_public: card.is_public || false,
      template_id: card.template_id || undefined,
      collection_id: undefined,
      team_id: undefined,
      creator_attribution: {
        creator_name: 'Creator',
        creator_id: card.creator_id,
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: card.marketplace_listing || false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      },
      verification_status: card.verification_status as any || 'pending',
      print_metadata: typeof card.print_metadata === 'object' ? card.print_metadata as Record<string, any> : {},
      creator_id: card.creator_id,
      price: card.price ? Number(card.price) : undefined,
      edition_size: card.edition_number || undefined,
      marketplace_listing: card.marketplace_listing || false,
      crd_catalog_inclusion: true,
      print_available: false
    }));
  };

  return { convertCardsToCardData };
};

