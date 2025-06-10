
import type { SpaceEnvironment } from '../../../../spaces/types';
import { LOCAL_360_IMAGES } from '../../../../spaces/environments/LocalImageLibrary';

// Helper function to create panoramic environments from local image library
const createPanoramicEnvironments = (): SpaceEnvironment[] => {
  return LOCAL_360_IMAGES.map(image => ({
    id: `panoramic-${image.id}`,
    name: image.name,
    description: image.description,
    previewUrl: image.fallbackUrl,
    type: 'panoramic' as const,
    category: 'photorealistic' as const,
    emoji: getCategoryEmoji(image.category),
    config: {
      backgroundColor: '#1a1a2e',
      ambientColor: '#ffffff',
      lightIntensity: image.lighting.intensity,
      panoramicPhotoId: image.id,
      exposure: image.lighting.intensity,
      saturation: 1.0,
      autoRotation: image.camera.autoRotateSpeed,
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
    name: 'Cosmic Void',
    description: 'Deep space environment',
    previewUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
    type: 'void',
    category: 'basic',
    emoji: '🌌',
    config: {
      backgroundColor: '#1a1a2e',
      ambientColor: '#2a2a3a',
      lightIntensity: 0.8,
      panoramicPhotoId: 'cosmic-void',
    },
  },
  {
    id: 'studio',
    name: 'Modern Studio',
    description: 'Professional lighting setup',
    previewUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    type: 'studio',
    category: 'basic',
    emoji: '📸',
    config: {
      backgroundColor: '#f5f5f5',
      ambientColor: '#ffffff',
      lightIntensity: 1.2,
      panoramicPhotoId: 'modern-studio',
    },
  },

  // All panoramic environments with correct mappings
  ...createPanoramicEnvironments(),

  // Additional specific environment mappings with corrected images
  {
    id: 'forest',
    name: 'Forest Clearing',
    description: 'Sunlit forest with ancient trees',
    previewUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    type: 'forest',
    category: 'natural',
    emoji: '🌲',
    config: {
      backgroundColor: '#1a4a1a',
      ambientColor: '#90EE90',
      lightIntensity: 1.2,
      panoramicPhotoId: 'forest-clearing',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Sunset',
    description: 'Golden hour ocean view',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    type: 'ocean',
    category: 'natural',
    emoji: '🌊',
    config: {
      backgroundColor: '#001a33',
      ambientColor: '#87CEEB',
      lightIntensity: 1.3,
      panoramicPhotoId: 'ocean-sunset',
    },
  },
  {
    id: 'desert',
    name: 'Desert Dunes',
    description: 'Endless golden sand dunes',
    previewUrl: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=400',
    type: 'desert',
    category: 'natural',
    emoji: '🏜️',
    config: {
      backgroundColor: '#d4af37',
      ambientColor: '#ffd700',
      lightIntensity: 1.5,
      panoramicPhotoId: 'desert-dunes',
    },
  },
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
      panoramicPhotoId: 'neon-city',
    },
  }
];

// Debug function to log all environments
console.log('🗂️ Available reliable environments:', 
  SPACE_ENVIRONMENTS.map(env => ({ 
    id: env.id, 
    name: env.name, 
    photoId: env.config.panoramicPhotoId 
  }))
);
