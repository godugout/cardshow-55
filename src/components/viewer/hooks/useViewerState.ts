import { useState, useCallback } from 'react';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { useDoubleClick } from '@/hooks/useDoubleClick';

export const useViewerState = () => {
  // Basic viewer state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // --- NEW: Default minimal custom-back effect values for card initialization
  const [effectValues, setEffectValues] = useState({
    holographic: 0.15,
    refractor: 0.15,
    foil: 0.15,
    prizm: 0.15,
    rainbow: 0.15,
    chrome: 0.15,
    gold: 0.15,
    black: 0.15,
    // Add any other effect needed for your selector defaults
  });

  // --- END NEW

  // Environment and effects state - Simplified to only handle 2D scenes
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

  // --- NEW: Preset state initialized to "custom-init"
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>("custom-init");
  // --- END NEW

  // Action handlers
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

  return {
    // Basic state
    isFullscreen,
    setIsFullscreen,
    rotation,
    setRotation,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    zoom,
    setZoom,
    isFlipped,
    setIsFlipped,
    autoRotate,
    setAutoRotate,
    showEffects,
    setShowEffects,
    mousePosition,
    setMousePosition,
    showCustomizePanel,
    setShowCustomizePanel,
    isHovering,
    setIsHovering,
    isHoveringControls,
    setIsHoveringControls,
    showExportDialog,
    setShowExportDialog,

    // NEW: expose effectValues/setEffectValues for use as initial for child hooks (if needed)
    effectValues,
    setEffectValues,

    // Environment state
    selectedScene,
    setSelectedScene,
    selectedLighting,
    setSelectedLighting,
    overallBrightness,
    setOverallBrightness,
    interactiveLighting,
    setInteractiveLighting,
    materialSettings,
    setMaterialSettings,
    selectedPresetId,
    setSelectedPresetId,

    // Actions
    handleReset,
    handleZoom,
    handleResetCamera,
    onCardClick
  };
};
