
import { useCallback } from 'react';
import type { EffectValues } from './types';
import { ENHANCED_VISUAL_EFFECTS } from './effectConfigs';

export const useEffectValidation = (effectValues: EffectValues) => {
  const validateEffectState = useCallback(() => {
    console.log('🔍 Validating effect state...');
    
    let validationErrors: string[] = [];
    let totalActiveEffects = 0;

    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      const effectData = effectValues[effect.id];
      if (!effectData) {
        validationErrors.push(`Missing effect data for ${effect.id}`);
        return;
      }

      const intensity = effectData.intensity;
      if (typeof intensity === 'number' && intensity > 0) {
        totalActiveEffects++;
      }

      // Validate parameters
      effect.parameters.forEach(param => {
        const value = effectData[param.id];
        if (value === undefined || value === null) {
          validationErrors.push(`Missing parameter ${param.id} for effect ${effect.id}`);
        }
      });
    });

    if (validationErrors.length > 0) {
      console.warn('⚠️ Effect validation errors:', validationErrors);
    } else {
      console.log(`✅ Effect validation passed. ${totalActiveEffects} active effects.`);
    }

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
      activeEffectsCount: totalActiveEffects
    };
  }, [effectValues]);

  return { validateEffectState };
};
