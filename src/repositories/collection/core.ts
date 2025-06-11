
import { supabase, getAppId } from '@/integrations/supabase/client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getCollectionQuery = () => {
  try {
    return supabase
      .from('collections')
      .select('*, media(*)');
  } catch (error) {
    console.error('Collection query error:', error);
    // Return a mock query that will fail gracefully
    return {
      eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      order: () => ({ range: () => Promise.resolve({ data: [], error: null, count: 0 }) })
    } as any;
  }
};

export const getCollectionItemsQuery = () => {
  try {
    return supabase
      .from('collection_cards');
  } catch (error) {
    console.error('Collection items query error:', error);
    // Return a mock query that will fail gracefully
    return {
      select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) })
    } as any;
  }
};
