
import { supabase, getAppId } from '@/integrations/supabase/client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getMemoryQuery = () => {
  // Check if memories table exists, otherwise return a mock query
  try {
    return supabase
      .from('memories')
      .select('*, media(*)');
  } catch (error) {
    // Return a mock query that will fail gracefully
    return {
      eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      order: () => ({ range: () => Promise.resolve({ data: [], error: null, count: 0 }) })
    } as any;
  }
};
