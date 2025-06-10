
import type { EnvironmentScene } from '../types';

export const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'studio',
    name: 'Studio',
    icon: '🎬',
    category: 'professional',
    description: 'Clean studio environment',
    panoramicUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=2048&h=1024&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=2048&h=1024&fit=crop',
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
    panoramicUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=2048&h=1024&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=2048&h=1024&fit=crop',
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
    id: 'space',
    name: 'Deep Space',
    icon: '🌌',
    category: 'cosmic',
    description: 'Vast cosmic environment',
    panoramicUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=2048&h=1024&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=2048&h=1024&fit=crop',
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
    id: 'forest',
    name: 'Forest Grove',
    icon: '🌲',
    category: 'natural',
    description: 'Peaceful forest environment',
    panoramicUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop',
    previewUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&h=1024&fit=crop',
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
