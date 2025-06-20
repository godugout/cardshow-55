import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CardSearchFilters } from './CardSearchFilters';
import { SearchResults } from './SearchResults';
import { Card, SearchFilters, AdvancedCardSearchProps } from './types';
import type { Tables } from '@/integrations/supabase/types';

// Type alias for database card type
type DbCard = Tables<'cards'>;

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

  // Helper function to convert database card to Card interface
  const mapDbCardToCard = (dbCard: DbCard): Card => {
    const safeJsonToRecord = (json: any): Record<string, any> | null => {
      if (!json) return null;
      if (typeof json === 'object' && json !== null) return json as Record<string, any>;
      return null;
    };

    return {
      id: dbCard.id,
      title: dbCard.title,
      description: dbCard.description,
      image_url: dbCard.image_url,
      thumbnail_url: dbCard.thumbnail_url,
      creator_id: dbCard.creator_id,
      rarity: dbCard.rarity as any,
      tags: dbCard.tags || [],
      design_metadata: safeJsonToRecord(dbCard.design_metadata),
      visibility: dbCard.visibility as any || (dbCard.is_public ? 'public' : 'private'),
      is_public: dbCard.is_public || false,
      created_at: dbCard.created_at || new Date().toISOString(),
      updated_at: dbCard.updated_at,
      template_id: dbCard.template_id,
      collection_id: dbCard.collection_id,
      team_id: dbCard.team_id,
      price: dbCard.price,
      edition_size: dbCard.price, // Use price as fallback since edition_size doesn't exist in DB
      marketplace_listing: dbCard.marketplace_listing || false,
      crd_catalog_inclusion: dbCard.crd_catalog_inclusion,
      print_available: dbCard.print_available,
      verification_status: dbCard.verification_status as any,
      print_metadata: safeJsonToRecord(dbCard.print_metadata),
      series: dbCard.series,
      edition_number: dbCard.edition_number,
      total_supply: dbCard.total_supply,
      abilities: dbCard.abilities,
      base_price: dbCard.base_price,
      card_type: dbCard.card_type as any,
      current_market_value: dbCard.current_market_value,
      favorite_count: dbCard.favorite_count,
      view_count: dbCard.view_count,
      royalty_percentage: dbCard.royalty_percentage,
      serial_number: dbCard.serial_number,
      set_id: dbCard.set_id,
      mana_cost: safeJsonToRecord(dbCard.mana_cost),
      toughness: dbCard.toughness,
      power: dbCard.power,
    };
  };

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

      setCards((data || []).map(mapDbCardToCard));
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
