
import { supabase } from '@/integrations/supabase/client';
import type { Card, CardCreateParams } from '@/types/card';

export { type CardCreateParams } from '@/types/card';

export class CardRepository {
  static async createCard(params: CardCreateParams): Promise<Card | null> {
    try {
      console.log('🎯 CardRepository.createCard called with:', params);
      
      const { data, error } = await supabase
        .from('cards')
        .insert([params])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating card in database:', error);
        throw error;
      }

      console.log('✅ Card created successfully in database:', data);
      return data as Card;
    } catch (error) {
      console.error('💥 Failed to create card:', error);
      throw error;
    }
  }

  static async getCards(options?: {
    creator_id?: string;
    includePrivate?: boolean;
    pageSize?: number;
  }): Promise<{ cards: Card[]; total: number }> {
    try {
      console.log('🔍 CardRepository.getCards called with options:', options);
      
      let query = supabase
        .from('cards')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (options?.creator_id) {
        console.log('👤 Filtering by creator_id:', options.creator_id);
        query = query.eq('creator_id', options.creator_id);
      }

      if (!options?.includePrivate) {
        query = query.eq('is_public', true);
      }

      if (options?.pageSize) {
        query = query.limit(options.pageSize);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Error fetching cards:', error);
        throw error;
      }

      console.log(`✅ Fetched ${data?.length || 0} cards from database`);
      return {
        cards: (data || []) as Card[],
        total: count || 0
      };
    } catch (error) {
      console.error('💥 Failed to fetch cards:', error);
      return { cards: [], total: 0 };
    }
  }

  static async getAllCards(): Promise<Card[]> {
    try {
      console.log('🔍 CardRepository.getAllCards called');
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching all cards:', error);
        throw error;
      }

      console.log(`✅ Fetched ${data?.length || 0} total cards from database`);
      return (data || []) as Card[];
    } catch (error) {
      console.error('💥 Failed to fetch all cards:', error);
      throw error;
    }
  }

  static async getCardById(id: string): Promise<Card | null> {
    try {
      console.log('🔍 CardRepository.getCardById called with id:', id);
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching card by ID:', error);
        return null;
      }

      console.log('✅ Fetched card by ID:', data);
      return (data || null) as Card;
    } catch (error) {
      console.error('💥 Failed to fetch card by ID:', error);
      return null;
    }
  }

  static async updateCard(cardId: string, updates: Partial<CardCreateParams>): Promise<boolean> {
    try {
      console.log('🔄 CardRepository.updateCard called:', { cardId, updates });
      
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId);

      if (error) {
        console.error('❌ Error updating card:', error);
        throw error;
      }

      console.log('✅ Card updated successfully');
      return true;
    } catch (error) {
      console.error('💥 Failed to update card:', error);
      throw error;
    }
  }

  static async getUserCards(userId?: string): Promise<Card[]> {
    try {
      console.log('👤 CardRepository.getUserCards called with userId:', userId);
      
      if (!userId) {
        console.log('⚠️ No userId provided, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user cards:', error);
        throw error;
      }

      console.log(`✅ Fetched ${data?.length || 0} cards for user ${userId}`);
      return (data || []) as Card[];
    } catch (error) {
      console.error('💥 Failed to fetch user cards:', error);
      throw error;
    }
  }

  static async deleteCard(id: string): Promise<boolean> {
    try {
      console.log('🗑️ CardRepository.deleteCard called with id:', id);
      
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting card:', error);
        return false;
      }

      console.log('✅ Card deleted successfully');
      return true;
    } catch (error) {
      console.error('💥 Failed to delete card:', error);
      return false;
    }
  }
}
