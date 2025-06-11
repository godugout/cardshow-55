
import type { FlipConfig } from './types';

export const generateFlipConfig = (physicsEnabled: boolean): FlipConfig => {
  if (!physicsEnabled) {
    // Simple linear flip without physics
    return {
      duration: 400,
      direction: Math.random() > 0.5 ? 1 : -1,
      randomTilt: 0,
      bounceCount: 0,
      bounceDecay: 0
    };
  }

  // Physics-based flip with random elements
  return {
    duration: 600 + Math.random() * 200, // 600-800ms
    direction: Math.random() > 0.5 ? 1 : -1,
    randomTilt: (Math.random() - 0.5) * 8, // -4° to +4°
    bounceCount: Math.floor(Math.random() * 2) + 1, // 1-2 bounces
    bounceDecay: 0.4 + Math.random() * 0.2 // 0.4-0.6 decay
  };
};
