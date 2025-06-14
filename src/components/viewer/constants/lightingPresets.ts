
import type { LightingPreset } from '../types';

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'natural',
    name: 'Natural',
    description: 'Balanced natural lighting',
    brightness: 90,
    contrast: 90,
    shadows: 40,
    highlights: 65,
    temperature: 5500,
    position: { x: 0, y: 1, z: 1 },
    shadowSoftness: 25,
    ambient: 0.6,
    directional: 0.8,
    color: '#ffffff',
    intensity: 0.9
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast dramatic lighting',
    brightness: 120,
    contrast: 150,
    shadows: 80,
    highlights: 90,
    temperature: 4000,
    position: { x: 1, y: 0.5, z: 0.5 },
    shadowSoftness: 10,
    ambient: 0.4,
    directional: 1.2,
    color: '#ffaa44',
    intensity: 1.2
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle diffused lighting',
    brightness: 90,
    contrast: 80,
    shadows: 30,
    highlights: 60,
    temperature: 6000,
    position: { x: 0, y: 1, z: 0 },
    shadowSoftness: 40,
    ambient: 0.8,
    directional: 0.6,
    color: '#aaccff',
    intensity: 0.8
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Enhanced color vibrancy',
    brightness: 110,
    contrast: 130,
    shadows: 40,
    highlights: 85,
    temperature: 5800,
    position: { x: -0.5, y: 1, z: 1 },
    shadowSoftness: 25,
    ambient: 0.7,
    directional: 1.0,
    color: '#ffddaa',
    intensity: 1.1
  }
];
