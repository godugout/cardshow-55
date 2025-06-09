
import type { SpaceEnvironment } from '../../../../spaces/types';

export const SPACE_ENVIRONMENTS: SpaceEnvironment[] = [
  {
    id: 'void',
    name: 'Dark Void',
    description: 'Infinite darkness with subtle stars',
    previewUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=120&h=80&fit=crop&crop=center',
    type: 'void',
    emoji: '🌌',
    config: {
      backgroundColor: '#000000',
      ambientColor: '#404040',
      lightIntensity: 0.3,
      particleCount: 5000,
      animationSpeed: 1
    }
  },
  {
    id: 'nebula',
    name: 'Cosmic Nebula',
    description: 'Colorful cosmic clouds and particles',
    previewUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=120&h=80&fit=crop&crop=center',
    type: 'cosmic',
    emoji: '✨',
    config: {
      backgroundColor: '#1a0033',
      ambientColor: '#ff00ff',
      lightIntensity: 0.6,
      particleCount: 5000,
      animationSpeed: 2
    }
  },
  {
    id: 'studio-space',
    name: 'Studio Space',
    description: 'Clean minimal space with soft lighting',
    previewUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=120&h=80&fit=crop&crop=center',
    type: 'studio',
    emoji: '⚪',
    config: {
      backgroundColor: '#f0f0f0',
      ambientColor: '#ffffff',
      lightIntensity: 1.0,
      particleCount: 0,
      animationSpeed: 0
    }
  },
  {
    id: 'abstract-flow',
    name: 'Abstract Flow',
    description: 'Flowing geometric patterns',
    previewUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=80&fit=crop&crop=center',
    type: 'abstract',
    emoji: '🔮',
    config: {
      backgroundColor: '#4338ca',
      ambientColor: '#8b5cf6',
      lightIntensity: 0.8,
      particleCount: 2000,
      animationSpeed: 3
    }
  },
  {
    id: 'matrix-code',
    name: 'Matrix Code',
    description: 'Flowing green digital rain',
    previewUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&h=80&fit=crop&crop=center',
    type: 'matrix',
    emoji: '🔢',
    config: {
      backgroundColor: '#001100',
      ambientColor: '#00ff00',
      lightIntensity: 0.4,
      particleCount: 3000,
      animationSpeed: 1.5
    }
  },
  {
    id: 'cartoon-world',
    name: 'Cartoon World',
    description: 'Whimsical colorful cartoon environment',
    previewUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=120&h=80&fit=crop&crop=center',
    type: 'cartoon',
    emoji: '🎨',
    config: {
      backgroundColor: '#87CEEB',
      ambientColor: '#ffeb3b',
      lightIntensity: 1.2,
      particleCount: 1000,
      animationSpeed: 0.5
    }
  },
  {
    id: 'sketch-art',
    name: 'Sketch Art',
    description: 'Hand-drawn artistic sketch style',
    previewUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=120&h=80&fit=crop&crop=center',
    type: 'sketch',
    emoji: '✏️',
    config: {
      backgroundColor: '#f5f5f5',
      ambientColor: '#333333',
      lightIntensity: 0.9,
      particleCount: 0,
      animationSpeed: 0.2
    }
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    description: 'Cyberpunk cityscape with neon lights',
    previewUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&h=80&fit=crop&crop=center',
    type: 'neon',
    emoji: '🌆',
    config: {
      backgroundColor: '#0a0a0a',
      ambientColor: '#ff00ff',
      lightIntensity: 0.7,
      particleCount: 800,
      animationSpeed: 1.5
    }
  },
  {
    id: 'forest-glade',
    name: 'Forest Glade',
    description: 'Natural woodland with dappled light',
    previewUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=120&h=80&fit=crop&crop=center',
    type: 'forest',
    emoji: '🌲',
    config: {
      backgroundColor: '#90EE90',
      ambientColor: '#228B22',
      lightIntensity: 0.8,
      particleCount: 1000,
      animationSpeed: 0.3
    }
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    description: 'Underwater scene with floating bubbles',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&h=80&fit=crop&crop=center',
    type: 'ocean',
    emoji: '🌊',
    config: {
      backgroundColor: '#006994',
      ambientColor: '#20B2AA',
      lightIntensity: 0.6,
      particleCount: 500,
      animationSpeed: 0.8
    }
  }
];
