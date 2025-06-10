
export { SceneGrid } from './SceneGrid';
export { SpaceEnvironmentGrid } from './SpaceEnvironmentGrid';
export { CameraControlsSection } from './CameraControlsSection';
export { CardPhysicsSection } from './CardPhysicsSection';
export { EnvironmentControlsSection } from './EnvironmentControlsSection';

import type { SpaceEnvironment } from '../../../../spaces/types';

export const SPACE_ENVIRONMENTS: SpaceEnvironment[] = [
  {
    id: 'void',
    name: 'Void Space',
    description: 'Minimalist space with floating card',
    previewUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop',
    type: 'void',
    emoji: '🌌',
    config: {
      backgroundColor: '#0a0a0a',
      ambientColor: '#1a1a2e',
      lightIntensity: 0.3
    }
  },
  {
    id: 'cosmic',
    name: 'Cosmic Space',
    description: 'Colorful cosmic environment',
    previewUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=200&fit=crop',
    type: 'cosmic',
    emoji: '✨',
    config: {
      backgroundColor: '#0f0f23',
      ambientColor: '#ff00ff',
      lightIntensity: 0.8,
      particleCount: 5000
    }
  },
  {
    id: 'matrix',
    name: 'Matrix Code',
    description: 'Digital matrix environment',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
    type: 'matrix',
    emoji: '💻',
    config: {
      backgroundColor: '#000000',
      ambientColor: '#00ff00',
      lightIntensity: 0.6,
      animationSpeed: 1.0
    }
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    description: 'Cyberpunk neon cityscape',
    previewUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300&h=200&fit=crop',
    type: 'neon',
    emoji: '🌃',
    config: {
      backgroundColor: '#0a0a0a',
      ambientColor: '#ff0080',
      lightIntensity: 1.0,
      particleCount: 1000
    }
  }
];
