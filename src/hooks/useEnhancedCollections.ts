
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  EnhancedCollection, 
  CollectionStatistics, 
  CollectionActivityFeedItem,
  CollectionFilters 
} from '@/types/collection';
import { toast } from 'sonner';

export const useEnhancedCollections = (userId?: string) => {
  const [collections, setCollections] = useState<EnhancedCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('collections')
        .select(`
          *,
          collection_memberships!inner (
            id,
            user_id,
            role,
            can_view_member_cards,
            invited_by,
            joined_at
          )
        `)
        .order('updated_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match EnhancedCollection interface
      const enhancedCollections: EnhancedCollection[] = (data || []).map(collection => ({
        ...collection,
        collaboration_enabled: collection.collaboration_enabled || false,
        max_collaborators: collection.max_collaborators || 10,
        social_features_enabled: collection.social_features_enabled !== false,
        public_gallery_enabled: collection.public_gallery_enabled || false,
        view_count: collection.view_count || 0,
        like_count: collection.like_count || 0,
        statistics: null, // Will be loaded separately
        tags: [], // Will be loaded separately
        memberships: collection.collection_memberships || []
      }));

      setCollections(enhancedCollections);
      setError(null);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch collections');
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createCollection = useCallback(async (collectionData: Partial<EnhancedCollection>) => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          title: collectionData.title,
          description: collectionData.description,
          user_id: collectionData.user_id,
          visibility: collectionData.visibility || 'private',
          collaboration_enabled: collectionData.collaboration_enabled || false,
          social_features_enabled: collectionData.social_features_enabled !== false,
          public_gallery_enabled: collectionData.public_gallery_enabled || false
        })
        .select()
        .single();

      if (error) throw error;

      await fetchCollections();
      toast.success('Collection created successfully');
      return data;
    } catch (err) {
      console.error('Error creating collection:', err);
      toast.error('Failed to create collection');
      throw err;
    }
  }, [fetchCollections]);

  const updateCollection = useCallback(async (id: string, updates: Partial<EnhancedCollection>) => {
    try {
      const { error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchCollections();
      toast.success('Collection updated successfully');
    } catch (err) {
      console.error('Error updating collection:', err);
      toast.error('Failed to update collection');
      throw err;
    }
  }, [fetchCollections]);

  const deleteCollection = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCollections();
      toast.success('Collection deleted successfully');
    } catch (err) {
      console.error('Error deleting collection:', err);
      toast.error('Failed to delete collection');
      throw err;
    }
  }, [fetchCollections]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return {
    collections,
    loading,
    error,
    refetch: fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection
  };
};

export const useCollectionStatistics = (collectionId: string) => {
  const [statistics, setStatistics] = useState<CollectionStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Since collection_statistics table might not exist, we'll calculate stats manually
        const { data: cardData, error } = await supabase
          .from('collection_cards')
          .select(`
            id,
            cards (
              id,
              rarity,
              current_market_value
            )
          `)
          .eq('collection_id', collectionId);

        if (error) throw error;

        // Calculate statistics from the card data
        const cards = cardData?.map(cc => cc.cards).filter(Boolean) || [];
        const totalCards = cards.length;
        const totalValue = cards.reduce((sum, card: any) => sum + (card?.current_market_value || 0), 0);
        const averageValue = totalCards > 0 ? totalValue / totalCards : 0;
        
        const rarityBreakdown = cards.reduce((acc: Record<string, number>, card: any) => {
          const rarity = card?.rarity || 'common';
          acc[rarity] = (acc[rarity] || 0) + 1;
          return acc;
        }, {});

        const mockStatistics: CollectionStatistics = {
          id: `stats-${collectionId}`,
          collection_id: collectionId,
          total_cards: totalCards,
          total_value: totalValue,
          average_value: averageValue,
          rarity_breakdown: rarityBreakdown,
          completion_percentage: 0, // Would need set data to calculate
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setStatistics(mockStatistics);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setStatistics(null);
      } finally {
        setLoading(false);
      }
    };

    if (collectionId) {
      fetchStatistics();
    }
  }, [collectionId]);

  return { statistics, loading };
};

export const useCollectionActivityFeed = (collectionId: string) => {
  const [activities, setActivities] = useState<CollectionActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Since collection_activity_feed table might not exist, we'll use collection_activity_log
        const { data, error } = await supabase
          .from('collection_activity_log')
          .select('*')
          .eq('collection_id', collectionId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        // Transform the data to match CollectionActivityFeedItem interface
        const transformedActivities: CollectionActivityFeedItem[] = (data || []).map(activity => ({
          id: activity.id,
          collection_id: activity.collection_id,
          user_id: activity.user_id,
          activity_type: activity.action as any,
          target_card_id: activity.target_id,
          activity_data: activity.metadata || {},
          created_at: activity.created_at,
          is_public: false,
          user_profile: {
            username: 'User', // Would need to join with user_profiles
            avatar_url: undefined
          }
        }));

        setActivities(transformedActivities);
      } catch (err) {
        console.error('Error fetching activity feed:', err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    if (collectionId) {
      fetchActivities();
    }
  }, [collectionId]);

  return { activities, loading };
};
