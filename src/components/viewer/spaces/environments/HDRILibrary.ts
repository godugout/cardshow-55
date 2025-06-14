
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

// High-quality 360° panoramic environments - using proper equirectangular sources
export const HDRI_ENVIRONMENTS: HDRIEnvironment[] = [
  {
    id: 'forest-clearing',
    name: 'Forest Clearing',
    category: 'natural',
    hdriUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/forest_slope_2k.hdr',
    fallbackUrl: 'https://polyhaven.com/files/hdris/tonemapped/forest_slope.jpg',
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
    hdriUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/kloppenheim_06_2k.hdr',
    fallbackUrl: 'https://polyhaven.com/files/hdris/tonemapped/kloppenheim_06.jpg',
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
    hdriUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/venice_sunset_2k.hdr',
    fallbackUrl: 'https://polyhaven.com/files/hdris/tonemapped/venice_sunset.jpg',
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
    hdriUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/quattro_canti_2k.hdr',
    fallbackUrl: 'https://polyhaven.com/files/hdris/tonemapped/quattro_canti.jpg',
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
    hdriUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/dancing_hall_2k.hdr',
    fallbackUrl: 'https://polyhaven.com/files/hdris/tonemapped/dancing_hall.jpg',
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
    hdriUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_03_2k.hdr',
    fallbackUrl: 'https://polyhaven.com/files/hdris/tonemapped/studio_small_03.jpg',
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
    hdriUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/industrial_workshop_foundry_2k.hdr',
    fallbackUrl: 'https://polyhaven.com/files/hdris/tonemapped/industrial_workshop_foundry.jpg',
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
    hdriUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/sports_hall_2k.hdr',
    fallbackUrl: 'https://polyhaven.com/files/hdris/tonemapped/sports_hall.jpg',
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
    hdriUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/concert_hall_02_2k.hdr',
    fallbackUrl: 'https://polyhaven.com/files/hdris/tonemapped/concert_hall_02.jpg',
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
    hdriUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/starmap_2k.hdr',
    fallbackUrl: 'https://polyhaven.com/files/hdris/tonemapped/starmap.jpg',
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
  const env = HDRI_ENVIRONMENTS.find(env => env.id === id);
  console.log(`🔍 HDRI lookup for "${id}":`, env ? `Found ${env.name}` : 'NOT FOUND');
  return env;
};

export const getHDRIEnvironmentsByCategory = (category: HDRIEnvironment['category']) => {
  return HDRI_ENVIRONMENTS.filter(env => env.category === category);
};

export const getDefaultHDRIEnvironment = (): HDRIEnvironment => {
  console.log('🎯 Using default HDRI environment: Modern Studio');
  return HDRI_ENVIRONMENTS[5]; // Modern studio as default
};
