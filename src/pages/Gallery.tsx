
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Grid, List, RefreshCw, Plus } from 'lucide-react';
import { useAllCollections } from '@/hooks/useCollections';
import { useCards } from '@/hooks/useCards';
import { GallerySection } from './Gallery/components/GallerySection';
import { GalleryHeader } from './Gallery/components/GalleryHeader';
import { CollectionsGrid } from './Gallery/components/CollectionsGrid';
import { CardsGrid } from './Gallery/components/CardsGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { useNavigate } from 'react-router-dom';
import type { Card } from '@/types/card';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [catalogView, setCatalogView] = useState<'grid' | 'table'>('grid');
  const navigate = useNavigate();
  
  const { collections, loading: collectionsLoading } = useAllCollections(1, 6);
  const { 
    featuredCards, 
    cards: allCards,
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

  const handleCardClick = (card: Card) => {
    if (card && card.id) {
      console.log(`🎯 Navigating to Studio for card: ${card.title} (${card.id})`);
      navigate(`/studio/${card.id}`);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500', 
      rare: 'bg-blue-500',
      legendary: 'bg-purple-500',
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
                Cards: {allCards?.length || 0}
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

          {/* Featured Cards - Limited to 1 Row */}
          <GallerySection title="Featured Cards">
            {featuredCards && featuredCards.length > 0 ? (
              <CardsGrid 
                cards={featuredCards.slice(0, 4)} // Only show 4 cards (1 row)
                loading={cardsLoading}
                onCardClick={handleCardClick}
              />
            ) : (
              <EmptyState
                title="No Featured Cards"
                description="Featured cards will appear here once available"
                action={{
                  label: dataSource === 'local' ? "Migrate Local Cards" : "Create Card",
                  onClick: dataSource === 'local' ? migrateLocalCardsToDatabase : () => window.location.href = '/create',
                  icon: <Plus className="mr-2 h-4 w-4" />
                }}
              />
            )}
          </GallerySection>

          {/* CRD Catalog Section */}
          <GallerySection title="CRD Catalog">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-crd-lightGray">
                Browse all {allCards?.length || 0} cards in the catalog
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={catalogView === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCatalogView('grid')}
                  className="bg-crd-green hover:bg-crd-green/80"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={catalogView === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCatalogView('table')}
                  className="bg-crd-green hover:bg-crd-green/80"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {allCards && allCards.length > 0 ? (
              <>
                {catalogView === 'grid' ? (
                  <CardsGrid 
                    cards={allCards}
                    loading={cardsLoading}
                    onCardClick={handleCardClick}
                  />
                ) : (
                  <div className="bg-crd-darkGray rounded-lg border border-crd-mediumGray overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-crd-mediumGray hover:bg-crd-mediumGray/20">
                          <TableHead className="text-crd-white">Card</TableHead>
                          <TableHead className="text-crd-white">Title</TableHead>
                          <TableHead className="text-crd-white">Rarity</TableHead>
                          <TableHead className="text-crd-white">Creator</TableHead>
                          <TableHead className="text-crd-white">Created</TableHead>
                          <TableHead className="text-crd-white">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allCards.map((card) => (
                          <TableRow 
                            key={card.id}
                            className="border-crd-mediumGray hover:bg-crd-mediumGray/20 cursor-pointer"
                            onClick={() => handleCardClick(card)}
                          >
                            <TableCell>
                              <div className="w-16 aspect-[2.5/3.5] bg-crd-mediumGray rounded overflow-hidden">
                                <img
                                  src={card.thumbnail_url || card.image_url || ''}
                                  alt={card.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjMkQyRDJEIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTQwIiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+Q2FyZDwvdGV4dD4KPC9zdmc+';
                                  }}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="text-crd-white font-medium">{card.title}</div>
                                {card.description && (
                                  <div className="text-crd-lightGray text-sm truncate max-w-xs">
                                    {card.description}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getRarityColor(card.rarity || 'common')} text-white capitalize`}>
                                {card.rarity || 'common'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-crd-lightGray">
                              {card.creator_id ? card.creator_id.substring(0, 8) + '...' : 'Unknown'}
                            </TableCell>
                            <TableCell className="text-crd-lightGray">
                              {formatDate(card.created_at)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={card.is_public ? 'default' : 'secondary'}>
                                {card.is_public ? 'Public' : 'Private'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No Cards in Catalog"
                description="The catalog is empty. Create some cards to get started!"
                action={{
                  label: "Create Card",
                  onClick: () => window.location.href = '/create',
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
