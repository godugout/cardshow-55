
import { useState, useCallback } from 'react';

export interface SimpleEffectValues {
  holographic: number;
  chrome: number;
  gold: number;
  vintage: number;
  foilspray: number;
  aurora: number;
  crystal: number;
  prizm: number;
  interference: number;
  brushedmetal: number;
  ice: number;
  lunar: number;
  waves: number;
}

const defaultEffectValues: SimpleEffectValues = {
  holographic: 0,
  chrome: 0,
  gold: 0,
  vintage: 0,
  foilspray: 0,
  aurora: 0,
  crystal: 0,
  prizm: 0,
  interference: 0,
  brushedmetal: 0,
  ice: 0,
  lunar: 0,
  waves: 0
};

export const useSimpleCardEffects = () => {
  const [effectValues, setEffectValues] = useState<SimpleEffectValues>(defaultEffectValues);

  const updateEffect = useCallback((effectId: keyof SimpleEffectValues, value: number) => {
    setEffectValues(prev => ({
      ...prev,
      [effectId]: Math.max(0, Math.min(100, value))
    }));
  }, []);

  const resetAllEffects = useCallback(() => {
    setEffectValues(defaultEffectValues);
  }, []);

  const resetEffect = useCallback((effectId: keyof SimpleEffectValues) => {
    setEffectValues(prev => ({
      ...prev,
      [effectId]: 0
    }));
  }, []);

  return {
    effectValues,
    updateEffect,
    resetAllEffects,
    resetEffect
  };
};
