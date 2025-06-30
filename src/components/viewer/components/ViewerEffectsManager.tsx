
import React, { useCallback, useEffect } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { useEnhancedCardEffects } from '../hooks/useEnhancedCardEffects';
import { useCardEffects } from '../hooks/useCardEffects';
import type { ViewerState } from '../types/ImmersiveViewerTypes';

interface ViewerEffectsManagerProps {
  card: CardData;
  viewerState: ViewerState;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  onApplyPreset: (preset: EffectValues, presetId?: string) => void;
  onValidateEffectState: () => void;
  children: (props: {
    effectValues: EffectValues;
    handleEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
    resetAllEffects: () => void;
    applyPreset: (preset: EffectValues, presetId?: string) => void;
    validateEffectState: () => void;
    isApplyingPreset: boolean;
    frameStyles: React.CSSProperties;
    enhancedEffectStyles: React.CSSProperties;
    surfaceTextureStyles: React.CSSProperties;
  }) => React.ReactNode;
}

export const ViewerEffectsManager: React.FC<ViewerEffectsManagerProps> = ({
  card,
  viewerState,
  onEffectChange,
  onResetAllEffects,
  onApplyPreset,
  onValidateEffectState,
  children
}) => {
  // Enhanced effects hook
  const enhancedEffectsHook = useEnhancedCardEffects();
  const {
    effectValues,
    handleEffectChange,
    resetAllEffects,
    applyPreset,
    isApplyingPreset,
    validateEffectState
  } = enhancedEffectsHook;

  // Style generation hook
  const { getFrameStyles, getEnhancedEffectStyles, surfaceTextureStyles } = useCardEffects(card);

  // Enhanced state validation on card change
  useEffect(() => {
    if (card) {
      validateEffectState();
      onValidateEffectState();
    }
  }, [card, validateEffectState, onValidateEffectState]);

  // Enhanced manual effect change with better state management
  const handleManualEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    console.log('🎛️ ViewerEffectsManager: Manual effect change:', { effectId, parameterId, value });
    
    // Apply the change without clearing preset if we're not in application mode
    if (!isApplyingPreset) {
      console.log('🔄 Manual change detected, maintaining effect continuity');
    }
    
    handleEffectChange(effectId, parameterId, value);
    onEffectChange(effectId, parameterId, value);
  }, [handleEffectChange, isApplyingPreset, onEffectChange]);

  // Enhanced reset that maintains card back visibility
  const handleResetWithEffects = useCallback(() => {
    console.log('🔄 ViewerEffectsManager: Enhanced reset maintaining back visibility');
    resetAllEffects();
    validateEffectState();
    onResetAllEffects();
  }, [resetAllEffects, validateEffectState, onResetAllEffects]);

  // Enhanced preset application with improved state management
  const handleApplyCombo = useCallback((preset: EffectValues, presetId?: string) => {
    console.log('🚀 ViewerEffectsManager: Enhanced preset application:', presetId, preset);
    
    // Validate current state before application
    validateEffectState();
    
    // Apply preset with enhanced merging
    applyPreset(preset, presetId);
    onApplyPreset(preset, presetId);
    
    // Enhanced logging for debugging
    setTimeout(() => {
      console.log('✅ ViewerEffectsManager: Enhanced preset applied, current effects:', effectValues);
    }, 150);
  }, [applyPreset, validateEffectState, onApplyPreset, effectValues]);

  // Enhanced debug logging for effect values changes
  useEffect(() => {
    console.log('🎨 ViewerEffectsManager: Enhanced effect values updated:', effectValues);
    
    // Log active effects for debugging
    const activeEffects = Object.entries(effectValues).filter(([_, params]) => {
      const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
      return intensity > 10;
    });
    console.log('⚡ Active effects (>10 intensity):', activeEffects.map(([id, params]) => `${id}: ${params.intensity}`));
  }, [effectValues]);

  return (
    <>
      {children({
        effectValues,
        handleEffectChange: handleManualEffectChange,
        resetAllEffects: handleResetWithEffects,
        applyPreset: handleApplyCombo,
        validateEffectState,
        isApplyingPreset,
        frameStyles: getFrameStyles(),
        enhancedEffectStyles: getEnhancedEffectStyles(),
        surfaceTextureStyles
      })}
    </>
  );
};
