import { supabase } from '../supabase-client';
import type { MediaItem } from '@/types/media';

export const getMediaByMemoryId = async (memoryId: string): Promise<MediaItem[]> => {
  try {
    // Temporarily return empty array to avoid database schema issues
    console.log('getMediaByMemoryId: Temporarily disabled due to schema mismatch');
    return [];
    
  } catch (error) {
    console.error('Error in getMediaByMemoryId:', error);
    throw error;
  }
};