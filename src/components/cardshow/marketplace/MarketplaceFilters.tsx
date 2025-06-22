
import React from 'react';
import { X, ChevronDown } from 'lucide-react';

interface MarketplaceFiltersProps {
  activeFilters: string[];
  onFiltersChange: (filters: string[]) => void;
  sortBy: 'price' | 'rarity' | 'recent' | 'popular';
  onSortChange: (sort: 'price' | 'rarity' | 'recent' | 'popular') => void;
  onClose: () => void;
}

export const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  activeFilters,
  onFiltersChange,
  sortBy,
  onSortChange,
  onClose
}) => {
  const filterCategories = {
    'Price Range': ['Under $10', '$10-$50', '$50-$100', 'Over $100'],
    'Condition': ['Mint', 'Near Mint', 'Good', 'Fair'],
    'Rarity': ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Legendary'],
    'Category': ['Sports', 'Gaming', 'Fantasy', 'Vintage', 'Modern'],
    'Location': ['Local Only', 'Worldwide', 'Same Country']
  };

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'rarity', label: 'Rarity' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const toggleFilter = (filter: string) => {
    onFiltersChange(
      activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters, filter]
    );
  };

  return (
    <div className="bg-[#2d2d2d] border-b border-gray-600 max-h-[60vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <h2 className="text-white text-lg font-semibold">Filters</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sort By */}
      <div className="p-4 border-b border-gray-600">
        <h3 className="text-white text-sm font-medium mb-3">Sort By</h3>
        <div className="grid grid-cols-2 gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value as any)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                sortBy === option.value
                  ? 'bg-[#00C851] text-black'
                  : 'bg-[#3d3d3d] text-gray-300 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Categories */}
      {Object.entries(filterCategories).map(([category, options]) => (
        <div key={category} className="p-4 border-b border-gray-600 last:border-b-0">
          <h3 className="text-white text-sm font-medium mb-3">{category}</h3>
          <div className="grid grid-cols-2 gap-2">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => toggleFilter(option)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  activeFilters.includes(option)
                    ? 'bg-[#00C851] text-black'
                    : 'bg-[#3d3d3d] text-gray-300 hover:text-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Active Filters Summary */}
      {activeFilters.length > 0 && (
        <div className="p-4 bg-[#1a1a1a]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-medium">
              {activeFilters.length} filters active
            </span>
            <button
              onClick={() => onFiltersChange([])}
              className="text-[#00C851] text-sm font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="px-2 py-1 bg-[#00C851] text-black text-xs rounded-md"
              >
                {filter}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
