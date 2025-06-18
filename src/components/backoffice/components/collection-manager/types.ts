
export interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags?: string[];
  series?: string;
  created_at: string;
  creator_id: string;
  visibility?: 'public' | 'private' | 'shared';
}

export interface SearchFilters {
  rarity: '' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  series: string;
  visibility: '' | 'public' | 'private' | 'shared';
  dateFrom: string;
  dateTo: string;
}

export interface AdvancedCardSearchProps {
  onSelectionChange: (selectedCards: string[]) => void;
  selectedCards: string[];
}
