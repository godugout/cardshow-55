
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, CheckSquare, Square } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  rarity?: string;
  tags?: string[];
  series?: string;
  created_at: string;
  creator_id: string;
}

interface AdvancedCardSearchProps {
  onSelectionChange: (selectedCards: string[]) => void;
  selectedCards: string[];
}

export const AdvancedCardSearch: React.FC<AdvancedCardSearchProps> = ({
  onSelectionChange,
  selectedCards
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
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
      {/* Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label className="text-crd-white">Search Term</Label>
          <Input
            placeholder="Search cards by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
          />
        </div>

        <div>
          <Label className="text-crd-white">Rarity</Label>
          <Select value={filters.rarity} onValueChange={(value) => setFilters(prev => ({ ...prev, rarity: value }))}>
            <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-crd-white">
              <SelectValue placeholder="All rarities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="uncommon">Uncommon</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="ultra_rare">Ultra Rare</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-crd-white">Visibility</Label>
          <Select value={filters.visibility} onValueChange={(value) => setFilters(prev => ({ ...prev, visibility: value }))}>
            <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-crd-white">
              <SelectValue placeholder="All visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-crd-white">Series</Label>
          <Input
            placeholder="Series name..."
            value={filters.series}
            onChange={(e) => setFilters(prev => ({ ...prev, series: e.target.value }))}
            className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
          />
        </div>

        <div>
          <Label className="text-crd-white">Date From</Label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
          />
        </div>

        <div>
          <Label className="text-crd-white">Date To</Label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch} disabled={loading} className="bg-crd-green hover:bg-crd-green/90 text-black">
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Searching...' : 'Search Cards'}
        </Button>
        <Button variant="outline" onClick={selectAll} className="border-crd-lightGray text-crd-white">
          <CheckSquare className="w-4 h-4 mr-2" />
          Select All
        </Button>
        <Button variant="outline" onClick={clearSelection} className="border-crd-lightGray text-crd-white">
          <Square className="w-4 h-4 mr-2" />
          Clear Selection
        </Button>
      </div>

      <Separator className="bg-crd-mediumGray" />

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-crd-lightGray">
            Found {totalCount} cards • {selectedCards.length} selected
          </p>
          {selectedCards.length > 0 && (
            <Badge className="bg-crd-green text-black">
              {selectedCards.length} cards selected
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`cursor-pointer transition-colors ${
                selectedCards.includes(card.id)
                  ? 'bg-crd-green/20 border-crd-green'
                  : 'bg-crd-mediumGray border-crd-lightGray hover:border-crd-green/50'
              }`}
              onClick={() => toggleCardSelection(card.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedCards.includes(card.id)}
                    onChange={() => toggleCardSelection(card.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-crd-white font-medium truncate">{card.title}</h4>
                    {card.description && (
                      <p className="text-crd-lightGray text-sm mt-1 line-clamp-2">
                        {card.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {card.rarity && (
                        <Badge variant="secondary" className="text-xs">
                          {card.rarity}
                        </Badge>
                      )}
                      {card.series && (
                        <Badge variant="outline" className="text-xs">
                          {card.series}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
