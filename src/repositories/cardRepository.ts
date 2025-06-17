import { supabase } from '@/supabase';
import type { Card, CardCreateParams } from '@/types/card';

export class CardRepository {
  static async createCard(params: CardCreateParams): Promise<Card | null> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([params])
        .select()
        .single();

      if (error) {
        console.error('Error creating card:', error);
        throw error;
      }

      return data as Card;
    } catch (error) {
      console.error('Failed to create card:', error);
      throw error;
    }
  }

  static async getCards(): Promise<Card[]> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cards:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      throw error;
    }
  }

  static async getCardById(id: string): Promise<Card | null> {
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

      return data || null;
    } catch (error) {
      console.error('Failed to fetch card:', error);
      return null;
    }
  }

  static async updateCard(cardId: string, updates: Partial<CardCreateParams>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId);

      if (error) {
        console.error('Error updating card:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to update card:', error);
      throw error;
    }
  }

  static async getUserCards(userId?: string): Promise<Card[]> {
    try {
      const query = supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query.eq('creator_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching user cards:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch user cards:', error);
      throw error;
    }
  }

  static async deleteCard(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting card:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete card:', error);
      return false;
    }
  }
}
