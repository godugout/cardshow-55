import React, { useCallback } from 'react';
import { useEnhancedCardEffects, type EffectValues } from './useEnhancedCardEffects';
import { useCardEffects } from './useCardEffects';
import { useCardExport } from './useCardExport';
import { useViewerState } from './useViewerState';
import { useSimplifiedViewerInteractions } from './useSimplifiedViewerInteractions';
import { adaptCardForSpaceRenderer } from '../utils/cardAdapter';
import type { CardData } from '@/hooks/useCardEditor';

interface UseImmersiveViewerStateProps {
  card: CardData;
  allowRotation: boolean;
  onShare?: (card: CardData) => void;
}

export const useImmersiveViewerState = ({ 
  card, 
  allowRotation, 
  onShare 
}: UseImmersiveViewerStateProps) => {
  // Use the custom state hook
  const viewerState = useViewerState();

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

  // Calculate total effect intensity for physics feedback
  const totalEffectIntensity = React.useMemo(() => {
    if (!effectValues) return 0;
    return Object.values(effectValues).reduce((total, effect) => {
      const intensity = effect.intensity as number;
      return total + (typeof intensity === 'number' ? intensity : 0);
    }, 0);
  }, [effectValues]);

  // Simplified viewer interactions hook with enhanced physics
  const viewerInteractions = useSimplifiedViewerInteractions({
    allowRotation,
    autoRotate: viewerState.autoRotate,
    isDragging: viewerState.isDragging,
    setIsDragging: viewerState.setIsDragging,
    setDragStart: viewerState.setDragStart,
    setAutoRotate: viewerState.setAutoRotate,
    setRotation: viewerState.setRotation,
    setMousePosition: viewerState.setMousePosition,
    rotation: viewerState.rotation,
    dragStart: viewerState.dragStart,
    handleZoom: viewerState.handleZoom,
    effectIntensity: totalEffectIntensity
  });

  // Export functionality
  const exportHook = useCardExport({
    cardRef: React.useRef<HTMLDivElement>(null),
    card,
    onRotationChange: viewerState.setRotation,
    onEffectChange: handleEffectChange,
    effectValues
  });

  // Style generation hook
  const cardEffectsHook = useCardEffects({
    card,
    effectValues,
    mousePosition: viewerState.mousePosition,
    showEffects: viewerState.showEffects,
    overallBrightness: viewerState.overallBrightness,
    interactiveLighting: viewerState.interactiveLighting,
    selectedScene: viewerState.selectedScene,
    selectedLighting: viewerState.selectedLighting,
    materialSettings: viewerState.materialSettings,
    zoom: viewerState.zoom,
    rotation: viewerState.rotation,
    isHovering: viewerState.isHovering
  });

  // Enhanced combo application with validation
  const handleComboApplication = useCallback((combo: any) => {
    console.log('🚀 Applying combo with enhanced synchronization:', combo.id);
    
    validateEffectState();
    applyPreset(combo.effects, combo.id);
    viewerState.setSelectedPresetId(combo.id);
    
    if (combo.scene) {
      viewerState.setSelectedScene(combo.scene);
    }
    if (combo.lighting) {
      viewerState.setSelectedLighting(combo.lighting);
    }
  }, [applyPreset, validateEffectState, viewerState]);

  // Enhanced manual effect change with state tracking
  const handleManualEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    if (!isApplyingPreset) {
      viewerState.setSelectedPresetId(undefined);
    }
    handleEffectChange(effectId, parameterId, value);
  }, [handleEffectChange, isApplyingPreset, viewerState]);

  // Enhanced reset that includes all state
  const handleResetWithEffects = useCallback(() => {
    viewerState.handleReset();
    resetAllEffects();
    validateEffectState();
  }, [viewerState.handleReset, resetAllEffects, validateEffectState]);

  const handleShareClick = useCallback(() => {
    if (onShare) {
      onShare(card);
    }
  }, [onShare, card]);

  const handleDownloadClick = useCallback(() => {
    viewerState.setShowExportDialog(true);
  }, [viewerState]);

  // Adapt card for space renderer
  const adaptedCard = adaptCardForSpaceRenderer(card);

  return {
    // Core state
    viewerState,
    effectValues,
    totalEffectIntensity,
    adaptedCard,
    
    // Hooks
    viewerInteractions,
    exportHook,
    cardEffectsHook,
    
    // Handlers
    handleComboApplication,
    handleManualEffectChange,
    handleResetWithEffects,
    handleShareClick,
    handleDownloadClick,
    
    // Other state
    isApplyingPreset,
    validateEffectState
  };
};
