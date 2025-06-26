
import { CardRepository } from '@/repositories/cardRepository';
import { CardStorageService } from './cardStorage';
import type { Tables } from '@/integrations/supabase/types';

type Card = Tables<'cards'>;

export class CardFetchingService {
  static async fetchAllCardsFromDatabase(): Promise<{
    cards: Card[];
    dataSource: 'database' | 'local' | 'mixed';
  }> {
    try {
      console.log('🔍 Fetching all cards from database...');
      
      const allCards = await CardRepository.getAllCards();
      
      // Check local storage situation
      const storageReport = CardStorageService.getStorageReport();
      console.log(`💾 Local storage report:`, storageReport);
      
      // Determine data source
      let dataSource: 'database' | 'local' | 'mixed' = 'database';
      
      if (allCards.length === 0 && storageReport.totalCards > 0) {
        console.log('⚠️ No database cards found, but local cards exist');
        dataSource = 'local';
      } else if (allCards.length > 0 && storageReport.totalCards > 0) {
        console.log('🔄 Both database and local cards found');
        dataSource = 'mixed';
      }
      
      console.log(`📊 Final result: ${allCards.length} cards from ${dataSource} source`);
      return { cards: allCards, dataSource };
    } catch (error) {
      console.error('💥 Error fetching cards:', error);
      return { cards: [], dataSource: 'database' };
    }
  }

  static async fetchUserCards(userId?: string): Promise<Card[]> {
    if (!userId) return [];
    
    try {
      const result = await CardRepository.getCards({
        creator_id: userId,
        includePrivate: true,
        pageSize: 100
      });
      
      return result.cards;
    } catch (error) {
      console.error('💥 Error fetching user cards:', error);
      return [];
    }
  }
}
