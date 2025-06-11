
import { supabase } from "@/integrations/supabase/client";

export const CardRepository = {
  getFeaturedCards: async (limit = 4) => {
    try {
      console.log('Fetching featured cards...');
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) {
        console.error('Error fetching featured cards:', error);
        return [];
      }
      
      console.log('Featured cards fetched successfully:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error fetching featured cards:', error);
      return [];
    }
  },
  
  getTrendingCards: async (limit = 4) => {
    try {
      console.log('Fetching trending cards...');
      // In a real app, we might use metrics like view count or reactions
      // For now, we're just getting the most recent to simulate "trending"
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) {
        console.error('Error fetching trending cards:', error);
        return [];
      }
      
      console.log('Trending cards fetched successfully:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error fetching trending cards:', error);
      return [];
    }
  }
};
