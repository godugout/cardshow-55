
import { useState, useCallback } from 'react';
import { createDefaultEffectValues, clampEffectValue } from './effectUtils';
import type { EffectValues } from './types';

export const useEffectStateManager = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>(() => {
    const defaults = createDefaultEffectValues();
    // Initialize with a minimal effect to ensure proper material selection
    if (defaults.brushedmetal) {
      defaults.brushedmetal.intensity = 8; // Slightly higher for visibility
    }
    console.log('🎛️ Initialized effect values:', defaults);
    return defaults;
  });

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string, isPreset?: boolean) => {
    console.log('🎛️ Effect Change Applied:', { effectId, parameterId, value, isPreset });
    
    // Apply clamping for smooth transitions
    const clampedValue = clampEffectValue(effectId, parameterId, value);
    
    setEffectValues(prev => {
      const updated = {
        ...prev,
        [effectId]: {
          ...prev[effectId],
          [parameterId]: clampedValue
        }
      };
      console.log('🎛️ Updated effect values:', updated);
      console.log('🎛️ Effect state updated successfully');
      return updated;
    });
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
    console.log('🔄 Resetting all effects and ensuring back is visible');
    const defaults = createDefaultEffectValues();
    if (defaults.brushedmetal) {
      defaults.brushedmetal.intensity = 8;
    }
    setEffectValues(defaults);
    console.log('🔄 All effects reset to defaults');
  }, []);

  return {
    effectValues,
    setEffectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects
  };
};
