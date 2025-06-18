
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CardSearchFilters } from './CardSearchFilters';
import { SearchResults } from './SearchResults';
import { Card, SearchFilters, AdvancedCardSearchProps } from './types';

export const AdvancedCardSearch: React.FC<AdvancedCardSearchProps> = ({
  onSelectionChange,
  selectedCards
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    rarity: '',
    series: '',
    visibility: '',
    dateFrom: '',
    dateTo: ''
  });
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('cards')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50);

      if (searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (filters.rarity) {
        query = query.eq('rarity', filters.rarity);
      }

      if (filters.series) {
        query = query.eq('series', filters.series);
      }

      if (filters.visibility) {
        query = query.eq('visibility', filters.visibility);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setCards(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardSelection = (cardId: string) => {
    const newSelection = selectedCards.includes(cardId)
      ? selectedCards.filter(id => id !== cardId)
      : [...selectedCards, cardId];
    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    const allCardIds = cards.map(card => card.id);
    onSelectionChange(allCardIds);
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="space-y-6">
      <CardSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        loading={loading}
      />

      <SearchResults
        cards={cards}
        selectedCards={selectedCards}
        totalCount={totalCount}
        onToggleCardSelection={toggleCardSelection}
      />
    </div>
  );
};
