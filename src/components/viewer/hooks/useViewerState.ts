
import { useState, useCallback } from 'react';
import type { EnvironmentScene, LightingPreset, MaterialSettings, BackgroundType } from '../types';
import type { SpaceEnvironment, SpaceControls } from '../spaces/types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';
import { SPACE_ENVIRONMENTS } from '../components/studio/sections/spaces/constants';

export const useViewerState = () => {
  // UI State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Background state
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('scene');

  // Advanced settings
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.40,
    metalness: 0.45,
    clearcoat: 0.60,
    reflectivity: 0.40
  });

  // Preset state
  const [selectedPresetId, setSelectedPresetId] = useState<string>();

  // 3D Space state - Initialize with first available space to prevent null errors
  const [selectedSpace, setSelectedSpace] = useState<SpaceEnvironment | null>(
    SPACE_ENVIRONMENTS.length > 0 ? SPACE_ENVIRONMENTS[0] : null
  );
  const [spaceControls, setSpaceControls] = useState<SpaceControls>({
    orbitSpeed: 0.5,
    floatIntensity: 1.0,
    cameraDistance: 8,
    autoRotate: false,
    gravityEffect: 0.0
  });

  // Action handlers
  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
    setSelectedPresetId(undefined);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleResetCamera = useCallback(() => {
    setSpaceControls(prev => ({
      ...prev,
      cameraDistance: 8,
      orbitSpeed: 0.5
    }));
  }, []);

  const onCardClick = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Safe space setter that ensures we always have a valid space
  const setSelectedSpaceSafe = useCallback((space: SpaceEnvironment | null) => {
    console.log('useViewerState: Setting selected space to:', space?.name || 'null');
    if (space) {
      setSelectedSpace(space);
    } else if (SPACE_ENVIRONMENTS.length > 0) {
      console.log('useViewerState: Falling back to default space:', SPACE_ENVIRONMENTS[0].name);
      setSelectedSpace(SPACE_ENVIRONMENTS[0]);
    }
  }, []);

  return {
    // UI State
    isFullscreen,
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

    // Background state
    backgroundType,
    setBackgroundType,

    // Advanced settings
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

    // Preset state
    selectedPresetId,
    setSelectedPresetId,

    // 3D Space state
    selectedSpace,
    setSelectedSpace: setSelectedSpaceSafe,
    spaceControls,
    setSpaceControls,

    // Action handlers
    handleReset,
    handleZoom,
    toggleFullscreen,
    handleResetCamera,
    onCardClick
  };
};
