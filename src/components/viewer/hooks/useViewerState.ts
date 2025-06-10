
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

  // Background state - Default to 3D space if available, fallback to scene
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(
    SPACE_ENVIRONMENTS.length > 0 ? '3dSpace' : 'scene'
  );

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

  // 3D Space state - Initialize with first reliable photorealistic space
  const getDefaultSpace = (): SpaceEnvironment | null => {
    // Try to find a photorealistic space first
    const photoRealisticSpaces = SPACE_ENVIRONMENTS.filter(space => space.category === 'photorealistic');
    if (photoRealisticSpaces.length > 0) {
      console.log('🎯 Using default photorealistic space:', photoRealisticSpaces[0].name);
      return photoRealisticSpaces[0];
    }
    
    // Fallback to any available space
    if (SPACE_ENVIRONMENTS.length > 0) {
      console.log('🎯 Using fallback space:', SPACE_ENVIRONMENTS[0].name);
      return SPACE_ENVIRONMENTS[0];
    }
    
    console.warn('⚠️ No 3D spaces available');
    return null;
  };

  const [selectedSpace, setSelectedSpace] = useState<SpaceEnvironment | null>(getDefaultSpace());
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

  // Enhanced space setter with automatic fallback and background type switching
  const setSelectedSpaceSafe = useCallback((space: SpaceEnvironment | null) => {
    console.log('🔄 Setting selected space to:', space?.name || 'null');
    
    if (space) {
      setSelectedSpace(space);
      // Automatically switch to 3D mode when a space is selected
      setBackgroundType('3dSpace');
      console.log('✅ Space set and switched to 3D mode');
    } else {
      // If no space provided, try to find a default
      const defaultSpace = getDefaultSpace();
      if (defaultSpace) {
        console.log('🔄 Using default space fallback:', defaultSpace.name);
        setSelectedSpace(defaultSpace);
        setBackgroundType('3dSpace');
      } else {
        // No spaces available, fallback to 2D scene
        console.warn('⚠️ No spaces available, falling back to 2D scene');
        setSelectedSpace(null);
        setBackgroundType('scene');
      }
    }
  }, []);

  // Enhanced background type setter with validation
  const setBackgroundTypeSafe = useCallback((type: BackgroundType) => {
    console.log('🔄 Setting background type to:', type);
    
    if (type === '3dSpace') {
      // Ensure we have a valid space when switching to 3D
      if (!selectedSpace) {
        const defaultSpace = getDefaultSpace();
        if (defaultSpace) {
          setSelectedSpace(defaultSpace);
          setBackgroundType('3dSpace');
          console.log('✅ Switched to 3D with default space:', defaultSpace.name);
        } else {
          console.warn('⚠️ No 3D spaces available, staying in 2D mode');
          setBackgroundType('scene');
        }
      } else {
        setBackgroundType('3dSpace');
        console.log('✅ Switched to 3D mode with existing space');
      }
    } else {
      setBackgroundType(type);
      console.log('✅ Switched to 2D mode');
    }
  }, [selectedSpace]);

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
    setBackgroundType: setBackgroundTypeSafe,

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
