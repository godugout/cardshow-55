
import { useState, useCallback } from 'react';
import type { BackgroundType, EnvironmentScene, LightingPreset, MaterialSettings } from '@/components/viewer/types';

// Default studio space environment
const DEFAULT_SPACE = {
  id: 'studio',
  name: 'Modern Studio',
  type: 'studio' as const,
  category: 'studio',
  thumbnailUrl: '/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png',
  description: 'Clean modern studio environment perfect for showcasing cards',
  config: {
    lightIntensity: 1.0,
    exposure: 1.0,
    autoRotation: 0,
    environmentIntensity: 0.8
  }
};

export const useViewerState = () => {
  // Core viewer state
  const [isFullscreen] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Panel states
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  // Environment and effects
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('space');
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene | undefined>();
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset | undefined>();
  const [overallBrightness, setOverallBrightness] = useState([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(false);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.3,
    metalness: 0.8,
    clearcoat: 0.5,
    opacity: 1.0
  });
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>();
  
  // Space controls - Initialize with default space
  const [selectedSpace, setSelectedSpace] = useState(DEFAULT_SPACE);
  const [spaceControls, setSpaceControls] = useState({
    autoRotate: false,
    orbitSpeed: 0.5,
    floatIntensity: 1.0,
    fieldOfView: 45,
    gravityEffect: 0,
    ambientIntensity: 0.4,
    directionalIntensity: 0.8
  });

  // Handlers
  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setAutoRotate(false);
    setIsFlipped(false);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  const handleResetCamera = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const onCardClick = useCallback(() => {
    console.log('Card clicked in viewer');
  }, []);

  return {
    // Core state
    isFullscreen,
    rotation,
    setRotation,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    zoom,
    isFlipped,
    setIsFlipped,
    autoRotate,
    setAutoRotate,
    showEffects,
    setShowEffects,
    mousePosition,
    setMousePosition,
    
    // Panel states
    showCustomizePanel,
    setShowCustomizePanel,
    isHovering,
    setIsHovering,
    isHoveringControls,
    setIsHoveringControls,
    showExportDialog,
    setShowExportDialog,
    
    // Environment
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
    selectedSpace,
    setSelectedSpace,
    spaceControls,
    setSpaceControls,
    
    // Handlers
    handleReset,
    handleZoom,
    handleResetCamera,
    onCardClick
  };
};
