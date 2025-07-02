
import { useState, useCallback } from 'react';
import { createDefaultEffectValues, clampEffectValue } from './effectUtils';
import type { EffectValues } from './types';

export const useEffectStateManager = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>(createDefaultEffectValues);

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string, isPreset?: boolean) => {
    console.log('🎛️ Effect Change:', { effectId, parameterId, value, isPreset });
    
    // Apply clamping for smooth transitions
    const clampedValue = clampEffectValue(effectId, parameterId, value);
    
    setEffectValues(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [parameterId]: clampedValue
      }
    }));
  }, []);

  const resetEffect = useCallback((effectId: string) => {
    console.log('🔄 Resetting effect:', effectId);
    const defaultValues = createDefaultEffectValues();
    
    if (defaultValues[effectId]) {
      setEffectValues(prev => ({
        ...prev,
        [effectId]: { ...defaultValues[effectId] }
      }));
    }
  }, []);

  const resetAllEffects = useCallback(() => {
    console.log('🔄 Resetting all effects');
    setEffectValues(createDefaultEffectValues());
  }, []);

  return {
    effectValues,
    setEffectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects
  };
};
