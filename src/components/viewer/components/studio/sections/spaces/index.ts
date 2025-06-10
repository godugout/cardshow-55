
import { SpaceEnvironment } from '../../../spaces/types';

export const basicSpaces: SpaceEnvironment[] = [
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
    id: 'matrix',
    name: 'Matrix',
    description: 'Digital code rain effect',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
    type: 'matrix',
    category: 'basic',
    emoji: '💻',
    config: {
      backgroundColor: '#001100',
      ambientColor: '#003300',
      lightIntensity: 0.7,
      animationSpeed: 1.0,
    },
  },
  {
    id: 'neon',
    name: 'Neon City',
    description: 'Cyberpunk cityscape',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
    type: 'neon',
    category: 'basic',
    emoji: '🌃',
    config: {
      backgroundColor: '#0a0014',
      ambientColor: '#2a1a3a',
      lightIntensity: 1.2,
      particleCount: 150,
    },
  },
];
