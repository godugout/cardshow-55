

import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { ImmersiveCardViewerProps, MaterialSettings } from './types';
import { 
  useEnhancedCardEffects, 
  type EffectValues 
} from './hooks/useEnhancedCardEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { useCardExport } from './hooks/useCardExport';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { StudioPanel } from './components/StudioPanel';
import { useViewerState } from './hooks/useViewerState';
import { useViewerInteractionManager } from './hooks/useViewerInteractionManager';
import { ViewerActionsManager } from './components/ViewerActionsManager';
import { ViewerLayout } from './components/ViewerLayout';

// Update the interface to support card navigation
interface ExtendedImmersiveCardViewerProps extends ImmersiveCardViewerProps {
  cards?: any[];
  currentCardIndex?: number;
  onCardChange?: (index: number) => void;
}

export const ImmersiveCardViewer: React.FC<ExtendedImmersiveCardViewerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen = true,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = true,
  ambient = true
}) => {
  // Use the custom state hook
  const viewerState = useViewerState();
  const [solidCardTransition, setSolidCardTransition] = useState(false);
  const {
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
    showCustomizePanel,
    setShowCustomizePanel,
    isHovering,
    setIsHovering,
    isHoveringControls,
    setIsHoveringControls,
    showExportDialog,
    setShowExportDialog,
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
    handleReset,
    handleZoom,
    handleResetCamera,
    onCardClick
  } = viewerState;

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

  // Refs
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Viewer interactions manager
  const {
    containerRef,
    handleMouseMove,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    hasMultipleCards
  } = useViewerInteractionManager({
    allowRotation,
    cards,
    currentCardIndex,
    showCustomizePanel,
    showStats,
    autoRotate,
    isDragging,
    rotation,
    dragStart,
    setIsDragging,
    setDragStart,
    setAutoRotate,
    setRotation,
    setMousePosition,
    setIsHoveringControls,
    handleZoom
  });

  // Export functionality
  const { exportCard, isExporting, exportProgress } = useCardExport({
    cardRef: cardContainerRef,
    card,
    onRotationChange: setRotation,
    onEffectChange: handleEffectChange,
    effectValues
  });

  // Style generation hook - fix the parameters to match UseCardEffectsParams interface
  const { getFrameStyles, getEnhancedEffectStyles, surfaceTextureStyles } = useCardEffects({
    effectValues,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation,
    isHovering
  });

  // Enhanced state validation on card change
  useEffect(() => {
    if (card) {
      validateEffectState();
    }
  }, [card, validateEffectState]);

  // Enhanced reset that includes all state
  const handleResetWithEffects = useCallback(() => {
    handleReset();
    resetAllEffects();
    validateEffectState();
  }, [handleReset, resetAllEffects, validateEffectState]);

  // Enhanced combo application to connect StudioPanel to effect hooks
  const handleApplyCombo = useCallback((combo: any) => {
    console.log('🚀 Applying style combo:', combo.id);
    validateEffectState();
    applyPreset(combo.effects, combo.id);
    setSelectedPresetId(combo.id);
    if (combo.scene) {
      setSelectedScene(combo.scene);
    }
    if (combo.lighting) {
      setSelectedLighting(combo.lighting);
    }
  }, [applyPreset, validateEffectState, setSelectedPresetId, setSelectedScene, setSelectedLighting]);

  // Enhanced manual effect change to clear preset selection
  const handleManualEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    if (!isApplyingPreset) {
      setSelectedPresetId(undefined);
    }
    handleEffectChange(effectId, parameterId, value);
  }, [handleEffectChange, isApplyingPreset, setSelectedPresetId]);

  // Add environment controls state
  const [environmentControls, setEnvironmentControls] = useState({
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  });

  // Create SurfaceTexture component from styles
  const SurfaceTexture = (
    <div style={surfaceTextureStyles} />
  );

  if (!isOpen) return null;

  return (
    <>
      <ViewerActionsManager
        card={card}
        onShare={onShare}
        effectValues={effectValues}
        handleEffectChange={handleEffectChange}
        resetAllEffects={resetAllEffects}
        applyPreset={applyPreset}
        validateEffectState={validateEffectState}
        isApplyingPreset={isApplyingPreset}
        setSelectedPresetId={setSelectedPresetId}
        setSelectedScene={setSelectedScene}
        setSelectedLighting={setSelectedLighting}
        setShowExportDialog={setShowExportDialog}
      >
        <ViewerLayout
          card={card}
          cards={cards}
          currentCardIndex={currentCardIndex}
          onCardChange={onCardChange}
          onClose={onClose}
          isFullscreen={isFullscreen}
          showCustomizePanel={showCustomizePanel}
          setShowCustomizePanel={setShowCustomizePanel}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
          isHoveringControls={isHoveringControls}
          showEffects={showEffects}
          setShowEffects={setShowEffects}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          showStats={showStats}
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          mousePosition={mousePosition}
          rotation={rotation}
          zoom={zoom}
          isDragging={isDragging}
          frameStyles={getFrameStyles()}
          enhancedEffectStyles={getEnhancedEffectStyles()}
          SurfaceTexture={SurfaceTexture}
          environmentControls={environmentControls}
          containerRef={containerRef}
          cardContainerRef={cardContainerRef}
          handleMouseMove={handleMouseMove}
          handleDragStart={handleDragStart}
          handleDrag={handleDrag}
          handleDragEnd={handleDragEnd}
          handleZoom={handleZoom}
          handleResetWithEffects={handleResetWithEffects}
          handleResetCamera={handleResetCamera}
          onCardClick={onCardClick}
          hasMultipleCards={hasMultipleCards}
          solidCardTransition={solidCardTransition}
        />
      </ViewerActionsManager>

      {/* Studio Panel with Environment Controls */}
      <StudioPanel
        isVisible={showCustomizePanel}
        onClose={() => setShowCustomizePanel(false)}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        effectValues={effectValues}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        materialSettings={materialSettings}
        environmentControls={environmentControls}
        onSceneChange={setSelectedScene}
        onLightingChange={setSelectedLighting}
        onEffectChange={handleManualEffectChange}
        onBrightnessChange={setOverallBrightness}
        onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
        onMaterialSettingsChange={setMaterialSettings}
        selectedPresetId={selectedPresetId}
        onPresetSelect={setSelectedPresetId}
        onApplyCombo={handleApplyCombo}
        isApplyingPreset={isApplyingPreset}
        onResetCamera={handleResetCamera}
        solidCardTransition={solidCardTransition}
        onSolidCardTransitionChange={setSolidCardTransition}
      />

      {/* Export Options Dialog */}
      <ExportOptionsDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={exportCard}
        isExporting={isExporting}
        exportProgress={exportProgress}
        cardTitle={card.title}
      />
    </>
  );
};

export default ImmersiveCardViewer;

