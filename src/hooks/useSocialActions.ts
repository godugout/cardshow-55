
import { useState } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SocialReaction } from '@/types/social';

export const useSocialActions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const addReaction = async (
    targetId: string,
    targetType: 'activity' | 'card' | 'collection' | 'comment',
    reactionType: 'like' | 'love' | 'wow' | 'rare_find' | 'celebrate'
  ): Promise<SocialReaction | null> => {
    if (!user) {
      toast.error('Please sign in to react');
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reactions')
        .insert({
          user_id: user.id,
          target_id: targetId,
          target_type: targetType,
          reaction_type: reactionType
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error adding reaction:', err);
      toast.error('Failed to add reaction');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeReaction = async (reactionId: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', reactionId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error removing reaction:', err);
      toast.error('Failed to remove reaction');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to follow users');
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_relationships')
        .insert({
          follower_id: user.id,
          following_id: userId,
          relationship_type: 'follow'
        });

      if (error) throw error;

      // Create notification for the followed user
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          from_user_id: user.id,
          notification_type: 'follow',
          title: 'New Follower',
          message: `${user.username || user.email} started following you`,
          metadata: { follower_id: user.id }
        });

      toast.success('User followed successfully');
      return true;
    } catch (err) {
      console.error('Error following user:', err);
      toast.error('Failed to follow user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_relationships')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;

      toast.success('User unfollowed successfully');
      return true;
    } catch (err) {
      console.error('Error unfollowing user:', err);
      toast.error('Failed to unfollow user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (
    activityType: string,
    content: string,
    targetId?: string,
    targetType?: string,
    metadata: Record<string, any> = {},
    visibility: 'public' | 'friends' | 'private' = 'public'
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to post');
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('social_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          content,
          target_id: targetId,
          target_type: targetType,
          metadata,
          visibility
        });

      if (error) throw error;

      toast.success('Activity posted successfully');
      return true;
    } catch (err) {
      console.error('Error creating activity:', err);
      toast.error('Failed to post activity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const shareActivity = async (activityId: string, message?: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to share');
      return false;
    }

    return await createActivity(
      'share',
      message || 'Shared an activity',
      activityId,
      'activity',
      { shared_activity_id: activityId }
    );
  };

  return {
    addReaction,
    removeReaction,
    followUser,
    unfollowUser,
    createActivity,
    shareActivity,
    loading
  };
};
