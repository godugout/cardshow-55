
import { supabase } from '@/integrations/supabase/client';
import type { Comment } from '@/types/social';

export const getComments = async (
  targetId: string,
  targetType: 'card' | 'collection' | 'memory'
): Promise<Comment[]> => {
  try {
    let query = supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply the correct filter based on target type
    if (targetType === 'card') {
      query = query.eq('card_id', targetId);
    } else if (targetType === 'collection') {
      query = query.eq('collection_id', targetId);
    } else if (targetType === 'memory') {
      query = query.eq('memory_id', targetId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(comment => ({
      id: comment.id,
      userId: comment.author_id,
      cardId: comment.card_id,
      collectionId: comment.collection_id,
      parentId: comment.parent_id,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      user: {
        id: comment.author_id,
        username: 'User', // Default fallback
        profileImage: undefined
      },
      reactions: [],
      replyCount: 0
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const createComment = async (
  content: string,
  targetId: string,
  targetType: 'card' | 'collection' | 'memory',
  parentId?: string
): Promise<Comment | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const insertData: any = {
      author_id: user.id,
      content,
      parent_id: parentId
    };

    // Set the appropriate target field
    if (targetType === 'card') {
      insertData.card_id = targetId;
    } else if (targetType === 'collection') {
      insertData.collection_id = targetId;
    } else if (targetType === 'memory') {
      insertData.memory_id = targetId;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.author_id,
      cardId: data.card_id,
      collectionId: data.collection_id,
      parentId: data.parent_id,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      user: {
        id: data.author_id,
        username: 'User', // Default fallback
        profileImage: undefined
      },
      reactions: [],
      replyCount: 0
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
};

export const updateComment = async (
  commentId: string,
  content: string
): Promise<Comment | null> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .update({ content, is_edited: true })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.author_id,
      cardId: data.card_id,
      collectionId: data.collection_id,
      parentId: data.parent_id,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      user: {
        id: data.author_id,
        username: 'User', // Default fallback
        profileImage: undefined
      },
      reactions: [],
      replyCount: 0
    };
  } catch (error) {
    console.error('Error updating comment:', error);
    return null;
  }
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
};

export const getCommentReplies = async (parentId: string): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(comment => ({
      id: comment.id,
      userId: comment.author_id,
      cardId: comment.card_id,
      collectionId: comment.collection_id,
      parentId: comment.parent_id,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      user: {
        id: comment.author_id,
        username: 'User', // Default fallback
        profileImage: undefined
      },
      reactions: [],
      replyCount: 0
    }));
  } catch (error) {
    console.error('Error fetching comment replies:', error);
    return [];
  }
};

// Helper function for CommentSection component
export const addComment = async (params: {
  userId: string;
  content: string;
  cardId?: string;
  collectionId?: string;
  parentId?: string;
}): Promise<Comment> => {
  const targetType = params.cardId ? 'card' : params.collectionId ? 'collection' : 'memory';
  const targetId = params.cardId || params.collectionId || '';
  
  const comment = await createComment(params.content, targetId, targetType, params.parentId);
  if (!comment) {
    throw new Error('Failed to create comment');
  }
  return comment;
};
