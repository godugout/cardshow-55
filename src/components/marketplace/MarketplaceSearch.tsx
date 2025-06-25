
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  MapPin, 
  DollarSign,
  Star,
  Clock,
  TrendingUp,
  X
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import type { MarketplaceFilters, MarketplaceListing } from '@/types/marketplace';

interface MarketplaceSearchProps {
  onFiltersChange: (filters: MarketplaceFilters) => void;
  onSearch: (query: string) => void;
  initialFilters?: MarketplaceFilters;
}

export const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({
  onFiltersChange,
  onSearch,
  initialFilters = {}
}) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '');
  const [filters, setFilters] = useState<MarketplaceFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery) {
      onSearch(debouncedSearchQuery);
      fetchSuggestions(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('cardshow-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const { data } = await supabase.functions.invoke('search-suggestions', {
        body: { query }
      });
      
      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const saveRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('cardshow-recent-searches', JSON.stringify(updated));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    saveRecentSearch(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const updateFilters = (newFilters: Partial<MarketplaceFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const cleared: MarketplaceFilters = { searchQuery };
    setFilters(cleared);
    onFiltersChange(cleared);
  };

  const getActiveFilterCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof MarketplaceFilters];
      return value && (Array.isArray(value) ? value.length > 0 : true) && key !== 'searchQuery';
    }).length;
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Clock },
    { value: 'price_low', label: 'Price: Low to High', icon: DollarSign },
    { value: 'price_high', label: 'Price: High to Low', icon: DollarSign },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'ending_soon', label: 'Ending Soon', icon: Clock },
  ];

  const conditionOptions = ['mint', 'near_mint', 'excellent', 'good', 'fair', 'poor'];
  const listingTypeOptions = ['fixed_price', 'auction', 'best_offer'];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search cards, sets, players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 pr-20"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {getActiveFilterCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </div>
        </form>

        {/* Search Suggestions */}
        {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
            <CardContent className="p-0">
              {suggestions.length > 0 && (
                <div className="p-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2 px-2">Suggestions</p>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-2 py-2 hover:bg-muted rounded text-sm"
                    >
                      <Search className="inline h-3 w-3 mr-2 text-muted-foreground" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              {recentSearches.length > 0 && (
                <>
                  {suggestions.length > 0 && <Separator />}
                  <div className="p-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2 px-2">Recent</p>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full text-left px-2 py-2 hover:bg-muted rounded text-sm"
                      >
                        <Clock className="inline h-3 w-3 mr-2 text-muted-foreground" />
                        {search}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {filters.condition?.map(condition => (
            <Badge key={condition} variant="secondary" className="gap-1">
              {condition}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ 
                  condition: filters.condition?.filter(c => c !== condition) 
                })}
              />
            </Badge>
          ))}
          {filters.listingType?.map(type => (
            <Badge key={type} variant="secondary" className="gap-1">
              {type.replace('_', ' ')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ 
                  listingType: filters.listingType?.filter(t => t !== type) 
                })}
              />
            </Badge>
          ))}
          {(filters.priceMin || filters.priceMax) && (
            <Badge variant="secondary" className="gap-1">
              ${filters.priceMin || 0} - ${filters.priceMax || '∞'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ priceMin: undefined, priceMax: undefined })}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sort By */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <div className="space-y-1">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateFilters({ sortBy: option.value as any })}
                      className={`w-full text-left px-3 py-2 rounded text-sm border ${
                        filters.sortBy === option.value 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <option.icon className="inline h-3 w-3 mr-2" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="text-sm font-medium mb-2 block">Condition</label>
                <div className="space-y-1">
                  {conditionOptions.map(condition => (
                    <label key={condition} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.condition?.includes(condition) || false}
                        onChange={(e) => {
                          const current = filters.condition || [];
                          const updated = e.target.checked
                            ? [...current, condition]
                            : current.filter(c => c !== condition);
                          updateFilters({ condition: updated });
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{condition.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Listing Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Listing Type</label>
                <div className="space-y-1">
                  {listingTypeOptions.map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.listingType?.includes(type) || false}
                        onChange={(e) => {
                          const current = filters.listingType || [];
                          const updated = e.target.checked
                            ? [...current, type]
                            : current.filter(t => t !== type);
                          updateFilters({ listingType: updated });
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={filters.priceMin || ''}
                    onChange={(e) => updateFilters({ 
                      priceMin: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={filters.priceMax || ''}
                    onChange={(e) => updateFilters({ 
                      priceMax: e.target.value ? Number(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
