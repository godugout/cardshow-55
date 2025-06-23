
import type { RarityMaterialPreset, EffectValues } from './types';

export const RARITY_MATERIAL_PRESETS: RarityMaterialPreset[] = [
  {
    id: 'common',
    name: 'Common Card',
    rarity: 'common',
    performanceScore: 10,
    effects: {
      vintage: { intensity: 20, aging: 10, wear: 5 },
      holographic: { intensity: 0, shiftSpeed: 50, rainbowSpread: 180, prismaticDepth: 50 },
      chrome: { intensity: 0, sharpness: 70, reflectivity: 80 },
      brushedmetal: { intensity: 0, direction: 0, roughness: 30 },
      crystal: { intensity: 0, facets: 8, clarity: 85 },
      interference: { intensity: 0, frequency: 50, amplitude: 30 },
      prizm: { intensity: 0, refraction: 60, dispersion: 40 },
      foilspray: { intensity: 0, density: 50, size: 30 },
      gold: { intensity: 0, warmth: 75, patina: 20 },
      aurora: { intensity: 0, flow: 40, colors: 70 },
      waves: { intensity: 0, speed: 30, amplitude: 40 },
      ice: { intensity: 0, frost: 60, cracks: 30 },
      lunar: { intensity: 0, dust: 50, craters: 40 }
    }
  },
  {
    id: 'uncommon',
    name: 'Uncommon Card',
    rarity: 'uncommon',
    performanceScore: 25,
    effects: {
      vintage: { intensity: 0, aging: 10, wear: 5 },
      holographic: { intensity: 15, shiftSpeed: 60, rainbowSpread: 200, prismaticDepth: 40 },
      chrome: { intensity: 0, sharpness: 70, reflectivity: 80 },
      brushedmetal: { intensity: 20, direction: 45, roughness: 25 },
      crystal: { intensity: 0, facets: 8, clarity: 85 },
      interference: { intensity: 0, frequency: 50, amplitude: 30 },
      prizm: { intensity: 0, refraction: 60, dispersion: 40 },
      foilspray: { intensity: 10, density: 30, size: 25 },
      gold: { intensity: 0, warmth: 75, patina: 20 },
      aurora: { intensity: 0, flow: 40, colors: 70 },
      waves: { intensity: 0, speed: 30, amplitude: 40 },
      ice: { intensity: 0, frost: 60, cracks: 30 },
      lunar: { intensity: 0, dust: 50, craters: 40 }
    }
  },
  {
    id: 'rare',
    name: 'Rare Card',
    rarity: 'rare',
    performanceScore: 50,
    effects: {
      vintage: { intensity: 0, aging: 10, wear: 5 },
      holographic: { intensity: 40, shiftSpeed: 80, rainbowSpread: 240, prismaticDepth: 60 },
      chrome: { intensity: 25, sharpness: 80, reflectivity: 85 },
      brushedmetal: { intensity: 0, direction: 45, roughness: 25 },
      crystal: { intensity: 0, facets: 8, clarity: 85 },
      interference: { intensity: 20, frequency: 60, amplitude: 40 },
      prizm: { intensity: 0, refraction: 60, dispersion: 40 },
      foilspray: { intensity: 25, density: 40, size: 30 },
      gold: { intensity: 0, warmth: 75, patina: 20 },
      aurora: { intensity: 0, flow: 40, colors: 70 },
      waves: { intensity: 15, speed: 35, amplitude: 30 },
      ice: { intensity: 0, frost: 60, cracks: 30 },
      lunar: { intensity: 0, dust: 50, craters: 40 }
    }
  },
  {
    id: 'ultra-rare',
    name: 'Ultra-Rare Card',
    rarity: 'ultra-rare',
    performanceScore: 75,
    effects: {
      vintage: { intensity: 0, aging: 10, wear: 5 },
      holographic: { intensity: 0, shiftSpeed: 80, rainbowSpread: 240, prismaticDepth: 60 },
      chrome: { intensity: 60, sharpness: 90, reflectivity: 95 },
      brushedmetal: { intensity: 0, direction: 45, roughness: 25 },
      crystal: { intensity: 35, facets: 12, clarity: 90 },
      interference: { intensity: 0, frequency: 60, amplitude: 40 },
      prizm: { intensity: 40, refraction: 70, dispersion: 50 },
      foilspray: { intensity: 0, density: 40, size: 30 },
      gold: { intensity: 30, warmth: 85, patina: 15 },
      aurora: { intensity: 25, flow: 50, colors: 80 },
      waves: { intensity: 0, speed: 35, amplitude: 30 },
      ice: { intensity: 0, frost: 60, cracks: 30 },
      lunar: { intensity: 0, dust: 50, craters: 40 }
    }
  },
  {
    id: 'legendary',
    name: 'Legendary Card',
    rarity: 'legendary',
    performanceScore: 100,
    effects: {
      vintage: { intensity: 0, aging: 10, wear: 5 },
      holographic: { intensity: 70, shiftSpeed: 120, rainbowSpread: 300, prismaticDepth: 80 },
      chrome: { intensity: 40, sharpness: 95, reflectivity: 90 },
      brushedmetal: { intensity: 0, direction: 45, roughness: 25 },
      crystal: { intensity: 0, facets: 12, clarity: 90 },
      interference: { intensity: 30, frequency: 80, amplitude: 60 },
      prizm: { intensity: 0, refraction: 70, dispersion: 50 },
      foilspray: { intensity: 45, density: 60, size: 40 },
      gold: { intensity: 55, warmth: 90, patina: 10 },
      aurora: { intensity: 60, flow: 70, colors: 95 },
      waves: { intensity: 35, speed: 50, amplitude: 50 },
      ice: { intensity: 0, frost: 60, cracks: 30 },
      lunar: { intensity: 0, dust: 50, craters: 40 }
    }
  }
];

export const getRarityPreset = (rarity: string): RarityMaterialPreset | null => {
  return RARITY_MATERIAL_PRESETS.find(preset => preset.rarity === rarity) || null;
};
