
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, CheckSquare, Square } from 'lucide-react';
import { SearchFilters } from './types';

interface CardSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onSearch: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  loading: boolean;
}

export const CardSearchFilters: React.FC<CardSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  onSearch,
  onSelectAll,
  onClearSelection,
  loading
}) => {
  return (
    <>
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
          <Select value={filters.rarity || 'all'} onValueChange={(value: string) => setFilters(prev => ({ ...prev, rarity: value === 'all' ? '' : value as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' }))}>
            <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-crd-white">
              <SelectValue placeholder="All rarities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="uncommon">Uncommon</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-crd-white">Visibility</Label>
          <Select value={filters.visibility || 'all'} onValueChange={(value: string) => setFilters(prev => ({ ...prev, visibility: value === 'all' ? '' : value as 'public' | 'private' | 'shared' }))}>
            <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-crd-white">
              <SelectValue placeholder="All visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All visibility</SelectItem>
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
        <Button onClick={onSearch} disabled={loading} className="bg-crd-green hover:bg-crd-green/90 text-black">
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Searching...' : 'Search Cards'}
        </Button>
        <Button variant="outline" onClick={onSelectAll} className="border-crd-lightGray text-crd-white">
          <CheckSquare className="w-4 h-4 mr-2" />
          Select All
        </Button>
        <Button variant="outline" onClick={onClearSelection} className="border-crd-lightGray text-crd-white">
          <Square className="w-4 h-4 mr-2" />
          Clear Selection
        </Button>
      </div>
    </>
  );
};
