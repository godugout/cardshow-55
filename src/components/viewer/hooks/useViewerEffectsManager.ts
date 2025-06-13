
import { useState, useCallback, useEffect } from 'react';
import { 
  useEnhancedCardEffects, 
  type EffectValues 
} from './useEnhancedCardEffects';
import { useCardEffects } from './useCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface UseViewerEffectsManagerParams {
  card: any;
  mousePosition: { x: number; y: number };
  showEffects: boolean;
  overallBrightness: number[];
  interactiveLighting: boolean;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  zoom: number;
  rotation: { x: number; y: number };
  isHovering: boolean;
  onEffectValuesChange: (values: EffectValues) => void;
  onPresetStateChange: (state: any) => void;
}

export const useViewerEffectsManager = (params: UseViewerEffectsManagerParams) => {
  const {
    card,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation,
    isHovering,
    onEffectValuesChange,
    onPresetStateChange
  } = params;

  // Enhanced effects hook
  const enhancedEffectsHook = useEnhancedCardEffects();
  const {
    effectValues,
    handleEffectChange,
    resetAllEffects,
    applyPreset,
    isApplyingPreset,
    validateEffectState,
    presetState
  } = enhancedEffectsHook;

  // Style generation hook
  const { getFrameStyles, getEnhancedEffectStyles, SurfaceTexture } = useCardEffects({
    card,
    effectValues,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation,
    isHovering
  });

  // Enhanced combo application with validation
  const handleComboApplication = useCallback((combo: any) => {
    console.log('🚀 Applying combo with enhanced synchronization:', combo.id);
    
    validateEffectState();
    applyPreset(combo.effects, combo.id);
    
    if (combo.scene) {
      onPresetStateChange({ selectedScene: combo.scene });
    }
    if (combo.lighting) {
      onPresetStateChange({ selectedLighting: combo.lighting });
    }
  }, [applyPreset, validateEffectState, onPresetStateChange]);

  // Enhanced manual effect change with state tracking
  const handleManualEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    if (!isApplyingPreset) {
      onPresetStateChange({ selectedPresetId: undefined });
    }
    handleEffectChange(effectId, parameterId, value);
  }, [handleEffectChange, isApplyingPreset, onPresetStateChange]);

  // Enhanced state validation on card change
  useEffect(() => {
    if (card) {
      validateEffectState();
    }
  }, [card, validateEffectState]);

  // Enhanced reset that includes all state
  const handleResetWithEffects = useCallback(() => {
    resetAllEffects();
    validateEffectState();
    onPresetStateChange({ reset: true });
  }, [resetAllEffects, validateEffectState, onPresetStateChange]);

  // Notify parent of effect values changes
  useEffect(() => {
    onEffectValuesChange(effectValues);
  }, [effectValues, onEffectValuesChange]);

  return {
    effectValues,
    handleEffectChange: handleManualEffectChange,
    resetAllEffects: handleResetWithEffects,
    applyPreset,
    isApplyingPreset,
    handleComboApplication,
    frameStyles: getFrameStyles(),
    enhancedEffectStyles: getEnhancedEffectStyles(),
    SurfaceTexture,
    presetState
  };
};
