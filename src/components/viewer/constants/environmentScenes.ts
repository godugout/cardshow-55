
import type { EnvironmentScene } from '../types';

export const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'studio',
    name: 'Studio',
    icon: '🎬',
    category: 'professional',
    description: 'Clean studio environment',
    panoramicUrl: '/environments/studio-360.hdr',
    previewUrl: '/environments/studio-preview.jpg',
    backgroundImage: '/environments/studio-bg.jpg',
    hdriUrl: '/environments/studio.hdr',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    lighting: {
      color: '#ffffff',
      intensity: 1.0,
      azimuth: 0,
      elevation: 45
    },
    atmosphere: {
      fog: false,
      fogColor: '#ffffff',
      fogDensity: 0.1,
      particles: false
    },
    depth: {
      layers: 3,
      parallaxIntensity: 1.0,
      fieldOfView: 75
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk City',
    icon: '🌆',
    category: 'futuristic',
    description: 'Neon-lit cyberpunk cityscape',
    panoramicUrl: '/environments/cyberpunk-360.hdr',
    previewUrl: '/environments/cyberpunk-preview.jpg',
    backgroundImage: '/environments/cyberpunk-bg.jpg',
    hdriUrl: '/environments/cyberpunk.hdr',
    gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
    lighting: {
      color: '#ff00ff',
      intensity: 1.2,
      azimuth: 45,
      elevation: 30
    },
    atmosphere: {
      fog: true,
      fogColor: '#ff00ff',
      fogDensity: 0.3,
      particles: true
    },
    depth: {
      layers: 5,
      parallaxIntensity: 1.5,
      fieldOfView: 80
    }
  },
  {
    id: 'fantasy',
    name: 'Fantasy Realm',
    icon: '🏰',
    category: 'magical',
    description: 'Mystical fantasy landscape',
    panoramicUrl: '/environments/fantasy-360.hdr',
    previewUrl: '/environments/fantasy-preview.jpg',
    backgroundImage: '/environments/fantasy-bg.jpg',
    hdriUrl: '/environments/fantasy.hdr',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    lighting: {
      color: '#ffd700',
      intensity: 0.9,
      azimuth: 60,
      elevation: 60
    },
    atmosphere: {
      fog: true,
      fogColor: '#9370db',
      fogDensity: 0.2,
      particles: true
    },
    depth: {
      layers: 4,
      parallaxIntensity: 1.2,
      fieldOfView: 70
    }
  },
  {
    id: 'space',
    name: 'Deep Space',
    icon: '🌌',
    category: 'cosmic',
    description: 'Vast cosmic environment',
    panoramicUrl: '/environments/space-360.hdr',
    previewUrl: '/environments/space-preview.jpg',
    backgroundImage: '/environments/space-bg.jpg',
    hdriUrl: '/environments/space.hdr',
    gradient: 'radial-gradient(ellipse at center, #1e3c72 0%, #2a5298 100%)',
    lighting: {
      color: '#ffffff',
      intensity: 0.7,
      azimuth: 0,
      elevation: 90
    },
    atmosphere: {
      fog: false,
      fogColor: '#000000',
      fogDensity: 0.05,
      particles: true
    },
    depth: {
      layers: 6,
      parallaxIntensity: 2.0,
      fieldOfView: 85
    }
  },
  {
    id: 'retro',
    name: 'Retro Wave',
    icon: '🌴',
    category: 'nostalgic',
    description: '80s retro synthwave vibe',
    panoramicUrl: '/environments/retro-360.hdr',
    previewUrl: '/environments/retro-preview.jpg',
    backgroundImage: '/environments/retro-bg.jpg',
    hdriUrl: '/environments/retro.hdr',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    lighting: {
      color: '#ff1493',
      intensity: 1.1,
      azimuth: 30,
      elevation: 45
    },
    atmosphere: {
      fog: true,
      fogColor: '#ff1493',
      fogDensity: 0.25,
      particles: false
    },
    depth: {
      layers: 4,
      parallaxIntensity: 1.3,
      fieldOfView: 75
    }
  },
  {
    id: 'nature',
    name: 'Forest Grove',
    icon: '🌲',
    category: 'natural',
    description: 'Peaceful forest environment',
    panoramicUrl: '/environments/forest-360.hdr',
    previewUrl: '/environments/forest-preview.jpg',
    backgroundImage: '/environments/forest-bg.jpg',
    hdriUrl: '/environments/forest.hdr',
    gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    lighting: {
      color: '#90ee90',
      intensity: 0.8,
      azimuth: 45,
      elevation: 60
    },
    atmosphere: {
      fog: true,
      fogColor: '#90ee90',
      fogDensity: 0.15,
      particles: true
    },
    depth: {
      layers: 5,
      parallaxIntensity: 1.1,
      fieldOfView: 70
    }
  }
];
