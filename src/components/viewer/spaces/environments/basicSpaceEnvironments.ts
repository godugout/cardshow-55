
import type { SpaceEnvironment } from '../types';

export const BASIC_SPACE_ENVIRONMENTS: SpaceEnvironment[] = [
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
      panoramicPhotoId: 'modern-studio'
    },
  },
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
    id: 'forest',
    name: 'Forest',
    description: 'Natural forest environment',
    previewUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    type: 'forest',
    category: 'natural',
    emoji: '🌲',
    config: {
      backgroundColor: '#2d5016',
      ambientColor: '#4a7c59',
      lightIntensity: 0.8,
      panoramicPhotoId: 'forest-clearing'
    },
  }
];
