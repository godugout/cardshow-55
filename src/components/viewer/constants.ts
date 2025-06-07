import type { EnvironmentScene, LightingPreset, VisualEffect } from './types';

export const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'forest',
    name: 'Enchanted Forest',
    icon: '🌲',
    category: 'natural',
    description: 'Mystical forest with ancient trees',
    panoramicUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #2d4a36 0%, #4a7c59 100%)',
    lighting: {
      color: '#4a7c59',
      intensity: 0.8,
      elevation: 30,
      azimuth: 45
    },
    atmosphere: {
      fog: true,
      fogColor: '#2d4a36',
      fogDensity: 0.3,
      particles: true
    },
    depth: {
      layers: 5,
      parallaxIntensity: 1.2,
      fieldOfView: 75
    }
  },
  {
    id: 'mountain',
    name: 'Mountain Vista',
    icon: '🏔️',
    category: 'natural',
    description: 'Breathtaking mountain landscape',
    panoramicUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #ffa500 0%, #ff7f50 100%)',
    lighting: {
      color: '#ffa500',
      intensity: 0.9,
      elevation: 15,
      azimuth: 60
    },
    atmosphere: {
      fog: false,
      fogColor: '#ffffff',
      fogDensity: 0.1,
      particles: false
    },
    depth: {
      layers: 7,
      parallaxIntensity: 1.5,
      fieldOfView: 85
    }
  },
  {
    id: 'crystal-cave',
    name: 'Crystal Cavern',
    icon: '💎',
    category: 'fantasy',
    description: 'Glowing crystal cave realm',
    panoramicUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #4a5ee8 0%, #7b2cbf 100%)',
    lighting: {
      color: '#4a5ee8',
      intensity: 1.1,
      elevation: 60,
      azimuth: -30
    },
    atmosphere: {
      fog: true,
      fogColor: '#4a5ee8',
      fogDensity: 0.4,
      particles: true
    },
    depth: {
      layers: 6,
      parallaxIntensity: 1.8,
      fieldOfView: 70
    }
  },
  {
    id: 'cyberpunk-city',
    name: 'Neon Metropolis',
    icon: '🌃',
    category: 'futuristic',
    description: 'Cyberpunk cityscape at night',
    panoramicUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #ff0080 0%, #00ffff 100%)',
    lighting: {
      color: '#ff0080',
      intensity: 1.2,
      elevation: 30,
      azimuth: 45
    },
    atmosphere: {
      fog: true,
      fogColor: '#ff0080',
      fogDensity: 0.2,
      particles: true
    },
    depth: {
      layers: 8,
      parallaxIntensity: 2.0,
      fieldOfView: 90
    }
  },
  {
    id: 'ancient-temple',
    name: 'Ancient Temple',
    icon: '🏛️',
    category: 'architectural',
    description: 'Majestic ancient temple ruins',
    panoramicUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #d4af37 0%, #ffd700 100%)',
    lighting: {
      color: '#d4af37',
      intensity: 0.9,
      elevation: 45,
      azimuth: 0
    },
    atmosphere: {
      fog: false,
      fogColor: '#d4af37',
      fogDensity: 0.15,
      particles: false
    },
    depth: {
      layers: 6,
      parallaxIntensity: 1.3,
      fieldOfView: 80
    }
  },
  {
    id: 'space-station',
    name: 'Space Station',
    icon: '🚀',
    category: 'futuristic',
    description: 'Orbital space station interior',
    panoramicUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #00aaff 0%, #0066cc 100%)',
    lighting: {
      color: '#00aaff',
      intensity: 1.0,
      elevation: 90,
      azimuth: 0
    },
    atmosphere: {
      fog: false,
      fogColor: '#000000',
      fogDensity: 0.0,
      particles: true
    },
    depth: {
      layers: 4,
      parallaxIntensity: 0.8,
      fieldOfView: 110
    }
  }
];

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
    shadowSoftness: 25
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
    shadowSoftness: 10
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
    shadowSoftness: 40
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
