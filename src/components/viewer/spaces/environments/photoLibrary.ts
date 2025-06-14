
import { LOCAL_360_IMAGES, getLocal360ImageById, getLocal360ImagesByCategory, getDefaultLocal360Image, type Local360Image } from './LocalImageLibrary';

// Re-export the Local360Image type as PanoramicPhoto for backward compatibility
export type PanoramicPhoto = Local360Image;

// Use the reliable local image library
export const PANORAMIC_PHOTO_LIBRARY: PanoramicPhoto[] = LOCAL_360_IMAGES;

// Fallback photos are now the same as the main library (all reliable)
export const FALLBACK_PHOTOS: PanoramicPhoto[] = [
  LOCAL_360_IMAGES[5], // Modern studio
  LOCAL_360_IMAGES[0], // Forest clearing
];

// Updated functions using the reliable local system
export const getPhotosByCategory = (category: PanoramicPhoto['category']) => {
  return getLocal360ImagesByCategory(category);
};

export const getPhotoById = (id: string): PanoramicPhoto | null => {
  console.log('🔍 Looking for photo ID:', id);
  const photo = getLocal360ImageById(id);
  console.log('📸 Photo lookup result:', photo ? photo.name : 'NOT FOUND');
  return photo;
};

// Enhanced fallback system using reliable images
export const getFallbackPhoto = (): PanoramicPhoto => {
  console.log('⚠️ Using fallback photo');
  return FALLBACK_PHOTOS[0]; // Modern studio
};

export const getBackupFallbackPhoto = (): PanoramicPhoto => {
  console.log('🚨 Using backup fallback photo');
  return FALLBACK_PHOTOS[1]; // Forest clearing
};

// Additional helper to get default image
export const getDefaultPhoto = (): PanoramicPhoto => {
  return getDefaultLocal360Image();
};
