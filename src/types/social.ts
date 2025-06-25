
export interface SocialActivity {
  id: string;
  user_id: string;
  activity_type: string;
  target_id?: string;
  target_type?: string;
  content?: string;
  metadata: Record<string, any>;
  visibility: 'public' | 'friends' | 'private';
  activity_timestamp: string;
  reaction_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  reactions?: SocialReaction[];
  user_reaction?: SocialReaction;
}

export interface SocialReaction {
  id: string;
  user_id: string;
  target_id: string;
  target_type: 'activity' | 'card' | 'collection' | 'comment';
  reaction_type: 'like' | 'love' | 'wow' | 'rare_find' | 'celebrate';
  created_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface UserRelationship {
  id: string;
  follower_id: string;
  following_id: string;
  relationship_type: 'follow' | 'block';
  created_at: string;
}

export interface SocialNotification {
  id: string;
  user_id: string;
  from_user_id?: string;
  notification_type: string;
  title: string;
  message: string;
  target_id?: string;
  target_type?: string;
  metadata: Record<string, any>;
  read_at?: string;
  created_at: string;
  from_user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface Hashtag {
  id: string;
  name: string;
  usage_count: number;
  created_at: string;
}

export interface ActivityFeedOptions {
  type?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
  following_only?: boolean;
}
