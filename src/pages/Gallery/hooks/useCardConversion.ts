
import type { Tables } from '@/integrations/supabase/types';
import type { CardData } from '@/hooks/useCardEditor';

// Use the database type directly
type DbCard = Tables<'cards'>;

export const useCardConversion = () => {
  const convertCardsToCardData = (dbCards: DbCard[]): CardData[] => {
    console.log('🔄 Converting database cards to CardData:', dbCards.length, 'cards');
    
    return dbCards.map(card => {
      console.log('🃏 Converting card:', card.title, 'ID:', card.id);
      
      // Helper function to safely convert Json to Record<string, any>
      const safeJsonToRecord = (json: any): Record<string, any> => {
        if (!json) return {};
        if (typeof json === 'object' && json !== null) return json as Record<string, any>;
        try {
          return typeof json === 'string' ? JSON.parse(json) : {};
        } catch {
          return {};
        }
      };
      
      // Helper function to safely get array values
      const safeArray = (arr: any): string[] => {
        if (Array.isArray(arr)) return arr.map(String);
        if (typeof arr === 'string') {
          try {
            const parsed = JSON.parse(arr);
            return Array.isArray(parsed) ? parsed.map(String) : [];
          } catch {
            return [arr];
          }
        }
        return [];
      };
      
      const convertedCard: CardData = {
        id: card.id,
        title: card.title || 'Untitled Card',
        description: card.description || undefined,
        rarity: (card.rarity as any) || 'common',
        tags: safeArray(card.tags),
        image_url: card.image_url || card.thumbnail_url || '',
        thumbnail_url: card.thumbnail_url || card.image_url || undefined,
        design_metadata: safeJsonToRecord(card.design_metadata),
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
        print_metadata: safeJsonToRecord(card.print_metadata),
        creator_id: card.creator_id,
        // Add missing fields from database with safe defaults
        abilities: safeArray(card.abilities),
        base_price: card.base_price || undefined,
        card_type: (card.card_type as any) || 'character',
        current_market_value: card.current_market_value || undefined,
        favorite_count: card.favorite_count || 0,
        view_count: card.view_count || 0,
        royalty_percentage: card.royalty_percentage || 5,
        serial_number: card.serial_number || undefined,
        set_id: card.set_id || undefined,
        mana_cost: safeJsonToRecord(card.mana_cost),
        toughness: card.toughness || undefined,
        power: card.power || undefined,
        edition_size: card.price || undefined, // Use price as fallback since edition_size doesn't exist in DB
        series: card.series || undefined,
        edition_number: card.edition_number || undefined,
        total_supply: card.total_supply || undefined,
      };
      
      console.log('✅ Converted card:', convertedCard.title, 'with image:', convertedCard.image_url);
      return convertedCard;
    });
  };

  return { convertCardsToCardData };
};
