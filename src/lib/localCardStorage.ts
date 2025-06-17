
import type { CardData } from '@/hooks/useCardEditor';

const STORAGE_KEY = 'crd-cards';

export const localCardStorage = {
  getAllCards(): CardData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const cards = JSON.parse(stored);
      console.log(`💾 Found ${cards.length} cards in local storage`);
      return Array.isArray(cards) ? cards : [];
    } catch (error) {
      console.error('Error reading cards from local storage:', error);
      return [];
    }
  },

  getCard(cardId: string): CardData | null {
    try {
      const cards = this.getAllCards();
      return cards.find(c => c.id === cardId) || null;
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
      console.log(`💾 Saved card "${cardWithId.title}" to local storage`);
      return cardId;
    } catch (error) {
      console.error('Error saving card to local storage:', error);
      return card.id || '';
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
      console.log('💾 Cleared all cards from local storage');
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  },

  // Check if there are cards that haven't been synced to database
  getUnsyncedCards(): CardData[] {
    const localCards = this.getAllCards();
    // Return cards that are marked as needing sync or don't have the flag
    return localCards.filter(card => card.needsSync !== false);
  }
};
