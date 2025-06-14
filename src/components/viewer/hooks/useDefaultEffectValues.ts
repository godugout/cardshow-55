
import { useMemo } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

export const useDefaultEffectValues = (effectValues?: EffectValues): EffectValues => {
  return useMemo(() => {
    const defaultValues: EffectValues = {
      holographic: { intensity: 0 },
      crystal: { intensity: 0 },
      chrome: { intensity: 0 },
      brushedmetal: { intensity: 0 },
      gold: { intensity: 0, goldTone: 'classic' },
      vintage: { intensity: 0 },
      prizm: { intensity: 0 },
      interference: { intensity: 0 },
      foilspray: { intensity: 0 },
      aurora: { intensity: 0 },
      ice: { intensity: 0 },
      lunar: { intensity: 0 },
      waves: { intensity: 0 }
    };

    // Merge provided values with defaults
    if (!effectValues) {
      return defaultValues;
    }

    const merged: EffectValues = { ...defaultValues };
    
    Object.keys(effectValues).forEach(key => {
      if (effectValues[key]) {
        merged[key] = { ...defaultValues[key], ...effectValues[key] };
      }
    });

    return merged;
  }, [effectValues]);
};
