
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState } from '@/components/common/LoadingState';
import { useCards } from '@/hooks/useCards';
import { useCollections } from '@/hooks/useCollections';
import { useCreators } from '@/hooks/useCreators';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Plus, Grid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CardsGrid } from './Gallery/components/CardsGrid';
import { CollectionsGrid } from './Gallery/components/CollectionsGrid';
import { CreatorsGrid } from './Gallery/components/CreatorsGrid';
import { GalleryHeader } from './Gallery/components/GalleryHeader';

const Gallery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTab, setSelectedTab] = useState('cards');
  
  const { cards, loading: cardsLoading } = useCards();
  const { collections, isLoading: collectionsLoading } = useCollections();
  const { popularCreators: creators, loading: creatorsLoading } = useCreators();

  console.log('Gallery: Loaded with navigation via React Router');

  const handleCreateCard = () => {
    console.log('Navigating to create card page');
    navigate('/create');
  };

  const handleViewCard = (card: any) => {
    console.log('Navigating to studio for card:', card.id);
    navigate(`/studio/${card.id}`);
  };

  const filteredCards = cards?.filter(card => 
    card.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredCollections = collections?.filter(collection =>
    collection.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredCreators = creators?.filter(creator =>
    creator.username?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-crd-darkest">
      <ErrorBoundary>
        <GalleryHeader 
          activeTab={selectedTab} 
          onTabChange={setSelectedTab}
        />
        
        {/* Controls Bar */}
        <div className="bg-crd-darker border-b border-crd-mediumGray/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
                  <Input
                    placeholder="Search cards, collections, creators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-crd-mediumGray/20 border-crd-mediumGray/30 text-crd-white"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <CRDButton
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </CRDButton>
                  <CRDButton
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </CRDButton>
                </div>
              </div>
              
              <CRDButton onClick={handleCreateCard} className="bg-crd-green hover:bg-crd-green/90 text-black">
                <Plus className="w-4 h-4 mr-2" />
                Create Card
              </CRDButton>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-crd-darker border border-crd-mediumGray/20">
              <TabsTrigger value="cards" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                Cards
                {filteredCards.length > 0 && (
                  <Badge variant="outline" className="ml-2">{filteredCards.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="collections" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                Collections
                {filteredCollections.length > 0 && (
                  <Badge variant="outline" className="ml-2">{filteredCollections.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="creators" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                Creators
                {filteredCreators.length > 0 && (
                  <Badge variant="outline" className="ml-2">{filteredCreators.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cards" className="mt-6">
              {cardsLoading ? (
                <LoadingState message="Loading cards..." />
              ) : (
                <CardsGrid 
                  cards={filteredCards} 
                  loading={cardsLoading}
                  onCardClick={handleViewCard}
                />
              )}
            </TabsContent>

            <TabsContent value="collections" className="mt-6">
              {collectionsLoading ? (
                <LoadingState message="Loading collections..." />
              ) : (
                <CollectionsGrid 
                  collections={filteredCollections}
                  loading={collectionsLoading}
                />
              )}
            </TabsContent>

            <TabsContent value="creators" className="mt-6">
              {creatorsLoading ? (
                <LoadingState message="Loading creators..." />
              ) : (
                <CreatorsGrid 
                  creators={filteredCreators}
                  loading={creatorsLoading}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Gallery;
