
import { useState, useCallback } from 'react';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../components/viewer/constants';
import type { EnvironmentScene, LightingPreset, MaterialSettings, BackgroundType } from '../components/viewer/types';
import type { SpaceEnvironment, SpaceControls } from '../components/viewer/spaces/types';

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

  // Environment and effects state - Initialize with 2D scene background
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('scene');
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
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>();

  // Space-specific state with default space
  const [selectedSpace, setSelectedSpace] = useState<SpaceEnvironment | null>(null);
  const [spaceControls, setSpaceControls] = useState<SpaceControls>({
    autoRotate: true,
    orbitSpeed: 0.5,
    floatIntensity: 1.0,
    gravityEffect: 0.0,
    fieldOfView: 45,
    cameraDistance: 8
  });

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

  const onCardClick = useCallback(() => {
    // Card click handler - can be customized
    console.log('Card clicked in 3D space');
  }, []);

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

    // Environment state
    backgroundType,
    setBackgroundType,
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

    // Space state
    selectedSpace,
    setSelectedSpace,
    spaceControls,
    setSpaceControls,

    // Actions
    handleReset,
    handleZoom,
    handleResetCamera,
    onCardClick
  };
};
