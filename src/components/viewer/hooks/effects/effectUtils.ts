
import { ENHANCED_VISUAL_EFFECTS } from './effectConfigs';
import type { EffectValues } from './types';

// Create default effect values with more vibrant settings
export const createDefaultEffectValues = (): EffectValues => {
  const initialValues: EffectValues = {};
  ENHANCED_VISUAL_EFFECTS.forEach(effect => {
    initialValues[effect.id] = {};
    effect.parameters.forEach(param => {
      // Enhanced default values for better visual impact
      let defaultValue = param.defaultValue;
      
      // Set some effects to have non-zero defaults for immediate vibrancy
      if (effect.id === 'holographic' && param.id === 'intensity') {
        defaultValue = 25; // Subtle holographic by default
      } else if (effect.id === 'gold' && param.id === 'intensity') {
        defaultValue = 15; // Subtle gold shimmer by default
      } else if (effect.id === 'crystal' && param.id === 'intensity') {
        defaultValue = 20; // Subtle crystal effect by default
      } else if (effect.id === 'chrome' && param.id === 'intensity') {
        defaultValue = 10; // Very subtle chrome by default
      }
      
      initialValues[effect.id][param.id] = defaultValue;
    });
  });
  return initialValues;
};

// Enhanced effect intensity clamping for smooth transitions with better ranges
export const clampEffectValue = (effectId: string, parameterId: string, value: number | boolean | string): number | boolean | string => {
  if (typeof value !== 'number') return value;
  
  // Apply smooth clamping for problematic effects with more permissive limits
  const clampingRules: Record<string, Record<string, { soft: number; hard: number }>> = {
    prizm: {
      intensity: { soft: 80, hard: 95 }, // More permissive than before
      complexity: { soft: 9, hard: 10 },
      colorSeparation: { soft: 85, hard: 95 }
    },
    crystal: {
      intensity: { soft: 85, hard: 95 },
      dispersion: { soft: 90, hard: 100 }
    },
    holographic: {
      intensity: { soft: 90, hard: 100 }, // Allow higher intensities
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
    // Apply smooth damping above soft limit - less aggressive than before
    const overage = value - rule.soft;
    const damping = 1 - (overage / (rule.hard - rule.soft)) * 0.3; // Reduced from 0.5
    const clampedValue = rule.soft + (overage * Math.max(0.3, damping)); // Increased minimum from 0.1
    
    console.log(`🎛️ Clamping ${effectId}.${parameterId}:`, { original: value, clamped: clampedValue });
    return Math.min(clampedValue, rule.hard);
  }
  
  return value;
};
