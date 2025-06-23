

import { supabase } from '@/integrations/supabase/client';
import type { 
  CollectionTag, 
  CollectionCardNote, 
  SmartCollectionRule,
  CollectionSocialInteraction 
} from '@/types/collection';

export const createCollectionTag = async (
  collectionId: string, 
  tagName: string, 
  color: string = '#3B82F6'
): Promise<CollectionTag> => {
  // For now, we'll store tags in the metadata of collections
  // This is a fallback until the proper tables are created
  const tagId = `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const mockTag: CollectionTag = {
    id: tagId,
    collection_id: collectionId,
    tag_name: tagName,
    color,
    created_by: (await supabase.auth.getUser()).data.user?.id || '',
    created_at: new Date().toISOString()
  };

  // In a real implementation, this would insert into collection_tags table
  console.log('Creating tag:', mockTag);
  
  return mockTag;
};

export const addCardNote = async (
  collectionId: string,
  cardId: string,
  noteContent: string,
  isPrivate: boolean = true
): Promise<CollectionCardNote> => {
  const noteId = `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const mockNote: CollectionCardNote = {
    id: noteId,
    collection_id: collectionId,
    card_id: cardId,
    user_id: (await supabase.auth.getUser()).data.user?.id || '',
    note_content: noteContent,
    is_private: isPrivate,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // In a real implementation, this would insert into collection_card_notes table
  console.log('Creating note:', mockNote);
  
  return mockNote;
};

export const createSmartCollectionRule = async (
  collectionId: string,
  ruleType: string,
  ruleOperator: string,
  ruleValue: any
): Promise<SmartCollectionRule> => {
  const ruleId = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const mockRule: SmartCollectionRule = {
    id: ruleId,
    collection_id: collectionId,
    rule_type: ruleType as any,
    rule_operator: ruleOperator as any,
    rule_value: ruleValue,
    is_active: true,
    created_at: new Date().toISOString()
  };

  // In a real implementation, this would insert into smart_collection_rules table
  console.log('Creating rule:', mockRule);
  
  return mockRule;
};

export const addSocialInteraction = async (
  collectionId: string,
  interactionType: 'like' | 'bookmark' | 'share'
): Promise<CollectionSocialInteraction> => {
  const interactionId = `interaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const mockInteraction: CollectionSocialInteraction = {
    id: interactionId,
    collection_id: collectionId,
    user_id: (await supabase.auth.getUser()).data.user?.id || '',
    interaction_type: interactionType,
    created_at: new Date().toISOString()
  };

  // In a real implementation, this would insert into collection_social_interactions table
  console.log('Creating interaction:', mockInteraction);
  
  return mockInteraction;
};

export const logCollectionActivity = async (
  collectionId: string,
  activityType: string,
  activityData: Record<string, any> = {},
  isPublic: boolean = false,
  targetCardId?: string
) => {
  try {
    const { error } = await supabase
      .from('collection_activity_log')
      .insert({
        collection_id: collectionId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action: activityType,
        target_id: targetCardId,
        metadata: activityData
      });

    if (error) {
      console.error('Failed to log activity:', error);
    }
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

export const getCollectionMembers = async (collectionId: string) => {
  try {
    const { data, error } = await supabase
      .from('collection_memberships')
      .select(`
        *,
        user_profiles!inner (
          username,
          avatar_url,
          full_name
        )
      `)
      .eq('collection_id', collectionId)
      .order('joined_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch members: ${error.message}`);
    return data || [];
  } catch (err) {
    console.error('Error fetching members:', err);
    return [];
  }
};

export const inviteCollaborator = async (
  collectionId: string,
  userId: string,
  role: string = 'viewer'
) => {
  try {
    const { data, error } = await supabase
      .from('collection_memberships')
      .insert({
        collection_id: collectionId,
        user_id: userId,
        role,
        invited_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to invite collaborator: ${error.message}`);
    
    // Log the activity
    await logCollectionActivity(
      collectionId,
      'collaboration_invite',
      { invited_user_id: userId, role },
      true
    );

    return data;
  } catch (err) {
    console.error('Error inviting collaborator:', err);
    throw err;
  }
};
