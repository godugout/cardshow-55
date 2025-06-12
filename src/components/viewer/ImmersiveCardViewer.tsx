
import React, { useRef, useEffect, useState } from 'react';
import type { ImmersiveCardViewerProps } from './types';
import { useImmersiveViewerState } from './hooks/useImmersiveViewerState';
import { ImmersiveViewerLayout } from './components/ImmersiveViewerLayout';
import { AutoRotationManager } from './components/AutoRotationManager';
import { StudioPanel } from './components/StudioPanel';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';

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
  console.log('🎯 ImmersiveCardViewer: Rendering with enhanced 360° capabilities:', card?.title);

  // Use the main state management hook
  const {
    viewerState,
    effectValues,
    totalEffectIntensity,
    adaptedCard,
    viewerInteractions,
    exportHook,
    cardEffectsHook,
    handleComboApplication,
    handleManualEffectChange,
    handleResetWithEffects,
    handleShareClick,
    handleDownloadClick,
    isApplyingPreset,
    validateEffectState
  } = useImmersiveViewerState({
    card,
    allowRotation,
    onShare
  });

  // Refs
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Navigation logic
  const hasMultipleCards = cards.length > 1;

  // Add environment controls state
  const [environmentControls, setEnvironmentControls] = useState({
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  });

  // Enhanced state validation on card change
  useEffect(() => {
    if (card) {
      validateEffectState();
    }
  }, [card, validateEffectState]);

  if (!isOpen || !card) {
    console.log('🎯 ImmersiveCardViewer: Not rendering - isOpen:', isOpen, 'card:', !!card);
    return null;
  }

  const panelWidth = 320;
  const shouldShowPanel = viewerState.showCustomizePanel;

  return (
    <>
      {/* Auto-rotation Manager */}
      <AutoRotationManager
        autoRotate={viewerState.autoRotate}
        isDragging={viewerState.isDragging}
        setRotation={viewerState.setRotation}
      />

      {/* Main Viewer Layout */}
      <ImmersiveViewerLayout
        card={card}
        cards={cards}
        currentCardIndex={currentCardIndex}
        onCardChange={onCardChange}
        onClose={onClose}
        showStats={showStats}
        isFullscreen={viewerState.isFullscreen}
        shouldShowPanel={shouldShowPanel}
        panelWidth={panelWidth}
        hasMultipleCards={hasMultipleCards}
        // State props
        backgroundType={viewerState.backgroundType}
        selectedSpace={viewerState.selectedSpace}
        spaceControls={viewerState.spaceControls}
        adaptedCard={adaptedCard}
        selectedScene={viewerState.selectedScene}
        selectedLighting={viewerState.selectedLighting}
        mousePosition={viewerState.mousePosition}
        isHovering={viewerState.isHovering}
        effectValues={effectValues}
        materialSettings={viewerState.materialSettings}
        overallBrightness={viewerState.overallBrightness}
        interactiveLighting={viewerState.interactiveLighting}
        showEffects={viewerState.showEffects}
        autoRotate={viewerState.autoRotate}
        isFlipped={viewerState.isFlipped}
        zoom={viewerState.zoom}
        rotation={viewerState.rotation}
        isDragging={viewerState.isDragging}
        isHoveringControls={viewerState.isHoveringControls}
        // Handlers
        onCardClick={viewerState.onCardClick}
        onResetCamera={viewerState.handleResetCamera}
        onOpenStudio={() => viewerState.setShowCustomizePanel(true)}
        onToggleEffects={() => viewerState.setShowEffects(!viewerState.showEffects)}
        onToggleAutoRotate={() => viewerState.setAutoRotate(!viewerState.autoRotate)}
        onResetWithEffects={handleResetWithEffects}
        onZoomIn={() => viewerState.handleZoom(0.1)}
        onZoomOut={() => viewerState.handleZoom(-0.1)}
        setIsFlipped={viewerState.setIsFlipped}
        setIsHovering={viewerState.setIsHovering}
        setIsHoveringControls={viewerState.setIsHoveringControls}
        // Viewer interactions
        cardContainerRef={cardContainerRef}
        containerRef={viewerInteractions.containerRef}
        handleMouseMove={viewerInteractions.handleMouseMove}
        handleDragStart={viewerInteractions.handleDragStart}
        handleDragEnd={viewerInteractions.handleDragEnd}
        gripPoint={viewerInteractions.gripPoint}
        physicsState={viewerInteractions.physicsState}
        rotationIndicator={viewerInteractions.rotationIndicator}
        // Effects
        frameStyles={cardEffectsHook.getFrameStyles()}
        enhancedEffectStyles={cardEffectsHook.getEnhancedEffectStyles()}
        SurfaceTexture={cardEffectsHook.SurfaceTexture}
        // Environment
        environmentControls={environmentControls}
      />

      {/* Studio Panel */}
      <StudioPanel
        isVisible={shouldShowPanel}
        onClose={() => viewerState.setShowCustomizePanel(false)}
        selectedScene={viewerState.selectedScene}
        selectedLighting={viewerState.selectedLighting}
        effectValues={effectValues}
        overallBrightness={viewerState.overallBrightness}
        interactiveLighting={viewerState.interactiveLighting}
        materialSettings={viewerState.materialSettings}
        environmentControls={environmentControls}
        onSceneChange={viewerState.setSelectedScene}
        onLightingChange={viewerState.setSelectedLighting}
        onEffectChange={handleManualEffectChange}
        onBrightnessChange={viewerState.setOverallBrightness}
        onInteractiveLightingToggle={() => viewerState.setInteractiveLighting(!viewerState.interactiveLighting)}
        onMaterialSettingsChange={viewerState.setMaterialSettings}
        selectedPresetId={viewerState.selectedPresetId}
        onPresetSelect={viewerState.setSelectedPresetId}
        onApplyCombo={handleComboApplication}
        isApplyingPreset={isApplyingPreset}
        backgroundType={viewerState.backgroundType}
        onBackgroundTypeChange={viewerState.setBackgroundType}
        onSpaceChange={viewerState.setSelectedSpace}
        selectedSpace={viewerState.selectedSpace}
        spaceControls={viewerState.spaceControls}
        onSpaceControlsChange={viewerState.setSpaceControls}
        onResetCamera={viewerState.handleResetCamera}
      />

      {/* Export Options Dialog */}
      <ExportOptionsDialog
        isOpen={viewerState.showExportDialog}
        onClose={() => viewerState.setShowExportDialog(false)}
        onExport={exportHook.exportCard}
        isExporting={exportHook.isExporting}
        exportProgress={exportHook.exportProgress}
        cardTitle={card.title}
      />
    </>
  );
};

export default ImmersiveCardViewer;
