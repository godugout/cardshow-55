import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Use the actual database type
export type Card = Tables<'cards'>;

export interface CardCreateParams {
  title: string;
  description?: string;
  creator_id: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  tags?: string[];
  design_metadata?: Record<string, any>;
  price?: number;
  is_public?: boolean;
  template_id?: string;
  verification_status?: string;
  print_metadata?: Record<string, any>;
  series?: string;
  visibility?: 'public' | 'private' | 'shared';
  marketplace_listing?: boolean;
  edition_number?: number;
  total_supply?: number;
}

export interface CardUpdateParams {
  id: string;
  title?: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  tags?: string[];
  design_metadata?: Record<string, any>;
  price?: number;
  is_public?: boolean;
  template_id?: string;
  verification_status?: string;
  print_metadata?: Record<string, any>;
  series?: string;
  visibility?: 'public' | 'private' | 'shared';
  marketplace_listing?: boolean;
  edition_number?: number;
  total_supply?: number;
}

export interface CardListOptions {
  page?: number;
  pageSize?: number;
  creator_id?: string;
  tags?: string[];
  rarity?: string;
  search?: string;
  includePrivate?: boolean;
}

export interface PaginatedCards {
  cards: Card[];
  total: number;
}

export const CardRepository = {
  async getCardById(id: string): Promise<Card | null> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching card:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getCardById:', error);
      return null;
    }
  },

  async createCard(params: CardCreateParams): Promise<Card | null> {
    try {
      console.log('🎨 Creating new card:', params.title);
      
      const { data, error } = await supabase
        .from('cards')
        .insert({
          title: params.title,
          description: params.description,
          creator_id: params.creator_id,
          image_url: params.image_url,
          thumbnail_url: params.thumbnail_url,
          rarity: params.rarity || 'common',
          tags: params.tags || [],
          design_metadata: params.design_metadata || {},
          price: params.price,
          is_public: params.is_public || false,
          template_id: params.template_id,
          verification_status: params.verification_status || 'pending',
          print_metadata: params.print_metadata || {},
          series: params.series,
          visibility: params.visibility || 'private',
          marketplace_listing: params.marketplace_listing || false,
          edition_number: params.edition_number,
          total_supply: params.total_supply
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to create card:', error.message);
        return null;
      }

      console.log('✅ Card created successfully:', data.id);
      return data;
    } catch (error) {
      console.error('💥 Error in createCard:', error);
      return null;
    }
  },

  async updateCard(params: CardUpdateParams): Promise<Card | null> {
    try {
      const updates: Partial<Card> = {};
      
      // Only include defined values in the update
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id') {
          (updates as any)[key] = value;
        }
      });

      const { data, error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', params.id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update card:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateCard:', error);
      return null;
    }
  },

  async getCards(options: CardListOptions = {}): Promise<PaginatedCards> {
    try {
      const {
        page = 1,
        pageSize = 20,
        creator_id,
        tags,
        rarity,
        search,
        includePrivate = false
      } = options;

      console.log('🔍 Fetching cards with options:', options);

      let query = supabase
        .from('cards')
        .select('*', { count: 'exact' });
        
      // Apply filters
      if (!includePrivate) {
        query = query.eq('is_public', true);
      }
      
      if (creator_id) {
        query = query.eq('creator_id', creator_id);
      }
      
      if (rarity) {
        // Map rarity values for database compatibility - remove "epic" from mapping
        const rarityMapping: Record<string, string> = {
          'ultra-rare': 'legendary' // Map ultra-rare to legendary
        };
        const dbRarity = rarityMapping[rarity] || rarity;
        
        // Only query if it's a valid database rarity
        const validRarities = ['common', 'uncommon', 'rare', 'legendary'];
        if (validRarities.includes(dbRarity)) {
          query = query.eq('rarity', dbRarity);
        }
      }
      
      if (tags && tags.length > 0) {
        query = query.contains('tags', tags);
      }
      
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      // Pagination
      const offset = (page - 1) * pageSize;
      query = query.range(offset, offset + pageSize - 1).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Failed to fetch cards:', error.message);
        return { cards: [], total: 0 };
      }
      
      console.log(`✅ Fetched ${data?.length || 0} cards (total: ${count || 0})`);
      return {
        cards: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('💥 Error in getCards:', error);
      return { cards: [], total: 0 };
    }
  },

  async getAllCards(): Promise<Card[]> {
    try {
      console.log('🔍 Fetching ALL cards from database...');
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching all cards:', error);
        return [];
      }
      
      console.log(`✅ Found ${data?.length || 0} total cards in database`);
      if (data && data.length > 0) {
        console.log('📋 All card titles:', data.map(c => `${c.title} (${c.id})`).join(', '));
      }
      
      return data || [];
    } catch (error) {
      console.error('💥 Error fetching all cards:', error);
      return [];
    }
  }
};
