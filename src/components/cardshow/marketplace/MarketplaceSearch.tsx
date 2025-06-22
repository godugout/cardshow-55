
import React, { useState, useEffect } from 'react';
import { Search, Clock, X } from 'lucide-react';

interface MarketplaceSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  isVisible: boolean;
}

export const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({
  query,
  onQueryChange,
  isVisible
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Lightning Dragon',
    'Sports cards under $20',
    'Legendary Pokemon',
    'Vintage baseball'
  ]);

  useEffect(() => {
    if (query.length > 2) {
      // Simulate API call for suggestions
      setTimeout(() => {
        setSuggestions([
          `${query} cards`,
          `${query} collection`,
          `${query} rare`,
          `${query} vintage`
        ]);
      }, 200);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  if (!isVisible) return null;

  return (
    <div className="bg-[#2d2d2d] border-b border-gray-600 p-4">
      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-white text-sm font-medium mb-2">Suggestions</h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onQueryChange(suggestion)}
                className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-[#3d3d3d] transition-colors"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-white">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {query.length === 0 && (
        <div>
          <h3 className="text-white text-sm font-medium mb-2">Recent Searches</h3>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onQueryChange(search)}
                className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-[#3d3d3d] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{search}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecentSearches(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
