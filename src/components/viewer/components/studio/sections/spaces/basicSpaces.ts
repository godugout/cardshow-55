
import type { SpaceEnvironment } from '../../../../spaces/types';

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
    id: 'studio',
    name: 'Studio',
    description: 'Professional lighting setup',
    previewUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    type: 'studio',
    category: 'basic',
    emoji: '📸',
    config: {
      backgroundColor: '#f5f5f5',
      ambientColor: '#ffffff',
      lightIntensity: 1.2,
    },
  },
];
