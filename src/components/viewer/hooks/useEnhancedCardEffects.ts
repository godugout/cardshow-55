
import { useState, useCallback } from 'react';
import { ENHANCED_VISUAL_EFFECTS } from './effects/effectConfigs';
import { clampEffectValue, createDefaultEffectValues } from './effects/effectUtils';
import { usePresetApplication } from './effects/usePresetApplication';
import type { EffectValues, VisualEffectConfig, EffectParameter } from './effects/types';

// Re-export types for backward compatibility
export type { EffectValues, VisualEffectConfig, EffectParameter };
export { ENHANCED_VISUAL_EFFECTS };

export const useEnhancedCardEffects = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>(createDefaultEffectValues);

  const { 
    presetState, 
    applyPreset: applyPresetBase, 
    setPresetState, 
    isApplyingPreset,
    clearTimeouts 
  } = usePresetApplication();

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    console.log('🎛️ Effect Change:', { effectId, parameterId, value, presetState });
    
    // Apply clamping for smooth transitions
    const clampedValue = clampEffectValue(effectId, parameterId, value);
    
    // Clear preset state when manual changes are made (unless locked)
    if (!presetState.isApplying && !presetState.isLocked) {
      setPresetState(prev => ({ 
        ...prev, 
        currentPresetId: undefined,
        sequenceId: `manual-${Date.now()}`
      }));
    }
    
    setEffectValues(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [parameterId]: clampedValue
      }
    }));
  }, [presetState.isApplying, presetState.isLocked, setPresetState]);

  const resetEffect = useCallback((effectId: string) => {
    console.log('🔄 Resetting effect:', effectId);
    const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
    if (effect) {
      const resetValues: Record<string, any> = {};
      effect.parameters.forEach(param => {
        resetValues[param.id] = param.defaultValue;
      });
      setEffectValues(prev => ({
        ...prev,
        [effectId]: resetValues
      }));
    }
  }, []);

  const resetAllEffects = useCallback(() => {
    console.log('🔄 Resetting all effects with cleanup');
    
    // Clear all timeouts
    clearTimeouts();
    
    setPresetState({ 
      isApplying: false, 
      appliedAt: Date.now(), 
      isLocked: false,
      sequenceId: `reset-${Date.now()}`
    });
    
    setEffectValues(createDefaultEffectValues());
  }, [clearTimeouts, setPresetState]);

  // Wrapper for the applyPreset function with effectValues
  const applyPreset = useCallback((preset: EffectValues, presetId?: string) => {
    applyPresetBase(preset, setEffectValues, presetId);
  }, [applyPresetBase]);

  // Enhanced state validation
  const validateEffectState = useCallback(() => {
    console.log('🔍 Validating effect state consistency');
    // Add any necessary state consistency checks here
  }, []);

  return {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset,
    presetState,
    isApplyingPreset,
    validateEffectState
  };
};
