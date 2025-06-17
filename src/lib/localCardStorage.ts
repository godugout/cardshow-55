
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

  saveCard(card: CardData): void {
    try {
      const cards = this.getAllCards();
      const existingIndex = cards.findIndex(c => c.id === card.id);
      
      if (existingIndex >= 0) {
        cards[existingIndex] = card;
      } else {
        cards.push(card);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
      console.log(`💾 Saved card "${card.title}" to local storage`);
    } catch (error) {
      console.error('Error saving card to local storage:', error);
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
    // In a real implementation, you'd check which cards exist in the database
    // For now, we'll return all local cards as potentially unsynced
    return localCards;
  }
};
