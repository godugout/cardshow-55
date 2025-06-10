
import type { SpaceEnvironment } from '../../../../spaces/types';
import { PANORAMIC_PHOTO_LIBRARY } from '../../../../spaces/environments/photoLibrary';

// Helper function to create panoramic environments from photo library
const createPanoramicEnvironments = (): SpaceEnvironment[] => {
  return PANORAMIC_PHOTO_LIBRARY.map(photo => ({
    id: `panoramic-${photo.id}`,
    name: photo.name,
    description: photo.description,
    previewUrl: photo.thumbnail,
    type: 'panoramic' as const,
    category: 'photorealistic' as const,
    emoji: getCategoryEmoji(photo.category),
    config: {
      backgroundColor: '#000000',
      ambientColor: '#ffffff',
      lightIntensity: photo.lighting.intensity,
      panoramicPhotoId: photo.id, // This is the key fix - use the actual photo ID
      exposure: photo.lighting.intensity,
      saturation: 1.0,
      autoRotation: photo.camera.autoRotateSpeed,
    },
  }));
};

const getCategoryEmoji = (category: string): string => {
  const emojiMap: Record<string, string> = {
    natural: '🌲',
    urban: '🏙️',
    interior: '🏛️',
    sports: '🏟️',
    cultural: '🎭',
    fantasy: '✨'
  };
  return emojiMap[category] || '📸';
};

export const SPACE_ENVIRONMENTS: SpaceEnvironment[] = [
  // Basic Spaces
  {
    id: 'void',
    name: 'Void',
    description: 'Minimal black space for focus',
    previewUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
    type: 'void',
    category: 'basic',
    emoji: '🌌',
    config: {
      backgroundColor: '#000000',
      ambientColor: '#1a1a1a',
      lightIntensity: 0.5,
    },
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    description: 'Deep space with stars',
    previewUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
    type: 'cosmic',
    category: 'basic',
    emoji: '✨',
    config: {
      backgroundColor: '#0a0a0a',
      ambientColor: '#2a2a3a',
      lightIntensity: 0.8,
      particleCount: 200,
    },
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'Professional lighting setup',
    previewUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    type: 'studio',
    category: 'basic',
    emoji: '📸',
    config: {
      backgroundColor: '#f5f5f5',
      ambientColor: '#ffffff',
      lightIntensity: 1.2,
    },
  },

  // Add all panoramic environments with proper ID mapping
  ...createPanoramicEnvironments(),

  // Natural Spaces (non-panoramic)
  {
    id: 'forest',
    name: 'Forest Glade',
    description: 'Mystical forest environment',
    previewUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
    type: 'forest',
    category: 'natural',
    emoji: '🌲',
    config: {
      backgroundColor: '#1a4a1a',
      ambientColor: '#90EE90',
      lightIntensity: 0.8,
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Underwater scene with flowing effects',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    type: 'ocean',
    category: 'natural',
    emoji: '🌊',
    config: {
      backgroundColor: '#001a33',
      ambientColor: '#87CEEB',
      lightIntensity: 0.6,
    },
  },

  // Sports Spaces (non-panoramic)
  {
    id: 'basketball-arena',
    name: 'Basketball Arena',
    description: 'Professional basketball court',
    previewUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    type: 'sports',
    category: 'sports',
    emoji: '🏀',
    config: {
      backgroundColor: '#8B4513',
      ambientColor: '#FFA500',
      lightIntensity: 1.0,
      venue: 'basketball',
    },
  },

  // Cultural Spaces (non-panoramic)
  {
    id: 'art-gallery',
    name: 'Art Gallery',
    description: 'Elegant museum setting',
    previewUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    type: 'cultural',
    category: 'cultural',
    emoji: '🏛️',
    config: {
      backgroundColor: '#f8f8f8',
      ambientColor: '#ffffff',
      lightIntensity: 1.0,
      venue: 'gallery',
    },
  },

  // Themed Spaces (non-panoramic)
  {
    id: 'neon-city',
    name: 'Neon City',
    description: 'Cyberpunk cityscape',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
    type: 'neon',
    category: 'themed',
    emoji: '🌃',
    config: {
      backgroundColor: '#0a0a0a',
      ambientColor: '#ff00ff',
      lightIntensity: 0.9,
    },
  }
];

// Debug function to log all panoramic environments
console.log('🗂️ Available panoramic environments:', 
  SPACE_ENVIRONMENTS
    .filter(env => env.type === 'panoramic')
    .map(env => ({ id: env.id, name: env.name, photoId: env.config.panoramicPhotoId }))
);
