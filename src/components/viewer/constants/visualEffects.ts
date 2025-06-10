
import type { VisualEffect } from '../types';

export const VISUAL_EFFECTS: VisualEffect[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Rainbow holographic effect',
    type: 'surface',
    category: 'premium',
    intensity: [0, 100],
    properties: {
      color: '#ff6b6b',
      shimmer: true,
      rainbow: true
    }
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic chrome finish',
    type: 'surface',
    category: 'metallic',
    intensity: [0, 100],
    properties: {
      metalness: 0.9,
      roughness: 0.1,
      reflectivity: 0.8
    }
  },
  {
    id: 'foil',
    name: 'Foil',
    description: 'Shimmering foil effect',
    type: 'surface',
    category: 'premium',
    intensity: [0, 100],
    properties: {
      shimmer: true,
      metallic: true,
      reflection: 0.6
    }
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged vintage look',
    type: 'atmospheric',
    category: 'retro',
    intensity: [0, 100],
    properties: {
      sepia: true,
      grain: true,
      fade: 0.3
    }
  }
];
