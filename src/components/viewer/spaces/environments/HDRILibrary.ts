
export interface HDRIEnvironment {
  id: string;
  name: string;
  category: 'natural' | 'urban' | 'interior' | 'sports' | 'cultural' | 'fantasy';
  hdriUrl: string;
  fallbackUrl: string;
  description: string;
  lighting: {
    exposure: number;
    intensity: number;
    backgroundBlurriness: number;
    environmentIntensity: number;
  };
  camera: {
    defaultDistance: number;
    autoRotateSpeed: number;
  };
  rotation: number;
}

// High-quality 360° panoramic environments - using web-compatible formats
export const HDRI_ENVIRONMENTS: HDRIEnvironment[] = [
  {
    id: 'forest-clearing',
    name: 'Forest Clearing',
    category: 'natural',
    hdriUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=4096&h=2048&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop&q=80',
    description: 'Sunlit forest with natural lighting and depth',
    lighting: {
      exposure: 1.2,
      intensity: 1.4,
      backgroundBlurriness: 0.1,
      environmentIntensity: 1.0
    },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 },
    rotation: 0
  },
  {
    id: 'mountain-vista',
    name: 'Mountain Vista',
    category: 'natural',
    hdriUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=4096&h=2048&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048&h=1024&fit=crop&q=80',
    description: 'Dramatic mountain landscape with golden hour lighting',
    lighting: {
      exposure: 1.6,
      intensity: 1.8,
      backgroundBlurriness: 0.05,
      environmentIntensity: 1.2
    },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.2 },
    rotation: 0
  },
  {
    id: 'ocean-sunset',
    name: 'Ocean Sunset',
    category: 'natural',
    hdriUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=4096&h=2048&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=2048&h=1024&fit=crop&q=80',
    description: 'Warm ocean sunset with golden reflections',
    lighting: {
      exposure: 1.8,
      intensity: 2.0,
      backgroundBlurriness: 0.0,
      environmentIntensity: 1.4
    },
    camera: { defaultDistance: 9, autoRotateSpeed: 0.2 },
    rotation: 0
  },
  {
    id: 'urban-skyline',
    name: 'Urban Skyline',
    category: 'urban',
    hdriUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=4096&h=2048&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=2048&h=1024&fit=crop&q=80',
    description: 'Modern city environment with architectural lighting',
    lighting: {
      exposure: 1.0,
      intensity: 1.2,
      backgroundBlurriness: 0.15,
      environmentIntensity: 0.9
    },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 },
    rotation: 0
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    category: 'urban',
    hdriUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=4096&h=2048&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=2048&h=1024&fit=crop&q=80',
    description: 'Atmospheric night city with neon lighting',
    lighting: {
      exposure: 0.8,
      intensity: 1.0,
      backgroundBlurriness: 0.2,
      environmentIntensity: 0.8
    },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 },
    rotation: 0
  },
  {
    id: 'modern-studio',
    name: 'Modern Studio',
    category: 'interior',
    hdriUrl: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=4096&h=2048&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=2048&h=1024&fit=crop&q=80',
    description: 'Clean studio environment with professional lighting',
    lighting: {
      exposure: 1.4,
      intensity: 1.6,
      backgroundBlurriness: 0.3,
      environmentIntensity: 1.0
    },
    camera: { defaultDistance: 6, autoRotateSpeed: 0.1 },
    rotation: 0
  },
  {
    id: 'warehouse-loft',
    name: 'Warehouse Loft',
    category: 'interior',
    hdriUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=4096&h=2048&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=2048&h=1024&fit=crop&q=80',
    description: 'Industrial loft with dramatic window lighting',
    lighting: {
      exposure: 1.1,
      intensity: 1.3,
      backgroundBlurriness: 0.1,
      environmentIntensity: 1.1
    },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.1 },
    rotation: 0
  },
  {
    id: 'sports-arena',
    name: 'Sports Arena',
    category: 'sports',
    hdriUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=4096&h=2048&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=2048&h=1024&fit=crop&q=80',
    description: 'Large sports arena with stadium lighting',
    lighting: {
      exposure: 1.3,
      intensity: 1.5,
      backgroundBlurriness: 0.05,
      environmentIntensity: 1.2
    },
    camera: { defaultDistance: 12, autoRotateSpeed: 0.2 },
    rotation: 0
  },
  {
    id: 'concert-hall',
    name: 'Concert Hall',
    category: 'cultural',
    hdriUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=4096&h=2048&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=2048&h=1024&fit=crop&q=80',
    description: 'Grand concert hall with architectural beauty',
    lighting: {
      exposure: 1.0,
      intensity: 1.1,
      backgroundBlurriness: 0.1,
      environmentIntensity: 0.9
    },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.1 },
    rotation: 0
  },
  {
    id: 'cosmic-void',
    name: 'Cosmic Void',
    category: 'fantasy',
    hdriUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=4096&h=2048&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&q=80',
    description: 'Deep space environment with stars and nebula',
    lighting: {
      exposure: 0.6,
      intensity: 0.8,
      backgroundBlurriness: 0.0,
      environmentIntensity: 0.7
    },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 },
    rotation: 0
  }
];

export const getHDRIEnvironmentById = (id: string): HDRIEnvironment | null => {
  return HDRI_ENVIRONMENTS.find(env => env.id === id) || null;
};

export const getHDRIEnvironmentsByCategory = (category: HDRIEnvironment['category']) => {
  return HDRI_ENVIRONMENTS.filter(env => env.category === category);
};

export const getDefaultHDRIEnvironment = (): HDRIEnvironment => {
  return HDRI_ENVIRONMENTS[5]; // Modern studio as default
};
