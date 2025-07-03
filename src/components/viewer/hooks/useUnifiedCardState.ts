import { useState, useCallback, useMemo } from 'react';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';
import { useEnhancedCardEffects } from './useEnhancedCardEffects';
import { useDoubleClick } from '@/hooks/useDoubleClick';
import type { CardData } from '@/types/card';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from './useEnhancedCardEffects';

interface UnifiedCardState {
  // Viewer state
  isFullscreen: boolean;
  rotation: { x: number; y: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
  zoom: number;
  isFlipped: boolean;
  autoRotate: boolean;
  showEffects: boolean;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  isHoveringControls: boolean;

  // UI state
  showCustomizePanel: boolean;
  showExportDialog: boolean;

  // Environment state
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  selectedPresetId: string | undefined;
  solidCardTransition: boolean;
  environmentControls: {
    depthOfField: number;
    parallaxIntensity: number;
    fieldOfView: number;
    atmosphericDensity: number;
  };

  // Effects state
  effectValues: EffectValues;
}

interface UnifiedCardActions {
  // Viewer actions
  setIsFullscreen: (value: boolean) => void;
  setRotation: (value: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setIsDragging: (value: boolean) => void;
  setDragStart: (value: { x: number; y: number }) => void;
  setZoom: (value: number) => void;
  setIsFlipped: (value: boolean) => void;
  setAutoRotate: (value: boolean) => void;
  setShowEffects: (value: boolean) => void;
  setMousePosition: (value: { x: number; y: number }) => void;
  setIsHovering: (value: boolean) => void;
  setIsHoveringControls: (value: boolean) => void;

  // UI actions
  setShowCustomizePanel: (value: boolean) => void;
  setShowExportDialog: (value: boolean) => void;

  // Environment actions
  setSelectedScene: (scene: EnvironmentScene) => void;
  setSelectedLighting: (lighting: LightingPreset) => void;
  setOverallBrightness: (brightness: number[]) => void;
  setInteractiveLighting: (value: boolean) => void;
  setMaterialSettings: (settings: MaterialSettings) => void;
  setSelectedPresetId: (id: string | undefined) => void;
  setSolidCardTransition: (value: boolean) => void;
  setEnvironmentControls: (controls: any) => void;

  // Effects actions
  handleEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  resetEffect: (effectId: string) => void;
  resetAllEffects: () => void;
  applyPreset: (preset: EffectValues, presetId?: string) => void;

  // Combined actions
  handleReset: () => void;
  handleZoom: (delta: number) => void;
  handleResetCamera: () => void;
  onCardClick: (event: React.MouseEvent) => void;
}

export const useUnifiedCardState = (card?: CardData) => {
  // Viewer state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  // UI state
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Environment state
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(false);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.3,
    metalness: 0.1,
    clearcoat: 0.0,
    reflectivity: 0.5
  });
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>("custom-init");
  const [solidCardTransition, setSolidCardTransition] = useState(false);
  const [environmentControls, setEnvironmentControls] = useState({
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  });

  // Effects state - using the existing hook
  const {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset,
    validateEffectState,
    isApplyingPreset
  } = useEnhancedCardEffects();

  // Combined action handlers
  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  const handleResetCamera = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const onCardClick = useDoubleClick({
    onDoubleClick: useCallback(() => {
      console.log('🎉 Double click registered! Flipping card.');
      setIsFlipped(prev => !prev);
    }, []),
  });

  // Memoized state object to prevent unnecessary re-renders
  const state = useMemo<UnifiedCardState>(() => ({
    // Viewer state
    isFullscreen,
    rotation,
    isDragging,
    dragStart,
    zoom,
    isFlipped,
    autoRotate,
    showEffects,
    mousePosition,
    isHovering,
    isHoveringControls,

    // UI state
    showCustomizePanel,
    showExportDialog,

    // Environment state
    selectedScene,
    selectedLighting,
    overallBrightness,
    interactiveLighting,
    materialSettings,
    selectedPresetId,
    solidCardTransition,
    environmentControls,

    // Effects state
    effectValues
  }), [
    isFullscreen, rotation, isDragging, dragStart, zoom, isFlipped, autoRotate,
    showEffects, mousePosition, isHovering, isHoveringControls,
    showCustomizePanel, showExportDialog,
    selectedScene, selectedLighting, overallBrightness, interactiveLighting,
    materialSettings, selectedPresetId, solidCardTransition, environmentControls,
    effectValues
  ]);

  // Memoized actions object to prevent unnecessary re-renders
  const actions = useMemo<UnifiedCardActions>(() => ({
    // Viewer actions
    setIsFullscreen,
    setRotation,
    setIsDragging,
    setDragStart,
    setZoom,
    setIsFlipped,
    setAutoRotate,
    setShowEffects,
    setMousePosition,
    setIsHovering,
    setIsHoveringControls,

    // UI actions
    setShowCustomizePanel,
    setShowExportDialog,

    // Environment actions
    setSelectedScene,
    setSelectedLighting,
    setOverallBrightness,
    setInteractiveLighting,
    setMaterialSettings,
    setSelectedPresetId,
    setSolidCardTransition,
    setEnvironmentControls,

    // Effects actions
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset,

    // Combined actions
    handleReset,
    handleZoom,
    handleResetCamera,
    onCardClick
  }), [
    setIsFullscreen, setRotation, setIsDragging, setDragStart, setZoom,
    setIsFlipped, setAutoRotate, setShowEffects, setMousePosition,
    setIsHovering, setIsHoveringControls, setShowCustomizePanel, setShowExportDialog,
    setSelectedScene, setSelectedLighting, setOverallBrightness, setInteractiveLighting,
    setMaterialSettings, setSelectedPresetId, setSolidCardTransition, setEnvironmentControls,
    handleEffectChange, resetEffect, resetAllEffects, applyPreset,
    handleReset, handleZoom, handleResetCamera, onCardClick
  ]);

  return {
    state,
    actions,
    validateEffectState,
    isApplyingPreset
  };
};

export type { UnifiedCardState, UnifiedCardActions };