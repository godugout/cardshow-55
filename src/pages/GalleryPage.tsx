
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { CardsTabsNavigation } from '@/components/cards/CardsTabsNavigation';
import { CardsControlsBar } from '@/components/cards/CardsControlsBar';
import { CardsTabsContent } from '@/components/cards/CardsTabsContent';

type ViewMode = 'feed' | 'grid' | 'masonry';
type SortOption = 'recent' | 'popular' | 'price-high' | 'price-low' | 'trending';

export const GalleryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="discover" className="w-full">
          <CardsTabsNavigation />
          
          <div className="mt-6">
            <CardsControlsBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showFilters={showFilters}
              onFilterToggle={() => setShowFilters(!showFilters)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            
            <CardsTabsContent />
          </div>
        </Tabs>
      </div>
    </div>
  );
};
