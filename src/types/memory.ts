
import type { User } from './user';
import type { Team } from './team';
import type { MediaItem } from './media';
import type { Reaction, ReactionCount } from './social';
import type { Visibility } from './common';

export interface Memory {
  id: string;
  userId: string;
  title: string;
  description?: string;
  teamId?: string;
  visibility: Visibility;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  
  // Related data
  user?: User;
  team?: Team;
  mediaItems?: MediaItem[];
  reactions?: Reaction[];
  commentCount?: number;
}

export interface MemoryFormData {
  userId: string;
  title: string;
  description?: string;
  teamId?: string;
  gameId?: string;
  visibility: Visibility;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface MemoryFilters {
  teamId?: string;
  tags?: string[];
  visibility?: Visibility;
  dateRange?: {
    start: string;
    end: string;
  };
}
