
export interface PanoramicPhoto {
  id: string;
  name: string;
  category: 'natural' | 'urban' | 'interior' | 'sports' | 'cultural' | 'fantasy';
  url: string;
  thumbnail: string;
  description: string;
  lighting: {
    intensity: number;
    warmth: number;
    contrast: number;
  };
  camera: {
    defaultDistance: number;
    autoRotateSpeed: number;
  };
  credits?: string;
}

export const PANORAMIC_PHOTO_LIBRARY: PanoramicPhoto[] = [
  // Natural Environments
  {
    id: 'forest-clearing',
    name: 'Forest Clearing',
    category: 'natural',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=2048',
    thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
    description: 'Sunlit forest clearing with dappled light',
    lighting: { intensity: 0.8, warmth: 0.7, contrast: 0.6 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 }
  },
  {
    id: 'mountain-vista',
    name: 'Mountain Vista',
    category: 'natural',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    description: 'Panoramic mountain landscape with dramatic sky',
    lighting: { intensity: 1.0, warmth: 0.6, contrast: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.2 }
  },
  {
    id: 'ocean-sunset',
    name: 'Ocean Sunset',
    category: 'natural',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    description: 'Golden hour ocean view with warm lighting',
    lighting: { intensity: 0.9, warmth: 0.9, contrast: 0.7 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 }
  },

  // Urban Environments
  {
    id: 'city-rooftop',
    name: 'City Rooftop',
    category: 'urban',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=2048',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400',
    description: 'Urban skyline from rooftop perspective',
    lighting: { intensity: 0.7, warmth: 0.5, contrast: 0.9 },
    camera: { defaultDistance: 9, autoRotateSpeed: 0.3 }
  },
  {
    id: 'neon-street',
    name: 'Neon Street',
    category: 'urban',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=2048',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
    description: 'Cyberpunk street with neon lights',
    lighting: { intensity: 0.6, warmth: 0.3, contrast: 1.0 },
    camera: { defaultDistance: 7, autoRotateSpeed: 0.5 }
  },

  // Interior Spaces
  {
    id: 'modern-gallery',
    name: 'Modern Gallery',
    category: 'interior',
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2048',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    description: 'Clean, modern art gallery with perfect lighting',
    lighting: { intensity: 1.1, warmth: 0.4, contrast: 0.5 },
    camera: { defaultDistance: 6, autoRotateSpeed: 0.2 }
  },
  {
    id: 'cozy-library',
    name: 'Cozy Library',
    category: 'interior',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=2048',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    description: 'Warm library with wooden shelves and soft lighting',
    lighting: { intensity: 0.8, warmth: 0.8, contrast: 0.6 },
    camera: { defaultDistance: 5, autoRotateSpeed: 0.1 }
  },

  // Sports Venues
  {
    id: 'basketball-court',
    name: 'Basketball Court',
    category: 'sports',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=2048',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    description: 'Professional basketball arena center court',
    lighting: { intensity: 1.0, warmth: 0.5, contrast: 0.8 },
    camera: { defaultDistance: 12, autoRotateSpeed: 0.3 }
  },
  {
    id: 'stadium-field',
    name: 'Stadium Field',
    category: 'sports',
    url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=2048',
    thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
    description: 'Football stadium from field level perspective',
    lighting: { intensity: 0.9, warmth: 0.6, contrast: 0.7 },
    camera: { defaultDistance: 15, autoRotateSpeed: 0.2 }
  },

  // Cultural Spaces
  {
    id: 'concert-hall',
    name: 'Concert Hall',
    category: 'cultural',
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2048',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    description: 'Grand concert hall with ornate architecture',
    lighting: { intensity: 0.7, warmth: 0.7, contrast: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.1 }
  }
];

export const getPhotosByCategory = (category: PanoramicPhoto['category']) => {
  return PANORAMIC_PHOTO_LIBRARY.filter(photo => photo.category === category);
};

export const getPhotoById = (id: string) => {
  return PANORAMIC_PHOTO_LIBRARY.find(photo => photo.id === id);
};
