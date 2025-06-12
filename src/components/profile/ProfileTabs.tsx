
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemoryCard } from '@/components/memory/MemoryCard';
import { CardGrid } from '@/components/cards/CardGrid';
import { Loader, Image } from 'lucide-react';
import type { Memory } from '@/types/memory';
import type { Tables } from '@/integrations/supabase/types';

type DbCard = Tables<'cards'>;

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  memories: Memory[];
  memoriesLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

// Helper function to convert Memory with card properties to DbCard format
const convertMemoryToDbCard = (memory: Memory): DbCard => {
  return {
    id: memory.id,
    title: memory.title,
    description: memory.description || '',
    image_url: '',
    thumbnail_url: null,
    price: null,
    rarity: 'common',
    tags: memory.tags || [],
    visibility: memory.visibility as any,
    is_public: memory.visibility === 'public',
    created_at: memory.createdAt,
    updated_at: memory.createdAt,
    series: null,
    creator_id: memory.userId,
    design_metadata: memory.metadata || {},
    print_metadata: {},
    edition_number: null,
    marketplace_listing: false,
    template_id: null,
    total_supply: null,
    verification_status: 'pending'
  } as DbCard;
};

export const ProfileTabs = ({ 
  activeTab, 
  setActiveTab, 
  memories, 
  memoriesLoading, 
  hasMore, 
  onLoadMore 
}: ProfileTabsProps) => {
  // Separate cards from memories based on the presence of card-specific fields
  const cardMemories = memories.filter(item => 
    'rarity' in item || 'design_metadata' in item || 'creator_id' in item
  );
  const actualMemories = memories.filter(item => 
    !('rarity' in item) && !('design_metadata' in item) && !('creator_id' in item)
  );

  // Convert card-like memories to DbCard format
  const dbCards = cardMemories.map(convertMemoryToDbCard);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="memories">My Cards ({dbCards.length})</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
        <TabsTrigger value="liked">Liked</TabsTrigger>
      </TabsList>
      
      <TabsContent value="memories">
        {memoriesLoading && memories.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-64 animate-pulse bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        ) : dbCards.length === 0 ? (
          <div className="text-center py-16">
            <Image className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No cards yet</h3>
            <p className="text-gray-500 mb-6">Start creating beautiful cards to share with the world</p>
            <Button asChild>
              <Link to="/editor">Create Your First Card</Link>
            </Button>
          </div>
        ) : (
          <>
            <CardGrid 
              cards={dbCards} 
              loading={memoriesLoading} 
              viewMode="grid" 
            />
            
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={onLoadMore} 
                  disabled={memoriesLoading}
                >
                  {memoriesLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </TabsContent>
      
      <TabsContent value="collections">
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No collections yet</h3>
          <p className="text-gray-500 mb-6">Create collections to organize your cards</p>
          <Button asChild>
            <Link to="/collections">Create Collection</Link>
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="liked">
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No liked cards</h3>
          <p className="text-gray-500 mb-6">Cards you like will appear here</p>
          <Button asChild>
            <Link to="/feed">Explore Feed</Link>
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};
