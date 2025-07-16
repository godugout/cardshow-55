
import { supabase } from '@/lib/supabase-client';
import type { Memory } from '@/types/memory';
import type { CreateMemoryParams, UpdateMemoryParams } from './types';
import { getMemoryById } from './queries';
import { getAppId } from '@/integrations/supabase/client';

export const createMemory = async (params: CreateMemoryParams): Promise<Memory> => {
  console.log('Memory creation disabled - using mock data');
  
  // Return mock memory data
  return {
    id: 'mock-' + Date.now(),
    userId: params.userId,
    title: params.title,
    description: params.description || '',
    teamId: params.teamId,
    gameId: params.gameId || '',
    location: params.location || null,
    visibility: params.visibility,
    createdAt: new Date().toISOString(),
    tags: params.tags || [],
    metadata: params.metadata || {},
    media: [],
    reactions: [],
    commentCount: 0
  };
};

export const updateMemory = async (params: UpdateMemoryParams): Promise<Memory> => {
  console.log('Memory update disabled - using mock data');
  
  // Return mock updated memory data
  return {
    id: params.id,
    userId: 'mock-user',
    title: params.title || 'Mock Memory',
    description: params.description || '',
    teamId: 'mock-team',
    gameId: 'mock-game',
    location: params.location || null,
    visibility: params.visibility || 'private',
    createdAt: new Date().toISOString(),
    tags: params.tags || [],
    metadata: params.metadata || {},
    media: [],
    reactions: [],
    commentCount: 0
  };
};
