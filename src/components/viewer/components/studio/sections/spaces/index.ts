
import type { SpaceEnvironment, HDRIEnvironment } from '../../../spaces/types';

// 3D Generated Space Environments
export const SPACE_ENVIRONMENTS: SpaceEnvironment[] = [
  {
    id: 'void-space',
    name: 'Void Space',
    type: 'void',
    emoji: '🌌',
    previewUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop',
    config: {
      backgroundColor: '#0a0a0a',
      lightIntensity: 0.3,
      ambientColor: '#1a1a2e',
      particleCount: 200
    }
  },
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Nebula',
    type: 'cosmic',
    emoji: '🪐',
    previewUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop',
    config: {
      backgroundColor: '#0f0f23',
      lightIntensity: 0.8,
      ambientColor: '#4a154b',
      particleCount: 300,
      animationSpeed: 0.5
    }
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    type: 'neon',
    emoji: '🌃',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    config: {
      backgroundColor: '#1a0033',
      lightIntensity: 1.2,
      ambientColor: '#ff00ff',
      fogColor: '#440066',
      fogDensity: 0.02
    }
  },
  {
    id: 'matrix-code',
    name: 'Matrix Code',
    type: 'matrix',
    emoji: '💻',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    config: {
      backgroundColor: '#000000',
      lightIntensity: 0.6,
      ambientColor: '#00ff00',
      animationSpeed: 1.0
    }
  }
];

// HDRI Photo-realistic Environments
export const HDRI_ENVIRONMENTS: HDRIEnvironment[] = [
  {
    id: 'studio-hdri',
    name: 'Photo Studio',
    type: 'hdri',
    emoji: '📸',
    previewUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    hdriUrl: '/hdri/studio.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=2048&h=1024&fit=crop'
  },
  {
    id: 'sunset-hdri',
    name: 'Golden Sunset',
    type: 'hdri',
    emoji: '🌅',
    previewUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    hdriUrl: '/hdri/sunset.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2048&h=1024&fit=crop'
  },
  {
    id: 'forest-hdri',
    name: 'Forest Grove',
    type: 'hdri',
    emoji: '🌲',
    previewUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    hdriUrl: '/hdri/forest.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop'
  },
  {
    id: 'city-hdri',
    name: 'Urban Rooftop',
    type: 'hdri',
    emoji: '🏙️',
    previewUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    hdriUrl: '/hdri/city.hdr',
    fallbackUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=2048&h=1024&fit=crop'
  }
];

export { SceneGrid } from './SceneGrid';
export { SpaceEnvironmentGrid } from './SpaceEnvironmentGrid';
export { HDRIEnvironmentGrid } from './HDRIEnvironmentGrid';
export { CameraControlsSection } from './CameraControlsSection';
export { CardPhysicsSection } from './CardPhysicsSection';
export { EnvironmentControlsSection } from './EnvironmentControlsSection';
