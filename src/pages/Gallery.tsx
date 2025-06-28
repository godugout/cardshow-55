
import React, { useState } from 'react';
import { GalleryHeader } from './Gallery/components/GalleryHeader';
import { CardGrid } from '@/components/cards/CardGrid';
import { useCards } from '@/hooks/useCards';
import { LoadingState } from '@/components/common/LoadingState';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const { cards, featuredCards, loading, dataSource } = useCards();

  console.log('🎨 Gallery: Rendering with cards:', cards.length, 'featured:', featuredCards.length, 'source:', dataSource);

  if (loading) {
    return <LoadingState message="Loading gallery..." fullPage />;
  }

  const getDisplayCards = () => {
    switch (activeTab) {
      case 'featured':
        return featuredCards.length > 0 ? featuredCards : cards.slice(0, 8);
      case 'trending':
        return cards.filter(card => card.view_count && card.view_count > 10).slice(0, 20);
      case 'new':
        return cards.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20);
      default:
        return cards;
    }
  };

  const displayCards = getDisplayCards();
  console.log('🎨 Gallery: Displaying', displayCards.length, 'cards for tab:', activeTab);

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GalleryHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Data source indicator in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-black/50 rounded text-xs text-white">
            Source: {dataSource} | Total: {cards.length} | Showing: {displayCards.length}
          </div>
        )}
        
        <CardGrid 
          cards={displayCards}
          loading={false}
          viewMode="grid"
        />
        
        {displayCards.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-4">No Cards Found</h3>
            <p className="text-crd-lightGray mb-6">
              {cards.length === 0 
                ? "No cards have been created yet. Start by creating your first card!"
                : "No cards match the current filter. Try switching tabs or check other categories."
              }
            </p>
            {cards.length === 0 && (
              <a 
                href="/create"
                className="inline-flex items-center px-4 py-2 bg-crd-green text-white rounded-lg hover:bg-crd-green/90 transition-colors"
              >
                Create Your First Card
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
