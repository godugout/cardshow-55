
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import type { SocialActivity, ActivityFeedOptions } from '@/types/social';

export const useSocialFeed = (options: ActivityFeedOptions = {}) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchActivities = async (offset = 0, limit = 20) => {
    try {
      let query = supabase
        .from('social_activities')
        .select(`
          *,
          user:user_profiles!social_activities_user_id_fkey(id, username, avatar_url),
          reactions:reactions!reactions_target_id_fkey(
            id, user_id, reaction_type,
            user:user_profiles!reactions_user_id_fkey(id, username, avatar_url)
          )
        `)
        .order('activity_timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (options.type) {
        query = query.eq('activity_type', options.type);
      }

      if (options.user_id) {
        query = query.eq('user_id', options.user_id);
      }

      if (options.following_only && user) {
        // Get list of users the current user follows
        const { data: following } = await supabase
          .from('user_relationships')
          .select('following_id')
          .eq('follower_id', user.id)
          .eq('relationship_type', 'follow');

        const followingIds = following?.map(f => f.following_id) || [];
        followingIds.push(user.id); // Include own activities

        query = query.in('user_id', followingIds);
      }

      const { data, error } = await query;

      if (error) throw error;

      const activitiesWithUserReactions = data?.map(activity => ({
        ...activity,
        user_reaction: activity.reactions?.find((r: any) => r.user_id === user?.id)
      })) || [];

      if (offset === 0) {
        setActivities(activitiesWithUserReactions);
      } else {
        setActivities(prev => [...prev, ...activitiesWithUserReactions]);
      }

      setHasMore(data?.length === limit);
    } catch (err) {
      console.error('Error fetching social feed:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchActivities(activities.length);
    }
  };

  const refreshFeed = () => {
    setLoading(true);
    fetchActivities(0);
  };

  // Handle real-time updates
  useRealTimeUpdates({
    table: 'social_activities',
    onInsert: (payload) => {
      // Add new activity to the beginning of the feed
      setActivities(prev => [payload.new as SocialActivity, ...prev]);
    },
    onUpdate: (payload) => {
      // Update existing activity
      setActivities(prev =>
        prev.map(activity =>
          activity.id === payload.new.id ? { ...activity, ...payload.new } : activity
        )
      );
    },
    onDelete: (payload) => {
      // Remove deleted activity
      setActivities(prev =>
        prev.filter(activity => activity.id !== payload.old.id)
      );
    }
  });

  useEffect(() => {
    fetchActivities();
  }, [options.type, options.user_id, options.following_only, user?.id]);

  return {
    activities,
    loading,
    error,
    hasMore,
    loadMore,
    refreshFeed
  };
};
