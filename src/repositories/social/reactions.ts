
import { supabase } from '@/integrations/supabase/client';
import type { Reaction, ReactionCount } from '@/types/social';

export const getReactions = async (params: {
  memoryId?: string;
  collectionId?: string; 
  commentId?: string;
}): Promise<{ reactions: Reaction[]; counts: ReactionCount[] }> => {
  try {
    let query = supabase.from('reactions').select('*');
    
    if (params.memoryId) {
      query = query.eq('memory_id', params.memoryId);
    } else if (params.collectionId) {
      query = query.eq('collection_id', params.collectionId);
    } else if (params.commentId) {
      query = query.eq('comment_id', params.commentId);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Transform to our Reaction type
    const reactions: Reaction[] = (data || []).map(reaction => ({
      id: reaction.id,
      userId: reaction.user_id,
      memoryId: reaction.memory_id,
      collectionId: reaction.collection_id,
      commentId: reaction.comment_id,
      type: reaction.type,
      createdAt: reaction.created_at
    }));

    // Calculate counts by type
    const typeCounts: Record<string, number> = {};
    reactions.forEach(reaction => {
      typeCounts[reaction.type] = (typeCounts[reaction.type] || 0) + 1;
    });

    const counts: ReactionCount[] = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }));

    return { reactions, counts };
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return { reactions: [], counts: [] };
  }
};

export const addReaction = async (params: {
  userId: string;
  type: string;
  targetId: string;
  targetType: 'memory' | 'collection' | 'comment';
}): Promise<Reaction> => {
  try {
    const insertData: any = {
      user_id: params.userId,
      type: params.type
    };

    // Set the appropriate target field based on type
    if (params.targetType === 'memory') {
      insertData.memory_id = params.targetId;
    } else if (params.targetType === 'collection') {
      insertData.collection_id = params.targetId;
    } else if (params.targetType === 'comment') {
      insertData.comment_id = params.targetId;
    }

    const { data, error } = await supabase
      .from('reactions')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      memoryId: data.memory_id,
      collectionId: data.collection_id,
      commentId: data.comment_id,
      type: data.type,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
};

export const removeReaction = async (reactionId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('id', reactionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing reaction:', error);
    throw error;
  }
};
