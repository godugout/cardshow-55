
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

  // Enhanced manual effect change that syncs with parent state
  const handleManualEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    console.log('🎛️ ViewerEffectsManager: Manual effect change:', { effectId, parameterId, value });
    
    if (!isApplyingPreset) {
      // Clear preset selection when manual changes are made
      console.log('🔄 Clearing preset selection due to manual change');
    }
    
    handleEffectChange(effectId, parameterId, value);
    onEffectChange(effectId, parameterId, value);
  }, [handleEffectChange, isApplyingPreset, onEffectChange]);

  // Enhanced reset that includes all state
  const handleResetWithEffects = useCallback(() => {
    console.log('🔄 ViewerEffectsManager: Resetting all effects');
    resetAllEffects();
    validateEffectState();
    onResetAllEffects();
  }, [resetAllEffects, validateEffectState, onResetAllEffects]);

  // Enhanced combo application with proper logging
  const handleApplyCombo = useCallback((preset: EffectValues, presetId?: string) => {
    console.log('🚀 ViewerEffectsManager: Applying preset:', presetId, preset);
    
    validateEffectState();
    applyPreset(preset, presetId);
    onApplyPreset(preset, presetId);
    
    // Log the current effect values after application
    setTimeout(() => {
      console.log('✅ ViewerEffectsManager: Preset applied, current effects:', effectValues);
    }, 100);
  }, [applyPreset, validateEffectState, onApplyPreset, effectValues]);

  // Debug logging for effect values changes
  useEffect(() => {
    console.log('🎨 ViewerEffectsManager: Effect values updated:', effectValues);
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
