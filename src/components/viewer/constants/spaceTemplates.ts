
import type { SpaceTemplate } from '../types/spaces';

export const SPACE_TEMPLATES: SpaceTemplate[] = [
  {
    id: 'gallery-wall',
    name: 'Gallery Wall',
    description: 'Cards displayed on an illuminated wall with spotlights',
    emoji: '🖼️',
    category: 'gallery',
    maxCards: 9,
    defaultPositions: [
      { x: -2, y: 1, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 2, y: 1, z: 0 },
      { x: -2, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0, z: 0 },
      { x: -2, y: -1, z: 0 }, { x: 0, y: -1, z: 0 }, { x: 2, y: -1, z: 0 }
    ],
    cameraPosition: { x: 0, y: 0, z: 6 },
    cameraTarget: { x: 0, y: 0, z: 0 },
    environment: {
      background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
      lighting: 'warm',
      fog: { color: '#1a1a1a', near: 8, far: 20 }
    }
  },
  {
    id: 'circular-stadium',
    name: 'Circular Stadium',
    description: 'Cards arranged in a circular formation like a stadium',
    emoji: '🏟️',
    category: 'stadium',
    maxCards: 12,
    defaultPositions: [
      { x: 3, y: 0, z: 0 }, { x: 2.6, y: 0, z: 1.5 }, { x: 1.5, y: 0, z: 2.6 },
      { x: 0, y: 0, z: 3 }, { x: -1.5, y: 0, z: 2.6 }, { x: -2.6, y: 0, z: 1.5 },
      { x: -3, y: 0, z: 0 }, { x: -2.6, y: 0, z: -1.5 }, { x: -1.5, y: 0, z: -2.6 },
      { x: 0, y: 0, z: -3 }, { x: 1.5, y: 0, z: -2.6 }, { x: 2.6, y: 0, z: -1.5 }
    ],
    cameraPosition: { x: 0, y: 4, z: 8 },
    cameraTarget: { x: 0, y: 0, z: 0 },
    environment: {
      background: 'radial-gradient(circle, #0f1419 0%, #1a252f 100%)',
      lighting: 'dramatic',
      fog: { color: '#0f1419', near: 10, far: 25 }
    }
  },
  {
    id: 'floating-constellation',
    name: 'Floating Constellation',
    description: 'Cards floating in 3D space like stars in a constellation',
    emoji: '✨',
    category: 'constellation',
    maxCards: 15,
    defaultPositions: [
      { x: 0, y: 2, z: 0 }, { x: -1.5, y: 1.5, z: -1 }, { x: 1.5, y: 1.5, z: 1 },
      { x: -2, y: 0.5, z: 0.5 }, { x: 2, y: 0.5, z: -0.5 }, { x: 0, y: 0, z: -2 },
      { x: -1, y: -0.5, z: 1.5 }, { x: 1, y: -0.5, z: -1.5 }, { x: 0, y: -1, z: 0 },
      { x: -2.5, y: 1, z: 2 }, { x: 2.5, y: 1, z: -2 }, { x: -1, y: 2.5, z: 0 },
      { x: 1, y: -1.5, z: 2.5 }, { x: 0, y: 1, z: 3 }, { x: -3, y: -1, z: -1 }
    ],
    cameraPosition: { x: 0, y: 0, z: 10 },
    cameraTarget: { x: 0, y: 0, z: 0 },
    environment: {
      background: 'radial-gradient(ellipse, #0a0a23 0%, #000 100%)',
      lighting: 'cool',
      fog: { color: '#0a0a23', near: 12, far: 30 }
    }
  },
  {
    id: 'museum-showcase',
    name: 'Museum Showcase',
    description: 'Professional museum-style display with pedestals',
    emoji: '🏛️',
    category: 'museum',
    maxCards: 6,
    defaultPositions: [
      { x: -3, y: 0.5, z: -1 }, { x: -1, y: 0.5, z: -1 }, { x: 1, y: 0.5, z: -1 },
      { x: 3, y: 0.5, z: -1 }, { x: -2, y: 0.5, z: 1 }, { x: 2, y: 0.5, z: 1 }
    ],
    cameraPosition: { x: 0, y: 2, z: 5 },
    cameraTarget: { x: 0, y: 0.5, z: 0 },
    environment: {
      background: 'linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)',
      lighting: 'neutral',
      fog: { color: '#f0f0f0', near: 8, far: 20 }
    }
  }
];
