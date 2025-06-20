
import type { Tables } from '@/integrations/supabase/types';
import type { CardData } from '@/hooks/useCardEditor';

// Use the database type directly
type DbCard = Tables<'cards'>;

export const useCardConversion = () => {
  const convertCardsToCardData = (dbCards: DbCard[]): CardData[] => {
    console.log('🔄 Converting database cards to CardData:', dbCards.length, 'cards');
    
    return dbCards.map(card => {
      console.log('🃏 Converting card:', card.title, 'ID:', card.id);
      
      const convertedCard: CardData = {
        id: card.id,
        title: card.title,
        description: card.description || undefined,
        rarity: (card.rarity as any) || 'common',
        tags: Array.isArray(card.tags) ? card.tags : [],
        image_url: card.image_url || card.thumbnail_url || '',
        thumbnail_url: card.thumbnail_url || undefined,
        design_metadata: (typeof card.design_metadata === 'object' && card.design_metadata) ? 
          card.design_metadata as Record<string, any> : {},
        visibility: card.is_public ? 'public' : 'private',
        template_id: card.template_id || undefined,
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
        verification_status: (card.verification_status as any) || 'pending',
        print_metadata: (typeof card.print_metadata === 'object' && card.print_metadata) ? 
          card.print_metadata as Record<string, any> : {},
        creator_id: card.creator_id,
        // Add missing fields from database
        abilities: card.abilities,
        base_price: card.base_price,
        card_type: card.card_type as any,
        current_market_value: card.current_market_value,
        favorite_count: card.favorite_count,
        view_count: card.view_count,
        royalty_percentage: card.royalty_percentage,
        serial_number: card.serial_number,
        set_id: card.set_id,
        mana_cost: card.mana_cost,
        toughness: card.toughness,
        power: card.power,
        edition_size: card.edition_size,
        series: card.series,
        edition_number: card.edition_number,
        total_supply: card.total_supply,
      };
      
      console.log('✅ Converted card:', convertedCard.title, 'with image:', convertedCard.image_url);
      return convertedCard;
    });
  };

  return { convertCardsToCardData };
};
