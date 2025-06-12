import { ENHANCED_VISUAL_EFFECTS } from './effectConfigs';
import type { EffectValues } from './types';

// Physics-based effect calculations using realistic formulas
export const EFFECT_PHYSICS = {
  // Fresnel reflection formula: F = F0 + (1 - F0) * (1 - cos(θ))^5
  fresnel: (cosTheta: number, f0: number = 0.04): number => {
    return f0 + (1 - f0) * Math.pow(1 - cosTheta, 5);
  },

  // Realistic metallic reflection based on material properties
  metallicReflection: (metalness: number, roughness: number, lightAngle: number): number => {
    const f0 = 0.04 + (0.96 * metalness);
    const cosTheta = Math.cos(lightAngle * Math.PI / 180);
    return EFFECT_PHYSICS.fresnel(cosTheta, f0) * (1 - roughness);
  },

  // Holographic diffraction calculation
  holographicDiffraction: (viewAngle: number, complexity: number): number => {
    const wavelength = 550; // Green wavelength in nm
    const gratingSpacing = 1000 + (complexity * 200); // Variable grating
    return Math.sin(viewAngle * Math.PI / 180) * (wavelength / gratingSpacing);
  },

  // Light scattering for foil effects
  rayleighScattering: (particleSize: number, lightIntensity: number): number => {
    // Simplified Rayleigh scattering: I ∝ 1/λ^4 * (particle size factor)
    const scatteringCoeff = Math.pow(particleSize / 100, 4);
    return lightIntensity * scatteringCoeff * 0.3;
  }
};

// Create default effect values with starlight preset emphasis
export const createDefaultEffectValues = (): EffectValues => {
  const initialValues: EffectValues = {};
  ENHANCED_VISUAL_EFFECTS.forEach(effect => {
    initialValues[effect.id] = {};
    effect.parameters.forEach(param => {
      // Enhanced default values for immediate starlight vibrancy
      let defaultValue = param.defaultValue;
      
      // Starlight effect defaults - more prominent
      if (effect.id === 'foilspray' && param.id === 'intensity') {
        defaultValue = 35; // Increased starlight particles
      } else if (effect.id === 'foilspray' && param.id === 'density') {
        defaultValue = 80; // More dense sparkles
      } else if (effect.id === 'foilspray' && param.id === 'direction') {
        defaultValue = 135; // Diagonal flow
      } else if (effect.id === 'prizm' && param.id === 'intensity') {
        defaultValue = 25; // Visible rainbow spectrum
      } else if (effect.id === 'prizm' && param.id === 'complexity') {
        defaultValue = 4; // Balanced complexity
      } else if (effect.id === 'prizm' && param.id === 'colorSeparation') {
        defaultValue = 50; // Good color separation
      } else if (effect.id === 'holographic' && param.id === 'intensity') {
        defaultValue = 20; // Subtle holographic by default
      } else if (effect.id === 'gold' && param.id === 'intensity') {
        defaultValue = 15; // Subtle gold shimmer by default
      } else if (effect.id === 'crystal' && param.id === 'intensity') {
        defaultValue = 18; // Subtle crystal effect by default
      } else if (effect.id === 'chrome' && param.id === 'intensity') {
        defaultValue = 10; // Very subtle chrome by default
      }
      
      initialValues[effect.id][param.id] = defaultValue;
    });
  });
  return initialValues;
};

// Enhanced effect intensity clamping for smooth transitions with starlight optimization
export const clampEffectValue = (effectId: string, parameterId: string, value: number | boolean | string): number | boolean | string => {
  if (typeof value !== 'number') return value;
  
  // Apply smooth clamping for problematic effects with starlight-friendly limits
  const clampingRules: Record<string, Record<string, { soft: number; hard: number }>> = {
    prizm: {
      intensity: { soft: 85, hard: 100 }, // Allow full intensity for starlight
      complexity: { soft: 8, hard: 10 },
      colorSeparation: { soft: 90, hard: 100 }
    },
    foilspray: {
      intensity: { soft: 90, hard: 100 }, // Allow full intensity for starlight
      density: { soft: 90, hard: 100 },
      direction: { soft: 350, hard: 360 }
    },
    crystal: {
      intensity: { soft: 85, hard: 95 },
      dispersion: { soft: 90, hard: 100 }
    },
    holographic: {
      intensity: { soft: 90, hard: 100 },
      shiftSpeed: { soft: 200, hard: 250 }
    },
    gold: {
      intensity: { soft: 90, hard: 100 }
    },
    chrome: {
      intensity: { soft: 85, hard: 95 }
    }
  };
  
  const rule = clampingRules[effectId]?.[parameterId];
  if (rule && value > rule.soft) {
    // Apply gentle damping above soft limit - very permissive for starlight
    const overage = value - rule.soft;
    const damping = 1 - (overage / (rule.hard - rule.soft)) * 0.2; // Reduced clamping
    const clampedValue = rule.soft + (overage * Math.max(0.5, damping)); // Higher minimum
    
    console.log(`🌟 Starlight clamping ${effectId}.${parameterId}:`, { original: value, clamped: clampedValue });
    return Math.min(clampedValue, rule.hard);
  }
  
  return value;
};

// Helper function to apply starlight preset
export const createStarlightPreset = (): EffectValues => {
  return {
    foilspray: { 
      intensity: 65, 
      density: 80, 
      direction: 135 
    },
    prizm: { 
      intensity: 35, 
      complexity: 4, 
      colorSeparation: 50 
    }
  };
};
