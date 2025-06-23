
import type { VisualEffectConfig } from './types';

export const ENHANCED_VISUAL_EFFECTS: VisualEffectConfig[] = [
  // Prismatic Effects
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Rainbow interference patterns that shift with viewing angle',
    category: 'prismatic',
    performanceImpact: 'medium',
    mobileSupported: true,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'shiftSpeed', name: 'Shift Speed', type: 'slider', defaultValue: 50, min: 0, max: 300, step: 10 },
      { id: 'rainbowSpread', name: 'Rainbow Spread', type: 'slider', defaultValue: 180, min: 0, max: 360, step: 10 },
      { id: 'prismaticDepth', name: 'Prismatic Depth', type: 'slider', defaultValue: 50, min: 0, max: 100, step: 5 }
    ]
  },
  {
    id: 'interference',
    name: 'Interference',
    description: 'Optical interference patterns with wave-like distortions',
    category: 'prismatic',
    performanceImpact: 'medium',
    mobileSupported: true,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'frequency', name: 'Frequency', type: 'slider', defaultValue: 50, min: 0, max: 100, step: 5 },
      { id: 'amplitude', name: 'Amplitude', type: 'slider', defaultValue: 30, min: 0, max: 100, step: 5 }
    ]
  },
  {
    id: 'prizm',
    name: 'Prizm',
    description: 'Prismatic refraction effects with color separation',
    category: 'prismatic',
    performanceImpact: 'high',
    mobileSupported: false,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'refraction', name: 'Refraction', type: 'slider', defaultValue: 60, min: 0, max: 100, step: 5 },
      { id: 'dispersion', name: 'Dispersion', type: 'slider', defaultValue: 40, min: 0, max: 100, step: 5 }
    ]
  },

  // Metallic Effects
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Mirror-like metallic finish with environment reflections',
    category: 'metallic',
    performanceImpact: 'medium',
    mobileSupported: true,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'sharpness', name: 'Sharpness', type: 'slider', defaultValue: 70, min: 0, max: 100, step: 5 },
      { id: 'reflectivity', name: 'Reflectivity', type: 'slider', defaultValue: 80, min: 0, max: 100, step: 5 }
    ]
  },
  {
    id: 'brushedmetal',
    name: 'Brushed Metal',
    description: 'Anisotropic metal finish with directional highlights',
    category: 'metallic',
    performanceImpact: 'low',
    mobileSupported: true,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'direction', name: 'Direction', type: 'slider', defaultValue: 0, min: 0, max: 360, step: 15 },
      { id: 'roughness', name: 'Roughness', type: 'slider', defaultValue: 30, min: 0, max: 100, step: 5 }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Luxurious gold finish with warm metallic highlights',
    category: 'metallic',
    performanceImpact: 'medium',
    mobileSupported: true,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'warmth', name: 'Warmth', type: 'slider', defaultValue: 75, min: 0, max: 100, step: 5 },
      { id: 'patina', name: 'Patina', type: 'slider', defaultValue: 20, min: 0, max: 100, step: 5 }
    ]
  },

  // Surface Effects
  {
    id: 'crystal',
    name: 'Crystal',
    description: 'Crystalline surface with faceted reflections',
    category: 'surface',
    performanceImpact: 'high',
    mobileSupported: false,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'facets', name: 'Facets', type: 'slider', defaultValue: 8, min: 3, max: 20, step: 1 },
      { id: 'clarity', name: 'Clarity', type: 'slider', defaultValue: 85, min: 0, max: 100, step: 5 }
    ]
  },
  {
    id: 'foilspray',
    name: 'Foil Spray',
    description: 'Scattered metallic particles with sparkle effects',
    category: 'surface',
    performanceImpact: 'medium',
    mobileSupported: true,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'density', name: 'Density', type: 'slider', defaultValue: 50, min: 0, max: 100, step: 5 },
      { id: 'size', name: 'Size', type: 'slider', defaultValue: 30, min: 0, max: 100, step: 5 }
    ]
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Northern lights effect with flowing colors',
    category: 'surface',
    performanceImpact: 'high',
    mobileSupported: false,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'flow', name: 'Flow Speed', type: 'slider', defaultValue: 40, min: 0, max: 100, step: 5 },
      { id: 'colors', name: 'Color Range', type: 'slider', defaultValue: 70, min: 0, max: 100, step: 5 }
    ]
  },
  {
    id: 'waves',
    name: 'Waves',
    description: 'Flowing wave patterns with depth and movement',
    category: 'surface',
    performanceImpact: 'medium',
    mobileSupported: true,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'speed', name: 'Wave Speed', type: 'slider', defaultValue: 30, min: 0, max: 100, step: 5 },
      { id: 'amplitude', name: 'Amplitude', type: 'slider', defaultValue: 40, min: 0, max: 100, step: 5 }
    ]
  },
  {
    id: 'ice',
    name: 'Ice',
    description: 'Frozen surface with crystalline scratches and frost',
    category: 'surface',
    performanceImpact: 'medium',
    mobileSupported: true,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'frost', name: 'Frost Level', type: 'slider', defaultValue: 60, min: 0, max: 100, step: 5 },
      { id: 'cracks', name: 'Ice Cracks', type: 'slider', defaultValue: 30, min: 0, max: 100, step: 5 }
    ]
  },
  {
    id: 'lunar',
    name: 'Lunar',
    description: 'Moon dust and retro space aesthetic',
    category: 'surface',
    performanceImpact: 'low',
    mobileSupported: true,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'dust', name: 'Moon Dust', type: 'slider', defaultValue: 50, min: 0, max: 100, step: 5 },
      { id: 'craters', name: 'Surface Texture', type: 'slider', defaultValue: 40, min: 0, max: 100, step: 5 }
    ]
  },

  // Vintage Effects
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged cardstock with realistic wear patterns',
    category: 'vintage',
    performanceImpact: 'low',
    mobileSupported: true,
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', defaultValue: 0, min: 0, max: 100, step: 1 },
      { id: 'aging', name: 'Paper Aging', type: 'slider', defaultValue: 40, min: 0, max: 100, step: 5 },
      { id: 'wear', name: 'Edge Wear', type: 'slider', defaultValue: 30, min: 0, max: 100, step: 5 }
    ]
  }
];
