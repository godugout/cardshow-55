
import { useState, useCallback } from 'react';
import type { EnvironmentControls } from '../types';
import { ENHANCED_VISUAL_EFFECTS } from './effects/effectConfigs';
import type { VisualEffectConfig } from './effects/types';

export interface EffectValues {
  holographic: number;
  chrome: number;
  foil: number;
  vintage: number;
  prismatic: number;
  aurora: number;
  crystal: number;
  lunar: number;
  waves: number;
  interference: number;
  gold: number;
  ice: number;
  prizm: number;
  foilSpray: number;
}

// Re-export the effects configuration and types for convenience
export { ENHANCED_VISUAL_EFFECTS };
export type { VisualEffectConfig };

export const useEnhancedCardEffects = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>({
    holographic: 0,
    chrome: 0,
    foil: 0,
    vintage: 0,
    prismatic: 0,
    aurora: 0,
    crystal: 0,
    lunar: 0,
    waves: 0,
    interference: 0,
    gold: 0,
    ice: 0,
    prizm: 0,
    foilSpray: 0
  });

  const [isApplyingPreset, setIsApplyingPreset] = useState(false);
  const [environmentControls, setEnvironmentControls] = useState<EnvironmentControls>({
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  });

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: string | number | boolean) => {
    setEffectValues(prev => ({
      ...prev,
      [effectId]: typeof value === 'number' ? value : Number(value)
    }));
  }, []);

  const resetEffect = useCallback((effectId: string) => {
    setEffectValues(prev => ({
      ...prev,
      [effectId]: 0
    }));
  }, []);

  const handleApplyCombo = useCallback(async (presetId: string) => {
    setIsApplyingPreset(true);
    
    // Simulate applying a preset combination
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Apply some default preset values based on presetId
    const presetEffects: Record<string, Partial<EffectValues>> = {
      'holographic-chrome': { holographic: 80, chrome: 60 },
      'vintage-gold': { vintage: 70, gold: 50 },
      'crystal-aurora': { crystal: 75, aurora: 65 },
      'prismatic-waves': { prismatic: 80, waves: 55 }
    };

    if (presetEffects[presetId]) {
      setEffectValues(prev => ({ ...prev, ...presetEffects[presetId] }));
    }
    
    setIsApplyingPreset(false);
  }, []);

  const resetAllEffects = useCallback(() => {
    setEffectValues({
      holographic: 0,
      chrome: 0,
      foil: 0,
      vintage: 0,
      prismatic: 0,
      aurora: 0,
      crystal: 0,
      lunar: 0,
      waves: 0,
      interference: 0,
      gold: 0,
      ice: 0,
      prizm: 0,
      foilSpray: 0
    });
  }, []);

  const applyPreset = useCallback((presetEffects: Partial<EffectValues>) => {
    setEffectValues(prev => ({ ...prev, ...presetEffects }));
  }, []);

  const validateEffectState = useCallback(() => {
    return Object.values(effectValues).some(value => value > 0);
  }, [effectValues]);

  return {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset,
    handleApplyCombo,
    isApplyingPreset,
    environmentControls,
    setEnvironmentControls,
    validateEffectState
  };
};
