
import React, { useCallback } from 'react';
import { ENHANCED_VISUAL_EFFECTS } from './effects/effectConfigs';
import { usePresetApplication } from './effects/usePresetApplication';
import { useEffectStateManager } from './effects/useEffectStateManager';
import { useEffectValidation } from './effects/useEffectValidation';
import { calculateEffectIntensity, clampEffectValue, createDefaultEffectValues } from './effects/effectUtils';
import type { EffectValues, VisualEffectConfig, EffectParameter } from './effects/types';

// Re-export types for backward compatibility
export type { EffectValues, VisualEffectConfig, EffectParameter };
export { ENHANCED_VISUAL_EFFECTS };

export const useEnhancedCardEffects = () => {
  // Use specialized hooks for different concerns
  const {
    effectValues,
    setEffectValues,
    handleEffectChange: handleEffectChangeBase,
    resetEffect,
    resetAllEffects: resetAllEffectsBase
  } = useEffectStateManager();

  const { validateEffectState } = useEffectValidation(effectValues);

  const { 
    presetState, 
    applyPreset: applyPresetBase, 
    setPresetState, 
    isApplyingPreset,
    clearTimeouts 
  } = usePresetApplication();

  // Enhanced handleEffectChange with physics-based calculations
  const handleEffectChange = useCallback((
    effectId: string, 
    parameterId: string, 
    value: number | boolean | string,
    mousePosition?: { x: number; y: number },
    materialSettings?: { metalness: number; roughness: number }
  ) => {
    // Apply physics-based clamping and calculations
    let processedValue = clampEffectValue(effectId, parameterId, value);
    
    if (typeof processedValue === 'number' && mousePosition) {
      processedValue = calculateEffectIntensity(
        effectId, 
        parameterId, 
        processedValue, 
        mousePosition,
        materialSettings
      );
    }
    
    // Clear preset state when manual changes are made (unless locked)
    if (!presetState.isApplying && !presetState.isLocked) {
      setPresetState(prev => ({ 
        ...prev, 
        currentPresetId: undefined,
        sequenceId: `manual-${Date.now()}`
      }));
    }
    
    // Call the base implementation with processed value
    handleEffectChangeBase(effectId, parameterId, processedValue);
    
  }, [presetState.isApplying, presetState.isLocked, setPresetState, handleEffectChangeBase]);

  // Enhanced resetAllEffects with optimized defaults
  const resetAllEffects = useCallback(() => {
    console.log('🔄 Resetting to optimized default effects');
    
    // Clear all timeouts
    clearTimeouts();
    
    // Reset preset state
    setPresetState({ 
      isApplying: false, 
      appliedAt: Date.now(), 
      isLocked: false,
      sequenceId: `reset-${Date.now()}`
    });
    
    // Apply optimized defaults instead of empty state
    const optimizedDefaults = createDefaultEffectValues();
    setEffectValues(optimizedDefaults);
    
  }, [clearTimeouts, setPresetState, setEffectValues]);

  // Wrapper for the applyPreset function with effectValues
  const applyPreset = useCallback((preset: EffectValues, presetId?: string) => {
    console.log('🎨 Applying optimized preset:', presetId);
    applyPresetBase(preset, setEffectValues, presetId);
  }, [applyPresetBase, setEffectValues]);

  // Initialize with optimized defaults if empty
  React.useEffect(() => {
    if (!effectValues || Object.keys(effectValues).length === 0) {
      const optimizedDefaults = createDefaultEffectValues();
      setEffectValues(optimizedDefaults);
    }
  }, [effectValues, setEffectValues]);

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
