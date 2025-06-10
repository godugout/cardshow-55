
import type { LightingPreset } from '../types';

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'studio',
    name: 'Studio Lighting',
    description: 'Professional studio setup',
    brightness: 100,
    contrast: 100,
    highlights: 80,
    shadows: 20,
    temperature: 5500,
    position: { x: 0, y: 5, z: 5 },
    shadowSoftness: 0.5
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast dramatic lighting',
    brightness: 120,
    contrast: 140,
    highlights: 90,
    shadows: 10,
    temperature: 4000,
    position: { x: -3, y: 8, z: 3 },
    shadowSoftness: 0.8
  },
  {
    id: 'soft',
    name: 'Soft Light',
    description: 'Gentle diffused lighting',
    brightness: 90,
    contrast: 80,
    highlights: 70,
    shadows: 40,
    temperature: 6000,
    position: { x: 2, y: 6, z: 4 },
    shadowSoftness: 0.3
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    description: 'Warm golden hour lighting',
    brightness: 85,
    contrast: 110,
    highlights: 85,
    shadows: 25,
    temperature: 3200,
    position: { x: 5, y: 3, z: 2 },
    shadowSoftness: 0.6
  }
];
