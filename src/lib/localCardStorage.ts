
import type { CardData } from '@/hooks/useCardEditor';

const STORAGE_KEY = 'crd-cards';

export const localCardStorage = {
  getAllCards(): CardData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let cards: CardData[] = [];
      
      if (stored) {
        const parsedCards = JSON.parse(stored);
        cards = Array.isArray(parsedCards) ? parsedCards : [];
      }
      
      console.log(`💾 Found ${cards.length} cards in standard local storage`);
      return cards;
    } catch (error) {
      console.error('Error reading cards from local storage:', error);
      return [];
    }
  },

  // New method to get ALL cards from both storage locations
  getAllCardsFromAllLocations(): { standardCards: CardData[], userCards: CardData[], allCards: CardData[] } {
    try {
      // Get cards from standard storage
      const standardCards = this.getAllCards();
      
      // Get cards from user-specific storage (check all possible user keys)
      let userCards: CardData[] = [];
      const userStorageKeys = Object.keys(localStorage).filter(key => key.startsWith('cards_'));
      
      userStorageKeys.forEach(key => {
        try {
          const userStoredCards = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(userStoredCards)) {
            userCards = [...userCards, ...userStoredCards];
            console.log(`💾 Found ${userStoredCards.length} cards in user storage: ${key}`);
          }
        } catch (error) {
          console.error(`Error reading from ${key}:`, error);
        }
      });

      // Combine and deduplicate by ID
      const allCards = [...standardCards, ...userCards];
      const uniqueCards = allCards.filter((card, index, self) => 
        index === self.findIndex(c => c.id === card.id)
      );

      console.log(`💾 Total unique cards across all storage: ${uniqueCards.length} (standard: ${standardCards.length}, user-specific: ${userCards.length})`);

      return {
        standardCards,
        userCards,
        allCards: uniqueCards
      };
    } catch (error) {
      console.error('Error getting all cards from all locations:', error);
      return {
        standardCards: [],
        userCards: [],
        allCards: []
      };
    }
  },

  getCard(cardId: string): CardData | null {
    try {
      const { allCards } = this.getAllCardsFromAllLocations();
      return allCards.find(c => c.id === cardId) || null;
    } catch (error) {
      console.error('Error getting card from local storage:', error);
      return null;
    }
  },

  saveCard(card: CardData): string {
    try {
      const cards = this.getAllCards();
      const cardId = card.id || `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const cardWithId = { ...card, id: cardId };
      
      const existingIndex = cards.findIndex(c => c.id === cardId);
      
      if (existingIndex >= 0) {
        cards[existingIndex] = cardWithId;
      } else {
        cards.push(cardWithId);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
      console.log(`💾 Saved card "${cardWithId.title}" to standard local storage`);
      return cardId;
    } catch (error) {
      console.error('Error saving card to local storage:', error);
      return card.id || '';
    }
  },

  // Consolidate all cards from different storage locations into standard storage
  consolidateAllStorage(): { consolidated: number, cleaned: string[] } {
    try {
      const { standardCards, userCards, allCards } = this.getAllCardsFromAllLocations();
      
      if (userCards.length === 0) {
        console.log('💾 No user-specific cards to consolidate');
        return { consolidated: 0, cleaned: [] };
      }

      // Save all unique cards to standard storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allCards));
      
      // Clean up user-specific storage keys
      const userStorageKeys = Object.keys(localStorage).filter(key => key.startsWith('cards_'));
      const cleanedKeys: string[] = [];
      
      userStorageKeys.forEach(key => {
        localStorage.removeItem(key);
        cleanedKeys.push(key);
        console.log(`🧹 Cleaned up user storage: ${key}`);
      });

      console.log(`💾 Consolidated ${allCards.length} total unique cards (added ${userCards.length} from user storage)`);
      return {
        consolidated: userCards.length,
        cleaned: cleanedKeys
      };
    } catch (error) {
      console.error('Error consolidating storage:', error);
      return { consolidated: 0, cleaned: [] };
    }
  },

  markAsSynced(cardId: string): void {
    try {
      const cards = this.getAllCards();
      const cardIndex = cards.findIndex(c => c.id === cardId);
      
      if (cardIndex >= 0) {
        cards[cardIndex] = { ...cards[cardIndex], needsSync: false };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
        console.log(`💾 Marked card ${cardId} as synced`);
      }
    } catch (error) {
      console.error('Error marking card as synced:', error);
    }
  },

  removeCard(cardId: string): void {
    try {
      const cards = this.getAllCards();
      const filtered = cards.filter(c => c.id !== cardId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      console.log(`💾 Removed card ${cardId} from local storage`);
    } catch (error) {
      console.error('Error removing card from local storage:', error);
    }
  },

  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      
      // Also clean up any user-specific storage
      const userStorageKeys = Object.keys(localStorage).filter(key => key.startsWith('cards_'));
      userStorageKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🧹 Cleaned up user storage: ${key}`);
      });
      
      console.log('💾 Cleared all cards from local storage');
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  },

  // Check if there are cards that haven't been synced to database
  getUnsyncedCards(): CardData[] {
    const { allCards } = this.getAllCardsFromAllLocations();
    // Return cards that are marked as needing sync or don't have the flag
    return allCards.filter(card => card.needsSync !== false);
  }
};
