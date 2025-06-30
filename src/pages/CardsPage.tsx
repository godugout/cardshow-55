
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Plus, Upload } from 'lucide-react';
import { CardsTabsNavigation } from '@/components/cards/CardsTabsNavigation';
import { CardGrid } from '@/components/cards/CardGrid';
import { useCards } from '@/hooks/useCards';
import { useCardConversion } from '@/pages/Gallery/hooks/useCardConversion';
import type { FeedType } from '@/hooks/use-feed-types';

const CardsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FeedType>('forYou');
  const { cards, loading } = useCards();
  const { convertCardsToCardData } = useCardConversion();

  console.log('CardsPage: Loaded with React Router navigation');

  const handleCreateCard = () => {
    console.log('Navigating to create card');
    navigate('/create');
  };

  const handleBulkUpload = () => {
    console.log('Opening bulk upload');
    navigate('/cards?upload=bulk');
  };

  const handleCardClick = (cardId: string) => {
    console.log('Navigating to card studio:', cardId);
    navigate(`/studio/${cardId}`);
  };

  // Convert database cards to CardData format
  const convertedCards = convertCardsToCardData(cards || []);

  return (
    <div className="min-h-screen bg-crd-darkest">
      <ErrorBoundary>
        {/* Header */}
        <div className="bg-crd-darker border-b border-crd-mediumGray/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-crd-white">Cards</h1>
              <div className="text-sm text-crd-lightGray">
                Discover, create, and manage your trading cards
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CRDButton
                variant="outline"
                onClick={handleBulkUpload}
                className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </CRDButton>
              <CRDButton
                onClick={handleCreateCard}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Card
              </CRDButton>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FeedType)} className="w-full">
            <div className="flex justify-center mb-8">
              <CardsTabsNavigation />
            </div>
            
            <TabsContent value="forYou" className="mt-6">
              <CardGrid 
                cards={convertedCards} 
                loading={loading} 
                viewMode="grid"
                onCardClick={handleCardClick}
              />
            </TabsContent>

            <TabsContent value="trending" className="mt-6">
              <div className="text-center py-12">
                <p className="text-crd-lightGray">Trending cards coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="featured" className="mt-6">
              <div className="text-center py-12">
                <p className="text-crd-lightGray">Featured cards coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="following" className="mt-6">
              <div className="text-center py-12">
                <p className="text-crd-lightGray">Follow creators to see their cards here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default CardsPage;
