
import { supabase } from '@/lib/supabase-client';
import { getAppId } from '@/integrations/supabase/client';
import type { MemoryListOptions, PaginatedMemories } from '../types';
import { calculateOffset } from '../core';

export const getPublicMemories = async (
  options: MemoryListOptions = {}
): Promise<PaginatedMemories> => {
  console.log('Public memories fetch disabled - returning mock data');
  
  // Return mock public memories
  return {
    memories: [],
    total: 0
  };
};
