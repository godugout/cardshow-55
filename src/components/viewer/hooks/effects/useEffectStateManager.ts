
import { useState, useCallback, useRef, useEffect } from 'react';
import { createDefaultEffectValues, clampEffectValue } from './effectUtils';
import type { EffectValues } from './types';

export const useEffectStateManager = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>(createDefaultEffectValues);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string, isPreset?: boolean) => {
    if (!isMountedRef.current) return;
    
    console.log('🎛️ Effect Change:', { effectId, parameterId, value, isPreset });
    
    const clampedValue = clampEffectValue(effectId, parameterId, value);
    
    setEffectValues(prev => {
      if (!isMountedRef.current) return prev;
      
      return {
        ...prev,
        [effectId]: {
          ...prev[effectId],
          [parameterId]: clampedValue
        }
      };
    });
  }, []);

  const resetEffect = useCallback((effectId: string) => {
    if (!isMountedRef.current) return;
    
    console.log('🔄 Resetting effect:', effectId);
    const defaultValues = createDefaultEffectValues();
    
    if (defaultValues[effectId]) {
      setEffectValues(prev => {
        if (!isMountedRef.current) return prev;
        
        return {
          ...prev,
          [effectId]: { ...defaultValues[effectId] }
        };
      });
    }
  }, []);

  const resetAllEffects = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('🔄 Resetting all effects');
    setEffectValues(createDefaultEffectValues());
  }, []);

  return {
    effectValues,
    setEffectValues: useCallback((values: EffectValues | ((prev: EffectValues) => EffectValues)) => {
      if (!isMountedRef.current) return;
      setEffectValues(values);
    }, []),
    handleEffectChange,
    resetEffect,
    resetAllEffects
  };
};
