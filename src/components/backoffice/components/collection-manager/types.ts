
import type { Card as AppCard } from '@/types/card';

// Use the main Card interface from types/card.ts
export interface Card extends AppCard {}

export interface SearchFilters {
  rarity: '' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  series: string;
  visibility: '' | 'public' | 'private' | 'shared';
  dateFrom: string;
  dateTo: string;
}

export interface AdvancedCardSearchProps {
  onSelectionChange: (selectedCards: string[]) => void;
  selectedCards: string[];
}
