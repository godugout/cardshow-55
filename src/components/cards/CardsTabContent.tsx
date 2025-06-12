
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrendingUp, Star, Users } from 'lucide-react';
import { CardGrid } from './CardGrid';
import type { Tables } from '@/integrations/supabase/types';

type ViewMode = 'feed' | 'grid' | 'masonry';
type DbCard = Tables<'cards'>;

interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  price?: string;
  rarity?: string;
  tags?: string[];
  visibility?: string;
  is_public?: boolean;
  created_at: string;
  series?: string;
}

interface CardsTabContentProps {
  activeTab: string;
  filteredCards: CardData[];
  cardsLoading: boolean;
  viewMode: ViewMode;
  user: any;
  onClearFilters: () => void;
}

// Helper function to convert CardData to DbCard format
const convertToDbCard = (card: CardData): DbCard => {
  return {
    id: card.id,
    title: card.title,
    description: card.description || '',
    image_url: card.image_url || '',
    thumbnail_url: card.thumbnail_url || null,
    price: card.price ? parseFloat(card.price) : null,
    rarity: (card.rarity as any) || 'common',
    tags: card.tags || [],
    visibility: (card.visibility as any) || 'public',
    is_public: card.is_public ?? true,
    created_at: card.created_at,
    updated_at: card.created_at,
    series: card.series || null,
    creator_id: '',
    design_metadata: {},
    print_metadata: {},
    edition_number: null,
    marketplace_listing: false,
    template_id: null,
    total_supply: null,
    verification_status: 'pending'
  } as DbCard;
};

export const CardsTabContent: React.FC<CardsTabContentProps> = ({
  activeTab,
  filteredCards,
  cardsLoading,
  viewMode,
  user,
  onClearFilters
}) => {
  // Convert CardData to DbCard format for CardGrid
  const dbCards = filteredCards.map(convertToDbCard);

  return (
    <>
      <TabsContent value="forYou">
        <CardGrid 
          cards={dbCards} 
          loading={cardsLoading} 
          viewMode={viewMode}
        />
        {!cardsLoading && filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-crd-lightGray mb-4">No cards found matching your criteria</p>
            <Button variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="trending">
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
          <p className="text-crd-lightGray">Trending content coming soon</p>
        </div>
      </TabsContent>

      <TabsContent value="featured">
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
          <p className="text-crd-lightGray">Featured content coming soon</p>
        </div>
      </TabsContent>

      {user && (
        <TabsContent value="following">
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
            <p className="text-crd-lightGray">Follow creators to see their cards here</p>
          </div>
        </TabsContent>
      )}
    </>
  );
};
