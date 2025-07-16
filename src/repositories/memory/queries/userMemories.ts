
import { supabase } from '@/lib/supabase-client';
import { getAppId } from '@/integrations/supabase/client';
import type { MemoryListOptions, PaginatedMemories } from '../types';
import { calculateOffset } from '../core';

export const getMemoriesByUserId = async (
  userId: string,
  options: MemoryListOptions = {}
): Promise<PaginatedMemories> => {
  console.log('User memories fetch disabled - returning mock data for userId:', userId);
  
  // Return mock user memories
  return {
    memories: [],
    total: 0
  };
};
