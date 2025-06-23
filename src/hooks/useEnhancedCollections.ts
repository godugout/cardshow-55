
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
          collection_statistics (
            total_cards,
            total_value,
            average_value,
            rarity_breakdown,
            completion_percentage,
            last_activity,
            updated_at
          ),
          collection_tags (
            id,
            tag_name,
            color,
            created_by,
            created_at
          ),
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

      const enhancedCollections: EnhancedCollection[] = (data || []).map(collection => ({
        ...collection,
        statistics: collection.collection_statistics?.[0] || null,
        tags: collection.collection_tags || [],
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
          social_features_enabled: collectionData.social_features_enabled || true,
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
        const { data, error } = await supabase
          .from('collection_statistics')
          .select('*')
          .eq('collection_id', collectionId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setStatistics(data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
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
        const { data, error } = await supabase
          .from('collection_activity_feed')
          .select(`
            *,
            user_profiles!inner (
              username,
              avatar_url
            )
          `)
          .eq('collection_id', collectionId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        const enhancedActivities = (data || []).map(activity => ({
          ...activity,
          user_profile: activity.user_profiles
        }));

        setActivities(enhancedActivities);
      } catch (err) {
        console.error('Error fetching activity feed:', err);
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
