export interface Local360Image {
  id: string;
  name: string;
  category: 'natural' | 'urban' | 'interior' | 'sports' | 'cultural' | 'fantasy';
  localUrl: string;
  fallbackUrl: string;
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
}

// Updated to use reliable cached images
export const LOCAL_360_IMAGES: Local360Image[] = [
  {
    id: 'forest-clearing',
    name: 'Forest Clearing',
    category: 'natural',
    localUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1024&h=512&fit=crop&q=60',
    description: 'Sunlit forest clearing with natural lighting',
    lighting: { intensity: 1.2, warmth: 0.7, contrast: 0.6 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 }
  },
  {
    id: 'mountain-vista',
    name: 'Mountain Vista',
    category: 'natural',
    localUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048&h=1024&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=512&fit=crop&q=60',
    description: 'Panoramic mountain landscape with dramatic sky',
    lighting: { intensity: 1.4, warmth: 0.6, contrast: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.2 }
  },
  {
    id: 'ocean-sunset',
    name: 'Ocean Sunset',
    category: 'natural',
    localUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=2048&h=1024&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1024&h=512&fit=crop&q=60',
    description: 'Golden hour ocean view with warm lighting',
    lighting: { intensity: 1.3, warmth: 0.9, contrast: 0.7 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 }
  },
  {
    id: 'city-rooftop',
    name: 'City Rooftop',
    category: 'urban',
    localUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=2048&h=1024&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1024&h=512&fit=crop&q=60',
    description: 'Urban skyline from rooftop perspective',
    lighting: { intensity: 1.0, warmth: 0.5, contrast: 0.9 },
    camera: { defaultDistance: 9, autoRotateSpeed: 0.3 }
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    category: 'urban',
    localUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=2048&h=1024&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1024&h=512&fit=crop&q=60',
    description: 'Cyberpunk cityscape with neon lights',
    lighting: { intensity: 0.9, warmth: 0.3, contrast: 1.2 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 }
  },
  {
    id: 'modern-studio',
    name: 'Modern Studio',
    category: 'interior',
    localUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=2048&h=1024&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1024&h=512&fit=crop&q=60',
    description: 'Clean, modern studio with perfect lighting',
    lighting: { intensity: 1.5, warmth: 0.4, contrast: 0.5 },
    camera: { defaultDistance: 6, autoRotateSpeed: 0.2 }
  },
  {
    id: 'warehouse-loft',
    name: 'Warehouse Loft',
    category: 'interior',
    localUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=2048&h=1024&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1024&h=512&fit=crop&q=60',
    description: 'Industrial loft with dramatic windows',
    lighting: { intensity: 1.2, warmth: 0.6, contrast: 0.8 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.1 }
  },
  {
    id: 'sports-arena',
    name: 'Sports Arena',
    category: 'sports',
    localUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=2048&h=1024&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1024&h=512&fit=crop&q=60',
    description: 'Professional sports arena atmosphere',
    lighting: { intensity: 1.3, warmth: 0.5, contrast: 0.8 },
    camera: { defaultDistance: 12, autoRotateSpeed: 0.3 }
  },
  {
    id: 'concert-hall',
    name: 'Concert Hall',
    category: 'cultural',
    localUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2048&h=1024&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1024&h=512&fit=crop&q=60',
    description: 'Grand concert hall with ornate architecture',
    lighting: { intensity: 1.1, warmth: 0.7, contrast: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.1 }
  },
  {
    id: 'cosmic-void',
    name: 'Cosmic Void',
    category: 'fantasy',
    localUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1024&h=512&fit=crop&q=60',
    description: 'Deep space with stars and nebula',
    lighting: { intensity: 0.8, warmth: 0.3, contrast: 1.0 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 }
  }
];

export const getLocal360ImageById = (id: string): Local360Image | null => {
  return LOCAL_360_IMAGES.find(img => img.id === id) || null;
};

export const getLocal360ImagesByCategory = (category: Local360Image['category']) => {
  return LOCAL_360_IMAGES.filter(img => img.category === category);
};

// Fallback images for when specific IDs aren't found
export const getDefaultLocal360Image = (): Local360Image => {
  return LOCAL_360_IMAGES[5]; // Modern studio as default
};
