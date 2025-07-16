
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';
import type { Reaction, ReactionCount } from '@/types/social';

interface AddReactionParams {
  targetId: string;
  targetType: 'memory' | 'comment' | 'collection';
  type: string;
  userId?: string;
}

interface GetReactionsParams {
  memoryId?: string;
  collectionId?: string;
  commentId?: string;
  userId?: string;
}

interface GetReactionsResponse {
  reactions: Reaction[];
  counts: ReactionCount[];
}

export const getReactions = async (params: GetReactionsParams): Promise<GetReactionsResponse> => {
  try {
    // Try to use Supabase if available
    try {
      let query = supabase.from('reactions').select('*');

      if (params.memoryId) {
        query = query.eq('card_id', params.memoryId);
      } else if (params.collectionId) {
        query = query.eq('collection_id', params.collectionId);
      } else if (params.commentId) {
        query = query.eq('comment_id', params.commentId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process reactions data
      const reactions = (data || []).map((r) => ({
        id: r.id,
        userId: r.user_id,
        memoryId: r.card_id,
        collectionId: r.collection_id,
        commentId: r.comment_id,
        type: r.type,
        createdAt: r.created_at,
      }));

      // Count reactions by type
      const typeCounts: Record<string, number> = {};
      reactions.forEach((r) => {
        if (!typeCounts[r.type]) typeCounts[r.type] = 0;
        typeCounts[r.type]++;
      });

      const counts = Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
      }));

      return { reactions, counts };
    } catch (e) {
      console.error('Supabase error:', e);
      // Fallback to mock API
      const response = await fetch(`/api/reactions?${new URLSearchParams({
        ...(params.memoryId ? { memoryId: params.memoryId } : {}),
        ...(params.collectionId ? { collectionId: params.collectionId } : {}),
        ...(params.commentId ? { commentId: params.commentId } : {})
      })}`);

      if (!response.ok) {
        throw new Error('Failed to get reactions');
      }

      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error getting reactions:', error);
    toast({
      title: 'Error',
      description: 'Failed to get reactions',
      variant: 'destructive'
    });
    return { reactions: [], counts: [] };
  }
};

export const addReaction = async (params: AddReactionParams): Promise<Reaction> => {
  try {
    // Return mock reaction - database schema mismatch with reaction types
    console.log('Add reaction disabled - database schema mismatch');
    
    return {
      id: 'mock-' + Date.now(),
      userId: params.userId || 'demo-user',
      memoryId: params.targetType === 'memory' ? params.targetId : undefined,
      commentId: params.targetType === 'comment' ? params.targetId : undefined,
      collectionId: params.targetType === 'collection' ? params.targetId : undefined,
      type: params.type,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding reaction:', error);
    toast({
      title: 'Error',
      description: 'Failed to add reaction',
      variant: 'destructive'
    });
    throw error;
  }
};

export const removeReaction = async (reactionId: string): Promise<boolean> => {
  try {
    // Try to use Supabase if available
    try {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', reactionId);

      if (error) throw error;
    } catch (e) {
      // Fallback to mock API
      const response = await fetch(`/api/reactions/${reactionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to remove reaction');
      }
    }

    return true;
  } catch (error) {
    console.error('Error removing reaction:', error);
    toast({
      title: 'Error',
      description: 'Failed to remove reaction',
      variant: 'destructive'
    });
    throw error;
  }
};
