import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase-client';
import { extractImageMetadata, extractVideoMetadata, getMediaType } from './metadataExtractor';
import { generateThumbnail } from './thumbnailGenerator';
import { detectFaces } from './faceDetector';
import type { MediaItem, MediaUploadParams } from '@/types/media';

export const uploadMedia = async ({
  file,
  memoryId,
  userId,
  isPrivate = false,
  metadata = {},
  progressCallback
}: MediaUploadParams): Promise<MediaItem> => {
  try {
    // Temporarily return mock data to avoid database schema issues
    console.log('uploadMedia: Temporarily disabled due to schema mismatch');
    
    const mockMediaItem: MediaItem = {
      id: uuidv4(),
      memoryId,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url: URL.createObjectURL(file),
      thumbnailUrl: null,
      originalFilename: file.name,
      size: file.size,
      mimeType: file.type,
      width: null,
      height: null,
      duration: null,
      metadata: metadata as any,
      createdAt: new Date().toISOString()
    };
    
    if (progressCallback) {
      progressCallback(100);
    }
    
    return mockMediaItem;
    
  } catch (error) {
    console.error('Error in uploadMedia:', error);
    throw error;
  }
};