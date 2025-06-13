
import { useState, useCallback } from 'react';
import { useViewerState } from './useViewerState';
import { useCardExport } from './useCardExport';
import { ENVIRONMENT_SCENES } from '../constants';
import { SPACE_ENVIRONMENTS } from '../components/studio/sections/spaces/constants';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from './useEnhancedCardEffects';
import type { BackgroundType } from '../types';

interface UseViewerContainerStateProps {
  card: CardData;
  onShare?: (card: CardData) => void;
}

export const useViewerContainerState = ({ card, onShare }: UseViewerContainerStateProps) => {
  const viewerState = useViewerState();
  
  // Local state for effects management
  const [effectValues, setEffectValues] = useState<EffectValues>({});
  const [presetState, setPresetState] = useState<any>({});

  // Background and space state - properly initialized
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('scene');
  const [selectedSpace, setSelectedSpace] = useState(SPACE_ENVIRONMENTS[0]); // Default to first space
  const [spaceControls, setSpaceControls] = useState({
    orbitSpeed: 0.5,
    floatIntensity: 1.0,
    cameraDistance: 8,
    autoRotate: false,
    gravityEffect: 0.0,
    fieldOfView: 45
  });

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

  const handleBackgroundTypeChange = useCallback((type: BackgroundType) => {
    console.log('🎨 Background type changed to:', type);
    setBackgroundType(type);
  }, []);

  const handleSpaceChange = useCallback((space: any) => {
    console.log('🌌 Space changed to:', space.name);
    setSelectedSpace(space);
    setBackgroundType('3dSpace'); // Auto-switch to 3D space mode
  }, []);

  const handleSpaceControlsChange = useCallback((controls: any) => {
    console.log('🎛️ Space controls changed:', controls);
    setSpaceControls(controls);
  }, []);

  return {
    ...viewerState,
    effectValues,
    setEffectValues,
    presetState,
    setPresetState,
    backgroundType,
    setBackgroundType: handleBackgroundTypeChange,
    selectedSpace,
    setSelectedSpace: handleSpaceChange,
    spaceControls,
    setSpaceControls: handleSpaceControlsChange,
    exportCard,
    isExporting,
    exportProgress,
    handleDownloadClick,
    handleShareClick,
    handleEffectValuesChange,
    handlePresetStateChange
  };
};
