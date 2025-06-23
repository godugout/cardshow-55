
import { useState, useCallback } from 'react';
import type { EffectValues } from './types';
import { ENHANCED_VISUAL_EFFECTS } from './effectConfigs';

export const useEffectStateManager = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>(() => {
    // Initialize with default values
    const initialValues: EffectValues = {};
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      initialValues[effect.id] = {};
      effect.parameters.forEach(param => {
        initialValues[effect.id][param.id] = param.defaultValue;
      });
    });
    return initialValues;
  });

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    setEffectValues(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [parameterId]: value
      }
    }));
  }, []);

  const resetEffect = useCallback((effectId: string) => {
    const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
    if (!effect) return;

    const resetValues: { [key: string]: number | boolean | string } = {};
    effect.parameters.forEach(param => {
      resetValues[param.id] = param.defaultValue;
    });

    setEffectValues(prev => ({
      ...prev,
      [effectId]: resetValues
    }));
  }, []);

  const resetAllEffects = useCallback(() => {
    const resetValues: EffectValues = {};
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      resetValues[effect.id] = {};
      effect.parameters.forEach(param => {
        resetValues[effect.id][param.id] = param.defaultValue;
      });
    });
    setEffectValues(resetValues);
  }, []);

  return {
    effectValues,
    setEffectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects
  };
};
