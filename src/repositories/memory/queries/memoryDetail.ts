
import { supabase } from '@/lib/supabase-client';
import type { Memory } from '@/types/memory';

export const getMemoryById = async (id: string): Promise<Memory | null> => {
  console.log('Memory fetch disabled - returning mock data for id:', id);
  
  // Return mock memory data
  return {
    id,
    userId: 'mock-user',
    title: 'Mock Memory',
    description: 'This is a mock memory while the database schema is being fixed',
    teamId: 'mock-team',
    gameId: 'mock-game',
    location: null,
    visibility: 'private',
    createdAt: new Date().toISOString(),
    tags: ['mock'],
    metadata: {},
    media: [],
    reactions: [],
    commentCount: 0
  };
};
