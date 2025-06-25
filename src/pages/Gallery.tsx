
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAllCollections } from '@/hooks/useCollections';
import { useCards } from '@/hooks/useCards';
import { GallerySection } from './Gallery/components/GallerySection';
import { GalleryHeader } from './Gallery/components/GalleryHeader';
import { CollectionsGrid } from './Gallery/components/CollectionsGrid';
import { CardsGrid } from './Gallery/components/CardsGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

// Use the database type directly
type DbCard = Tables<'cards'>;

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const navigate = useNavigate();
  
  const { collections, loading: collectionsLoading } = useAllCollections(1, 6);
  const { 
    featuredCards, 
    loading: cardsLoading, 
    dataSource, 
    fetchCards,
    migrateLocalCardsToDatabase 
  } = useCards();

  const handleCreateCollection = () => {
    console.log('Create collection clicked');
  };

  const handleRefreshData = async () => {
    console.log('🔄 Manually refreshing all card data...');
    await fetchCards();
  };

  const handleCardClick = (card: DbCard) => {
    // Navigate directly to Studio for the clicked card
    if (card && card.id) {
      console.log(`🎯 Navigating to Studio for card: ${card.title} (${card.id})`);
      navigate(`/studio/${card.id}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-[#121212]">
      {/* Debug Controls - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-yellow-400">Development Mode - Data Source: {dataSource}</span>
              <span className="text-xs bg-yellow-600 px-2 py-1 rounded">
                Cards: {featuredCards?.length || 0}
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleRefreshData}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <Button size="sm" variant="outline" onClick={migrateLocalCardsToDatabase}>
                Migrate Local
              </Button>
            </div>
          </div>
        </div>
      )}

      <GalleryHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="featured" className="mt-8">
          {/* Collections Section */}
          <GallerySection title="Collections">
            {collections && collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                <CollectionsGrid collections={collections.slice(0, 5) || []} loading={collectionsLoading} />
                <div className="flex items-center justify-center">
                  <EmptyState
                    title="Create Collection"
                    description="Start your own collection of cards"
                    icon={<Plus className="h-12 w-12 text-crd-mediumGray mb-4" />}
                    action={{
                      label: "Create Collection",
                      onClick: handleCreateCollection,
                      icon: <Plus className="mr-2 h-4 w-4" />
                    }}
                  />
                </div>
              </div>
            ) : (
              <EmptyState
                title="No Collections Yet"
                description="Be the first to create a collection and showcase your cards"
                action={{
                  label: "Create Collection",
                  onClick: handleCreateCollection,
                  icon: <Plus className="mr-2 h-4 w-4" />
                }}
              />
            )}
          </GallerySection>

          {/* Featured Cards Section */}
          <GallerySection title="Featured Cards">
            {featuredCards && featuredCards.length > 0 ? (
              <CardsGrid 
                cards={featuredCards} 
                loading={cardsLoading}
                onCardClick={handleCardClick}
              />
            ) : (
              <EmptyState
                title="No Cards Found"
                description={
                  dataSource === 'local' 
                    ? "Cards found in local storage. Consider migrating them to the database."
                    : "No cards available in the database. Create some cards to get started!"
                }
                action={{
                  label: dataSource === 'local' ? "Migrate Local Cards" : "Create Card",
                  onClick: dataSource === 'local' ? migrateLocalCardsToDatabase : () => window.location.href = '/create',
                  icon: <Plus className="mr-2 h-4 w-4" />
                }}
              />
            )}
          </GallerySection>
        </TabsContent>
        
        <TabsContent value="trending">
          <div className="py-16">
            <p className="text-[#777E90] text-center">Trending content coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="new">
          <div className="py-16">
            <p className="text-[#777E90] text-center">New content coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Gallery;
