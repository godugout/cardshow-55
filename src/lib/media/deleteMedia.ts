import { supabase } from '../supabase-client';

export const deleteMedia = async (mediaId: string, userId: string): Promise<void> => {
  try {
    // Temporarily disabled to avoid database schema issues
    console.log('deleteMedia: Temporarily disabled due to schema mismatch');
    
  } catch (error) {
    console.error('Error in deleteMedia:', error);
    throw error;
  }
};