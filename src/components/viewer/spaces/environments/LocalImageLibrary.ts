
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

// Updated to reference HDRI environments - these IDs match HDRILibrary.ts
export const LOCAL_360_IMAGES: Local360Image[] = [
  {
    id: 'forest-clearing',
    name: 'Forest Clearing',
    category: 'natural',
    localUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/forest_slope_4k.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop&q=80',
    description: 'Sunlit forest clearing with natural HDRI lighting',
    lighting: { intensity: 1.2, warmth: 0.7, contrast: 0.6 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 }
  },
  {
    id: 'mountain-vista',
    name: 'Mountain Vista',
    category: 'natural',
    localUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/kloppenheim_06_4k.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048&h=1024&fit=crop&q=80',
    description: 'Panoramic mountain landscape with dramatic HDRI sky',
    lighting: { intensity: 1.4, warmth: 0.6, contrast: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.2 }
  },
  {
    id: 'ocean-sunset',
    name: 'Ocean Sunset',
    category: 'natural',
    localUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/venice_sunset_4k.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=2048&h=1024&fit=crop&q=80',
    description: 'Warm ocean sunset with golden HDRI reflections',
    lighting: { intensity: 1.5, warmth: 0.8, contrast: 0.9 },
    camera: { defaultDistance: 9, autoRotateSpeed: 0.2 }
  },
  {
    id: 'urban-skyline',
    name: 'Urban Skyline',
    category: 'urban',
    localUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/quattro_canti_4k.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=2048&h=1024&fit=crop&q=80',
    description: 'Modern city environment with architectural HDRI lighting',
    lighting: { intensity: 1.3, warmth: 0.4, contrast: 0.7 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 }
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    category: 'urban',
    localUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/dancing_hall_4k.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=2048&h=1024&fit=crop&q=80',
    description: 'Atmospheric night city with neon HDRI lighting',
    lighting: { intensity: 0.9, warmth: 0.2, contrast: 1.1 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 }
  },
  {
    id: 'modern-studio',
    name: 'Modern Studio',
    category: 'interior',
    localUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/studio_small_03_4k.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=2048&h=1024&fit=crop&q=80',
    description: 'Clean studio environment with professional HDRI lighting',
    lighting: { intensity: 1.6, warmth: 0.3, contrast: 0.5 },
    camera: { defaultDistance: 6, autoRotateSpeed: 0.1 }
  },
  {
    id: 'warehouse-loft',
    name: 'Warehouse Loft',
    category: 'interior',
    localUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/industrial_workshop_foundry_4k.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=2048&h=1024&fit=crop&q=80',
    description: 'Industrial loft with dramatic window HDRI lighting',
    lighting: { intensity: 1.2, warmth: 0.6, contrast: 0.8 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.1 }
  },
  {
    id: 'sports-arena',
    name: 'Sports Arena',
    category: 'sports',
    localUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/sports_hall_4k.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=2048&h=1024&fit=crop&q=80',
    description: 'Large sports arena with stadium HDRI lighting',
    lighting: { intensity: 1.4, warmth: 0.5, contrast: 0.9 },
    camera: { defaultDistance: 12, autoRotateSpeed: 0.2 }
  },
  {
    id: 'concert-hall',
    name: 'Concert Hall',
    category: 'cultural',
    localUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/concert_hall_02_4k.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=2048&h=1024&fit=crop&q=80',
    description: 'Grand concert hall with architectural HDRI beauty',
    lighting: { intensity: 1.1, warmth: 0.7, contrast: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.1 }
  },
  {
    id: 'cosmic-void',
    name: 'Cosmic Void',
    category: 'fantasy',
    localUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/starmap_4k.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&q=80',
    description: 'Deep space environment with stars and nebula HDRI',
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
