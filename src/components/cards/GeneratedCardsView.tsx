
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { CardGrid } from '@/components/cards/CardGrid';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Sparkles } from 'lucide-react';
import type { CardData } from '@/types/card';
import type { Tables } from '@/integrations/supabase/types';

type DatabaseCard = Tables<'cards'>;

export const GeneratedCardsView = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGeneratedCards();
  }, []);

  const fetchGeneratedCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .contains('tags', ['Sports'])
        .order('created_at', { ascending: false })
        .limit(101);

      if (error) throw error;
      
      // Convert database cards to CardData format
      const convertedCards: CardData[] = (data || []).map((dbCard: DatabaseCard) => ({
        id: dbCard.id,
        title: dbCard.title,
        description: dbCard.description || '',
        rarity: (dbCard.rarity as CardData['rarity']) || 'common',
        tags: dbCard.tags || [],
        image_url: dbCard.image_url,
        thumbnail_url: dbCard.thumbnail_url,
        design_metadata: (dbCard.design_metadata as Record<string, any>) || {},
        visibility: (dbCard.visibility as CardData['visibility']) || 'public',
        is_public: dbCard.is_public,
        template_id: dbCard.template_id,
        collection_id: dbCard.collection_id,
        team_id: dbCard.team_id,
        creator_attribution: {
          creator_name: '',
          creator_id: dbCard.creator_id,
          collaboration_type: 'solo' as const
        },
        publishing_options: {
          marketplace_listing: dbCard.marketplace_listing || false,
          crd_catalog_inclusion: dbCard.crd_catalog_inclusion || true,
          print_available: dbCard.print_available || false
        },
        verification_status: dbCard.verification_status as CardData['verification_status'],
        print_metadata: (dbCard.print_metadata as Record<string, any>) || {},
        creator_id: dbCard.creator_id,
        price: dbCard.price || 0,
        created_at: dbCard.created_at
      }));
      
      setCards(convertedCards);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles className="h-12 w-12" />}
        title="No Generated Cards Found"
        description="Use the card generator in the editor to create your first collection of CRDs."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Generated CRD Collection</h2>
        <p className="text-crd-lightGray">
          {cards.length} randomly generated cards with sports themes and player stats
        </p>
      </div>
      
      <CardGrid 
        cards={cards} 
        loading={false}
        viewMode="grid"
      />
    </div>
  );
};
