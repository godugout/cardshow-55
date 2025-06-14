
export interface Panoramic360Environment {
  id: string;
  name: string;
  category: 'natural' | 'urban' | 'interior' | 'sports' | 'cultural' | 'fantasy';
  imageUrl: string;
  thumbnail: string;
  description: string;
  lighting: {
    brightness: number;
    contrast: number;
    warmth: number;
  };
  camera: {
    defaultDistance: number;
    autoRotateSpeed: number;
  };
  effects: {
    parallaxStrength: number;
    depthLayers: boolean;
    ambientParticles: boolean;
  };
}

// High-quality 360° panoramic images from reliable sources
export const PANORAMIC_360_ENVIRONMENTS: Panoramic360Environment[] = [
  {
    id: 'forest-clearing',
    name: 'Forest Clearing',
    category: 'natural',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&q=80',
    description: 'Sunlit forest with natural lighting and depth',
    lighting: { brightness: 1.2, contrast: 0.8, warmth: 0.7 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 },
    effects: { parallaxStrength: 0.8, depthLayers: true, ambientParticles: true }
  },
  {
    id: 'mountain-vista',
    name: 'Mountain Vista',
    category: 'natural',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048&h=1024&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&q=80',
    description: 'Dramatic mountain landscape with golden hour lighting',
    lighting: { brightness: 1.4, contrast: 0.9, warmth: 0.8 },
    camera: { defaultDistance: 10, autoRotateSpeed: 0.2 },
    effects: { parallaxStrength: 1.0, depthLayers: true, ambientParticles: false }
  },
  {
    id: 'ocean-sunset',
    name: 'Ocean Sunset',
    category: 'natural',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=2048&h=1024&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=200&fit=crop&q=80',
    description: 'Warm ocean sunset with golden reflections',
    lighting: { brightness: 1.6, contrast: 0.7, warmth: 0.9 },
    camera: { defaultDistance: 9, autoRotateSpeed: 0.2 },
    effects: { parallaxStrength: 0.6, depthLayers: true, ambientParticles: false }
  },
  {
    id: 'urban-skyline',
    name: 'Urban Skyline',
    category: 'urban',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=2048&h=1024&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=200&fit=crop&q=80',
    description: 'Modern city environment with architectural lighting',
    lighting: { brightness: 1.0, contrast: 0.8, warmth: 0.4 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.3 },
    effects: { parallaxStrength: 0.7, depthLayers: true, ambientParticles: false }
  },
  {
    id: 'modern-studio',
    name: 'Modern Studio',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=2048&h=1024&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400&h=200&fit=crop&q=80',
    description: 'Clean studio environment with professional lighting',
    lighting: { brightness: 1.3, contrast: 0.6, warmth: 0.3 },
    camera: { defaultDistance: 6, autoRotateSpeed: 0.1 },
    effects: { parallaxStrength: 0.3, depthLayers: false, ambientParticles: false }
  },
  {
    id: 'cosmic-void',
    name: 'Cosmic Void',
    category: 'fantasy',
    imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=2048&h=1024&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=200&fit=crop&q=80',
    description: 'Deep space environment with stars and nebula',
    lighting: { brightness: 0.8, contrast: 1.0, warmth: 0.3 },
    camera: { defaultDistance: 8, autoRotateSpeed: 0.4 },
    effects: { parallaxStrength: 1.2, depthLayers: true, ambientParticles: true }
  }
];

export const getPanoramic360EnvironmentById = (id: string): Panoramic360Environment | null => {
  return PANORAMIC_360_ENVIRONMENTS.find(env => env.id === id) || null;
};

export const getDefaultPanoramic360Environment = (): Panoramic360Environment => {
  return PANORAMIC_360_ENVIRONMENTS[4]; // Modern studio as default
};
