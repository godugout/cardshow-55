
import React, { useRef, useEffect } from 'react';
import type { ExtendedImmersiveCardViewerProps } from './types/ImmersiveViewerTypes';
import { useViewerState } from './hooks/useViewerState';
import { useViewerInteractionManager } from './hooks/useViewerInteractionManager';
import { useCardExport } from './hooks/useCardExport';
import { useImmersiveViewerState } from './hooks/useImmersiveViewerState';
import { ViewerEffectsManager } from './components/ViewerEffectsManager';
import { ViewerActionsManager } from './components/ViewerActionsManager';
import { ViewerLayout } from './components/ViewerLayout';
import { StudioPanel } from './components/StudioPanel';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';

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
  // Refs
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Use the custom state hooks
  const viewerStateHook = useViewerState();
  const { viewerState, actions } = useImmersiveViewerState();

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
    isHovering,
    setIsHovering,
    isHoveringControls,
    setIsHoveringControls,
    handleReset,
    handleZoom,
    handleResetCamera,
    onCardClick
  } = viewerStateHook;

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
    showCustomizePanel: viewerState.showCustomizePanel,
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
    onEffectChange: () => {},
    effectValues: {}
  });

  // Enhanced reset that includes all state
  const handleResetWithEffects = (resetAllEffects: () => void) => {
    console.log('🔄 ImmersiveCardViewer: Reset with effects');
    handleReset();
    resetAllEffects();
  };

  // Enhanced combo application with auto-flip and timed flip-back
  const handleApplyCombo = (combo: any, applyPreset: (preset: any, presetId?: string) => void) => {
    console.log('🚀 ImmersiveCardViewer: Applying style combo:', combo.id, 'Full combo:', combo);
    
    // Step 1: Flip card to back to show the style effects
    setIsFlipped(true);
    console.log('🔄 ImmersiveCardViewer: Flipped card to back for style preview');
    
    // Update viewer state
    actions.setSelectedPresetId(combo.id);
    if (combo.scene) {
      actions.setSelectedScene(combo.scene);
    }
    if (combo.lighting) {
      actions.setSelectedLighting(combo.lighting);
    }
    
    // CRITICAL: Apply the actual effects to the renderer
    if (combo.effects && applyPreset) {
      console.log('🎨 ImmersiveCardViewer: Applying effects to renderer:', combo.effects);
      // Pass combo.effects (not combo) to applyPreset
      applyPreset(combo.effects, combo.id);
    } else {
      console.warn('⚠️ ImmersiveCardViewer: No effects or applyPreset function available', {
        hasEffects: !!combo.effects,
        hasApplyPreset: !!applyPreset,
        effectsType: typeof combo.effects
      });
    }

    // Step 2: Set timer to flip back to front after 3 seconds
    setTimeout(() => {
      setIsFlipped(false);
      console.log('🔄 ImmersiveCardViewer: Auto-flipped card back to front after 3 seconds');
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <ViewerEffectsManager
      card={card}
      viewerState={viewerState}
      onEffectChange={(effectId, parameterId, value) => {
        console.log('🎛️ ImmersiveCardViewer: Effect change received:', { effectId, parameterId, value });
      }}
      onResetAllEffects={() => {
        console.log('🔄 ImmersiveCardViewer: Reset all effects called');
      }}
      onApplyPreset={(preset, presetId) => {
        console.log('🎨 ImmersiveCardViewer: Apply preset called:', { preset, presetId });
      }}
      onValidateEffectState={() => {
        console.log('🔍 ImmersiveCardViewer: Validate effect state called');
      }}
    >
      {({
        effectValues,
        handleEffectChange,
        resetAllEffects,
        applyPreset,
        validateEffectState,
        isApplyingPreset,
        frameStyles,
        enhancedEffectStyles,
        surfaceTextureStyles
      }) => (
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
            setSelectedPresetId={actions.setSelectedPresetId}
            setSelectedScene={actions.setSelectedScene}
            setSelectedLighting={actions.setSelectedLighting}
            setShowExportDialog={actions.setShowExportDialog}
          >
            <ViewerLayout
              card={card}
              cards={cards}
              currentCardIndex={currentCardIndex}
              onCardChange={onCardChange}
              onClose={onClose}
              isFullscreen={isFullscreen}
              showCustomizePanel={viewerState.showCustomizePanel}
              setShowCustomizePanel={actions.setShowCustomizePanel}
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
              selectedScene={viewerState.selectedScene}
              selectedLighting={viewerState.selectedLighting}
              materialSettings={viewerState.materialSettings}
              overallBrightness={viewerState.overallBrightness}
              interactiveLighting={viewerState.interactiveLighting}
              mousePosition={mousePosition}
              rotation={rotation}
              zoom={zoom}
              isDragging={isDragging}
              frameStyles={frameStyles}
              enhancedEffectStyles={enhancedEffectStyles}
              SurfaceTexture={<div style={surfaceTextureStyles} />}
              environmentControls={viewerState.environmentControls}
              containerRef={containerRef}
              cardContainerRef={cardContainerRef}
              handleMouseMove={handleMouseMove}
              handleDragStart={handleDragStart}
              handleDrag={handleDrag}
              handleDragEnd={handleDragEnd}
              handleZoom={handleZoom}
              handleResetWithEffects={() => handleResetWithEffects(resetAllEffects)}
              handleResetCamera={handleResetCamera}
              onCardClick={onCardClick}
              hasMultipleCards={hasMultipleCards}
              solidCardTransition={viewerState.solidCardTransition}
              selectedPresetId={viewerState.selectedPresetId}
            />
          </ViewerActionsManager>

          {/* Studio Panel with Environment Controls */}
          <StudioPanel
            isVisible={viewerState.showCustomizePanel}
            onClose={() => actions.setShowCustomizePanel(false)}
            selectedScene={viewerState.selectedScene}
            selectedLighting={viewerState.selectedLighting}
            effectValues={effectValues}
            overallBrightness={viewerState.overallBrightness}
            interactiveLighting={viewerState.interactiveLighting}
            materialSettings={viewerState.materialSettings}
            environmentControls={viewerState.environmentControls}
            onSceneChange={actions.setSelectedScene}
            onLightingChange={actions.setSelectedLighting}
            onEffectChange={handleEffectChange}
            onBrightnessChange={actions.setOverallBrightness}
            onInteractiveLightingToggle={() => actions.setInteractiveLighting(!viewerState.interactiveLighting)}
            onMaterialSettingsChange={actions.setMaterialSettings}
            selectedPresetId={viewerState.selectedPresetId}
            onPresetSelect={actions.setSelectedPresetId}
            onApplyCombo={(combo) => handleApplyCombo(combo, applyPreset)}
            isApplyingPreset={isApplyingPreset}
            onResetCamera={handleResetCamera}
            solidCardTransition={viewerState.solidCardTransition}
            onSolidCardTransitionChange={actions.setSolidCardTransition}
          />

          {/* Export Options Dialog */}
          <ExportOptionsDialog
            isOpen={viewerState.showExportDialog}
            onClose={() => actions.setShowExportDialog(false)}
            onExport={exportCard}
            isExporting={isExporting}
            exportProgress={exportProgress}
            cardTitle={card.title}
          />
        </>
      )}
    </ViewerEffectsManager>
  );
};

export default ImmersiveCardViewer;
