
import React, { useState } from 'react';
import { GalleryHeader } from './Gallery/components/GalleryHeader';
import { CardGrid } from '@/components/cards/CardGrid';
import { useCards } from '@/hooks/useCards';
import { LoadingState } from '@/components/common/LoadingState';
import { useCardConversion } from './Gallery/hooks/useCardConversion';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const { cards, featuredCards, loading, dataSource } = useCards();
  const { convertCardsToCardData } = useCardConversion();

  console.log('🎨 Gallery: Rendering with cards:', cards.length, 'featured:', featuredCards.length, 'source:', dataSource);

  if (loading) {
    return <LoadingState message="Loading gallery..." fullPage />;
  }

  const getDisplayCards = () => {
    // Convert database cards to CardData format for display
    const allCardsConverted = convertCardsToCardData(cards);
    const featuredCardsConverted = convertCardsToCardData(featuredCards);
    
    switch (activeTab) {
      case 'featured':
        return featuredCardsConverted.length > 0 ? featuredCardsConverted : allCardsConverted.slice(0, 8);
      case 'trending':
        // Filter cards with view_count > 10, with fallback for undefined view_count
        return allCardsConverted.filter(card => (card.view_count || 0) > 10).slice(0, 20);
      case 'new':
        // Sort by created_at with fallback for undefined created_at
        return allCardsConverted.sort((a, b) => {
          const aDate = new Date(a.created_at || 0).getTime();
          const bDate = new Date(b.created_at || 0).getTime();
          return bDate - aDate;
        }).slice(0, 20);
      default:
        return allCardsConverted;
    }
  };

  const displayCards = getDisplayCards();
  console.log('🎨 Gallery: Displaying', displayCards.length, 'cards for tab:', activeTab);

  // Convert CardData to the format expected by CardGrid
  const gridCards = displayCards.map(card => ({
    id: card.id,
    title: card.title,
    description: card.description,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    price: card.price?.toString() || undefined
  }));

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
          cards={gridCards}
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
