
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StudioPanel } from './components/StudioPanel';
import { ViewerHeader } from './components/ViewerHeader';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { BackgroundRenderer } from './components/BackgroundRenderer';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { useEnhancedCardInteraction } from './hooks/useEnhancedCardInteraction';
import { useViewerState } from './hooks/useViewerState';
import { useCardExport } from './hooks/useCardExport';
import { cardAdapter } from './utils/cardAdapter';
import type { BackgroundType, EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from './types';
import type { SpaceEnvironment, SpaceControls } from './spaces/types';

interface ImmersiveCardViewerProps {
  card: any;
  cards?: any[];
  currentCardIndex?: number;
  onCardChange?: (card: any, index: number) => void;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = false,
  ambient = false
}) => {
  const [isStudioVisible, setIsStudioVisible] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(undefined);
  const [isApplyingPreset, setIsApplyingPreset] = useState(false);
  const [showBackgroundInfo, setShowBackgroundInfo] = useState(true);
  const [showEffects, setShowEffects] = useState(true);

  const {
    backgroundType,
    setBackgroundType,
    selectedSpace,
    setSelectedSpace,
    spaceControls,
    setSpaceControls,
    selectedScene,
    setSelectedScene,
    selectedLighting,
    setSelectedLighting,
    materialSettings,
    setMaterialSettings,
    environmentControls,
    setEnvironmentControls,
    overallBrightness,
    setOverallBrightness,
    interactiveLighting,
    setInteractiveLighting
  } = useViewerState();

  const {
    effectValues,
    handleEffectChange,
    resetAllEffects,
    applyPreset,
    presetState,
    isApplyingPreset: hookIsApplyingPreset
  } = useEnhancedCardEffects();

  // Create mock frame styles and enhanced effect styles
  const frameStyles = useMemo(() => ({}), []);
  const enhancedEffectStyles = useMemo(() => ({}), []);
  const SurfaceTexture = useMemo(() => null, []);

  const handleApplyCombo = useCallback((combo: any) => {
    applyPreset(combo.effects);
  }, [applyPreset]);

  const handleResetAllEffects = useCallback(() => {
    resetAllEffects();
  }, [resetAllEffects]);

  // Create interaction handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(() => {
    // Touch move logic
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCardClick = useCallback(() => {
    // Card click logic
  }, []);

  const handleCameraReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1.0);
  }, []);

  // Create simplified export handlers
  const handleShare = useCallback(() => {
    if (onShare) {
      onShare();
    }
  }, [onShare]);

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
    }
  }, [onDownload]);

  const handleCloseStudio = useCallback(() => {
    setIsStudioVisible(false);
  }, []);

  const adaptedCard = useMemo(() => cardAdapter(card), [card]);

  return (
    <div className="fixed inset-0 bg-crd-darkest z-40 flex">
      {/* Background Layer - Always at z-0 */}
      <BackgroundRenderer
        backgroundType={backgroundType}
        selectedSpace={selectedSpace}
        spaceControls={spaceControls}
        adaptedCard={adaptedCard}
        onCardClick={handleCardClick}
        onCameraReset={handleCameraReset}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        mousePosition={mousePosition}
        isHovering={isHovering}
        effectValues={effectValues}
        materialSettings={materialSettings}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
      />

      {/* Main 3D Card Layer - Always rendered at z-10 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
        <EnhancedCardContainer
          card={adaptedCard}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          rotation={rotation}
          zoom={zoom}
          isDragging={isDragging}
          frameStyles={frameStyles}
          enhancedEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          interactiveLighting={interactiveLighting}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          showBackgroundInfo={showBackgroundInfo}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          environmentControls={environmentControls}
        />
      </div>

      {/* Header - z-30 */}
      <ViewerHeader
        onClose={onClose}
        showStudioButton={!isStudioVisible}
        onOpenStudio={() => setIsStudioVisible(true)}
      />

      {/* Studio Panel - z-50 */}
      <StudioPanel
        isVisible={isStudioVisible}
        onClose={handleCloseStudio}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        effectValues={effectValues}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        materialSettings={materialSettings}
        onSceneChange={setSelectedScene}
        onLightingChange={setSelectedLighting}
        onEffectChange={handleEffectChange}
        onBrightnessChange={setOverallBrightness}
        onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
        onMaterialSettingsChange={setMaterialSettings}
        selectedPresetId={selectedPresetId}
        onPresetSelect={setSelectedPresetId}
        onApplyCombo={handleApplyCombo}
        isApplyingPreset={hookIsApplyingPreset}
        environmentControls={environmentControls}
        onEnvironmentControlsChange={setEnvironmentControls}
        backgroundType={backgroundType}
        onBackgroundTypeChange={setBackgroundType}
        onSpaceChange={setSelectedSpace}
        selectedSpace={selectedSpace}
        spaceControls={spaceControls}
        onSpaceControlsChange={setSpaceControls}
        onResetCamera={handleCameraReset}
      />
    </div>
  );
};
