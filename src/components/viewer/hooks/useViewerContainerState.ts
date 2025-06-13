
import { useState, useCallback } from 'react';
import { useViewerState } from './useViewerState';
import { useCardExport } from './useCardExport';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from './useEnhancedCardEffects';

interface UseViewerContainerStateProps {
  card: CardData;
  onShare?: (card: CardData) => void;
}

export const useViewerContainerState = ({ card, onShare }: UseViewerContainerStateProps) => {
  const viewerState = useViewerState();
  
  // Local state for effects management
  const [effectValues, setEffectValues] = useState<EffectValues>({});
  const [presetState, setPresetState] = useState<any>({});

  // Export functionality
  const { exportCard, isExporting, exportProgress } = useCardExport({
    cardRef: { current: null },
    card,
    onRotationChange: viewerState.setRotation,
    onEffectChange: () => {},
    effectValues
  });

  const handleDownloadClick = useCallback(() => {
    viewerState.setShowExportDialog(true);
  }, [viewerState.setShowExportDialog]);

  const handleShareClick = useCallback(() => {
    if (onShare) {
      onShare(card);
    }
  }, [onShare, card]);

  const handleEffectValuesChange = useCallback((values: EffectValues) => {
    setEffectValues(values);
  }, []);

  const handlePresetStateChange = useCallback((state: any) => {
    if (state.selectedScene) viewerState.setSelectedScene(state.selectedScene);
    if (state.selectedLighting) viewerState.setSelectedLighting(state.selectedLighting);
    if (state.selectedPresetId !== undefined) viewerState.setSelectedPresetId(state.selectedPresetId);
    if (state.reset) {
      viewerState.handleReset();
    }
    setPresetState(prev => ({ ...prev, ...state }));
  }, [viewerState]);

  return {
    ...viewerState,
    effectValues,
    setEffectValues,
    presetState,
    setPresetState,
    exportCard,
    isExporting,
    exportProgress,
    handleDownloadClick,
    handleShareClick,
    handleEffectValuesChange,
    handlePresetStateChange
  };
};
