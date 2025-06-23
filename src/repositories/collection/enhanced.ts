
import { supabase } from '@/lib/supabase-client';
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
  const { data, error } = await supabase
    .from('collection_tags')
    .insert({
      collection_id: collectionId,
      tag_name: tagName,
      color,
      created_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create tag: ${error.message}`);
  return data;
};

export const addCardNote = async (
  collectionId: string,
  cardId: string,
  noteContent: string,
  isPrivate: boolean = true
): Promise<CollectionCardNote> => {
  const { data, error } = await supabase
    .from('collection_card_notes')
    .insert({
      collection_id: collectionId,
      card_id: cardId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      note_content: noteContent,
      is_private: isPrivate
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to add note: ${error.message}`);
  return data;
};

export const createSmartCollectionRule = async (
  collectionId: string,
  ruleType: string,
  ruleOperator: string,
  ruleValue: any
): Promise<SmartCollectionRule> => {
  const { data, error } = await supabase
    .from('smart_collection_rules')
    .insert({
      collection_id: collectionId,
      rule_type: ruleType,
      rule_operator: ruleOperator,
      rule_value: ruleValue,
      is_active: true
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create rule: ${error.message}`);
  return data;
};

export const addSocialInteraction = async (
  collectionId: string,
  interactionType: 'like' | 'bookmark' | 'share'
): Promise<CollectionSocialInteraction> => {
  const { data, error } = await supabase
    .from('collection_social_interactions')
    .upsert({
      collection_id: collectionId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      interaction_type: interactionType
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to add interaction: ${error.message}`);
  return data;
};

export const logCollectionActivity = async (
  collectionId: string,
  activityType: string,
  activityData: Record<string, any> = {},
  isPublic: boolean = false,
  targetCardId?: string
) => {
  const { error } = await supabase
    .from('collection_activity_feed')
    .insert({
      collection_id: collectionId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      activity_type: activityType,
      target_card_id: targetCardId,
      activity_data: activityData,
      is_public: isPublic
    });

  if (error) {
    console.error('Failed to log activity:', error);
  }
};

export const getCollectionMembers = async (collectionId: string) => {
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
  return data;
};

export const inviteCollaborator = async (
  collectionId: string,
  userId: string,
  role: string = 'viewer'
) => {
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
};
