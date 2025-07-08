
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GalleryHeader } from './Gallery/components/GalleryHeader';
import { CardGrid } from '@/components/cards/CardGrid';
import { useCards } from '@/hooks/useCards';
import { LoadingState } from '@/components/common/LoadingState';
import { useCardConversion } from './Gallery/hooks/useCardConversion';
import { SubscriptionBanner } from '@/components/monetization/SubscriptionBanner';
import { ActivityFeed } from '@/components/social/ActivityFeed';
import { CRDButton } from '@/components/ui/design-system/Button';

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
        <SubscriptionBanner />
        
        <GalleryHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Data source indicator in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-crd-mediumGray/10 border border-crd-mediumGray/30 rounded text-xs text-crd-lightGray">
            Source: {dataSource} | Total: {cards.length} | Showing: {displayCards.length}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            <CardGrid 
              cards={gridCards}
              loading={false}
              viewMode="grid"
            />
            
            {displayCards.length === 0 && !loading && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-crd-white mb-4">No Cards Found</h3>
                <p className="text-crd-lightGray mb-6">
                  {cards.length === 0 
                    ? "No cards have been created yet. Start by creating your first card!"
                    : "No cards match the current filter. Try switching tabs or check other categories."
                  }
                </p>
                {cards.length === 0 && (
                  <CRDButton asChild variant="primary">
                    <Link to="/create">
                      Create Your First Card
                    </Link>
                  </CRDButton>
                )}
              </div>
            )}
          </div>

          {/* Social sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
