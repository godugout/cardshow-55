
export interface EnhancedCollection {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  visibility: 'public' | 'private' | 'shared';
  collaboration_enabled: boolean;
  max_collaborators: number;
  social_features_enabled: boolean;
  public_gallery_enabled: boolean;
  view_count: number;
  like_count: number;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
  statistics?: CollectionStatistics | null;
  tags?: CollectionTag[];
  memberships?: CollectionMembership[];
}

export interface CollectionStatistics {
  id: string;
  collection_id: string;
  total_cards: number;
  total_value: number;
  average_value: number;
  rarity_breakdown: Record<string, number>;
  completion_percentage: number;
  last_activity: string;
  updated_at: string;
}

export interface CollectionTag {
  id: string;
  collection_id: string;
  tag_name: string;
  color: string;
  created_by: string;
  created_at: string;
}

export interface CollectionCardNote {
  id: string;
  collection_id: string;
  card_id: string;
  user_id: string;
  note_content: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollectionActivityFeedItem {
  id: string;
  collection_id: string;
  user_id: string;
  activity_type: 'card_added' | 'card_removed' | 'card_moved' | 'collection_shared' | 
                 'collection_renamed' | 'tag_added' | 'note_added' | 'collaboration_invite';
  target_card_id?: string;
  activity_data: Record<string, any>;
  created_at: string;
  is_public: boolean;
  user_profile?: {
    username: string;
    avatar_url?: string;
  };
}

export interface SmartCollectionRule {
  id: string;
  collection_id: string;
  rule_type: 'rarity' | 'card_type' | 'creator' | 'date_range' | 'value_range' | 'tag';
  rule_operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 
                 'between' | 'in' | 'not_in';
  rule_value: any;
  is_active: boolean;
  created_at: string;
}

export interface CollectionSocialInteraction {
  id: string;
  collection_id: string;
  user_id: string;
  interaction_type: 'like' | 'bookmark' | 'share';
  created_at: string;
}

export interface CollectionMembership {
  id: string;
  collection_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'contributor' | 'viewer';
  can_view_member_cards: boolean;
  invited_by?: string;
  joined_at: string;
}

export interface CollaborationSettings {
  enabled: boolean;
  maxCollaborators: number;
  defaultRole: 'editor' | 'contributor' | 'viewer';
  requireApproval: boolean;
  allowPublicJoining: boolean;
}

export interface CollectionFilters {
  search?: string;
  tags?: string[];
  rarity?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  valueRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'date_added' | 'card_name' | 'rarity' | 'value' | 'custom';
  sortOrder?: 'asc' | 'desc';
}
