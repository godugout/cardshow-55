
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GalleryHeader } from './Gallery/components/GalleryHeader';
import { CardGrid } from '@/components/cards/CardGrid';
import { useCards } from '@/hooks/useCards';
import { LoadingState } from '@/components/common/LoadingState';
import { useCardConversion } from './Gallery/hooks/useCardConversion';
import { SubscriptionBanner } from '@/components/monetization/SubscriptionBanner';
import { CRDButton } from '@/components/ui/design-system/Button';
import { NavbarAwareContainer } from '@/components/layout/NavbarAwareContainer';

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
    
    console.log('🎨 Gallery getDisplayCards debug:', {
      activeTab,
      allCardsCount: allCardsConverted.length,
      featuredCardsCount: featuredCardsConverted.length,
      rawCardsCount: cards.length,
      rawFeaturedCount: featuredCards.length
    });

    // Filter out cards with blob URLs or invalid images
    const filterValidCards = (cardList: any[]) => {
      return cardList.filter(card => {
        const hasValidImage = card.image_url && 
          !card.image_url.startsWith('blob:') && 
          !card.image_url.includes('undefined');
        
        if (!hasValidImage) {
          console.log('🎨 Filtering out card with invalid image:', card.title, card.image_url);
        }
        
        return hasValidImage || !card.image_url; // Allow cards without images
      });
    };
    
    switch (activeTab) {
      case 'featured':
        // Show featured cards first, fallback to first 8 all cards
        const validFeatured = filterValidCards(featuredCardsConverted);
        const result = validFeatured.length > 0 ? validFeatured : filterValidCards(allCardsConverted).slice(0, 8);
        console.log('🎨 Featured cards result:', result.length);
        return result;
        
      case 'trending':
        // Show cards with any views first, then recent cards if no views found
        const validAll = filterValidCards(allCardsConverted);
        const cardsWithViews = validAll.filter(card => (card.view_count || 0) > 0);
        const trendingResult = cardsWithViews.length > 0 
          ? cardsWithViews.slice(0, 20)
          : validAll.sort((a, b) => {
              const aDate = new Date(a.created_at || 0).getTime();
              const bDate = new Date(b.created_at || 0).getTime();
              return bDate - aDate;
            }).slice(0, 20);
        console.log('🎨 Trending cards result:', trendingResult.length, 'from', cardsWithViews.length, 'with views');
        return trendingResult;
        
      case 'new':
        // Sort by created_at with fallback for undefined created_at
        const validNew = filterValidCards(allCardsConverted);
        const newResult = validNew.sort((a, b) => {
          const aDate = new Date(a.created_at || 0).getTime();
          const bDate = new Date(b.created_at || 0).getTime();
          return bDate - aDate;
        }).slice(0, 20);
        console.log('🎨 New cards result:', newResult.length);
        return newResult;
        
      default:
        const defaultResult = filterValidCards(allCardsConverted);
        console.log('🎨 Default cards result:', defaultResult.length);
        return defaultResult;
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
    <NavbarAwareContainer className="min-h-screen bg-crd-darkest">
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

        <div className="w-full">
          <CardGrid 
            cards={gridCards}
            loading={false}
            viewMode="grid"
            useProgressiveLoading={false}
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
      </div>
    </NavbarAwareContainer>
  );
};

export default Gallery;
