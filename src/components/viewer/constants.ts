
import type { EnvironmentScene, LightingPreset, VisualEffect } from './types';

export const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'studio',
    name: 'Studio',
    icon: '🎬',
    gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    description: 'Clean studio lighting',
    background: 'studio',
    lighting: 'natural',
    backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    reflections: 'soft'
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: '🌈',
    gradient: 'linear-gradient(135deg, #ff0080 0%, #0080ff 100%)',
    description: 'Vibrant neon atmosphere',
    background: 'neon',
    lighting: 'dramatic',
    backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    reflections: 'vivid'
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    icon: '🌅',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: 'Warm golden lighting',
    background: 'golden',
    lighting: 'soft',
    backgroundImage: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    reflections: 'warm'
  },
  {
    id: 'twilight',
    name: 'Twilight',
    icon: '🌙',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: 'Mystical twilight ambiance',
    background: 'twilight',
    lighting: 'vibrant',
    backgroundImage: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    reflections: 'cold'
  }
];

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'natural',
    name: 'Natural',
    description: 'Balanced natural lighting',
    ambient: 0.5,
    directional: 0.8,
    color: '#ffffff',
    brightness: 90,
    contrast: 90,
    shadows: 40,
    highlights: 65,
    temperature: 5500,
    position: { x: 0, y: 1, z: 1 },
    shadowSoftness: 25
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast dramatic lighting',
    ambient: 0.3,
    directional: 1.2,
    color: '#ff6b35',
    brightness: 120,
    contrast: 150,
    shadows: 80,
    highlights: 90,
    temperature: 4000,
    position: { x: 1, y: 0.5, z: 0.5 },
    shadowSoftness: 10
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle diffused lighting',
    ambient: 0.7,
    directional: 0.6,
    color: '#e8f4f8',
    brightness: 90,
    contrast: 80,
    shadows: 30,
    highlights: 60,
    temperature: 6000,
    position: { x: 0, y: 1, z: 0 },
    shadowSoftness: 40
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Enhanced color vibrancy',
    ambient: 0.4,
    directional: 1.0,
    color: '#4a5ee8',
    brightness: 110,
    contrast: 130,
    shadows: 40,
    highlights: 85,
    temperature: 5800,
    position: { x: -0.5, y: 1, z: 1 },
    shadowSoftness: 25
  }
];

export const VISUAL_EFFECTS: VisualEffect[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Dynamic rainbow holographic effect',
    category: 'prismatic'
  },
  {
    id: 'foilspray',
    name: 'Foil Spray',
    description: 'Metallic spray pattern',
    category: 'metallic'
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Mirror-like chrome finish',
    category: 'metallic'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged patina effect',
    category: 'vintage'
  }
];
