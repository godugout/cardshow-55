
import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Camera, Bell, Star } from 'lucide-react';
import { MarketplaceSearch } from '@/components/cardshow/marketplace/MarketplaceSearch';
import { MarketplaceFilters } from '@/components/cardshow/marketplace/MarketplaceFilters';
import { MarketplaceGrid } from '@/components/cardshow/marketplace/MarketplaceGrid';
import { TrendingCards } from '@/components/cardshow/marketplace/TrendingCards';
import { QuickActions } from '@/components/cardshow/marketplace/QuickActions';

export const CardshowMarketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rarity' | 'recent' | 'popular'>('recent');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-20">
      {/* Header with Search */}
      <div className="bg-[#1a1a1a] border-b border-gray-700 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search cards, collections, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2d2d2d] border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00C851]"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="bg-[#2d2d2d] border border-gray-600 rounded-lg p-3 text-gray-400 hover:text-white transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-[#2d2d2d] border border-gray-600 rounded-lg p-3 text-gray-400 hover:text-white transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {['All', 'Sports', 'Gaming', 'Fantasy', 'Rare', 'Under $10'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                if (filter === 'All') {
                  setActiveFilters([]);
                } else {
                  setActiveFilters(prev => 
                    prev.includes(filter) 
                      ? prev.filter(f => f !== filter)
                      : [...prev, filter]
                  );
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'All' && activeFilters.length === 0 || activeFilters.includes(filter)
                  ? 'bg-[#00C851] text-black'
                  : 'bg-[#2d2d2d] text-gray-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Search Component */}
      <MarketplaceSearch 
        query={searchQuery}
        onQueryChange={setSearchQuery}
        isVisible={!!searchQuery}
      />

      {/* Filters Panel */}
      {showFilters && (
        <MarketplaceFilters
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* Trending Section */}
      <TrendingCards />

      {/* Main Marketplace Grid */}
      <MarketplaceGrid 
        searchQuery={searchQuery}
        filters={activeFilters}
        sortBy={sortBy}
      />
    </div>
  );
};
