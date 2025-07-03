
import React, { useRef, useEffect } from 'react';
import type { ExtendedImmersiveCardViewerProps } from './types/ImmersiveViewerTypes';
import { useUnifiedCardState } from './hooks/useUnifiedCardState';
import { useViewerInteractionManager } from './hooks/useViewerInteractionManager';
import { useCardExport } from './hooks/useCardExport';
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

  // Use the unified state hook
  const { state, actions, validateEffectState, isApplyingPreset } = useUnifiedCardState(card);

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
    showCustomizePanel: state.showCustomizePanel,
    showStats,
    autoRotate: state.autoRotate,
    isDragging: state.isDragging,
    rotation: state.rotation,
    dragStart: state.dragStart,
    setIsDragging: actions.setIsDragging,
    setDragStart: actions.setDragStart,
    setAutoRotate: actions.setAutoRotate,
    setRotation: actions.setRotation,
    setMousePosition: actions.setMousePosition,
    setIsHoveringControls: actions.setIsHoveringControls,
    handleZoom: actions.handleZoom
  });

  // Export functionality
  const { exportCard, isExporting, exportProgress } = useCardExport({
    cardRef: cardContainerRef,
    card,
    onRotationChange: actions.setRotation,
    onEffectChange: () => {},
    effectValues: state.effectValues
  });

  // Enhanced reset that includes all state
  const handleResetWithEffects = (resetAllEffects: () => void) => {
    console.log('🔄 ImmersiveCardViewer: Reset with effects');
    actions.handleReset();
    resetAllEffects();
  };

  // Enhanced combo application - no auto-flip, only style effects
  const handleApplyCombo = (combo: any, applyPreset: (preset: any, presetId?: string) => void) => {
    console.log('🚀 ImmersiveCardViewer: Applying style combo:', combo.id, 'Full combo:', combo);
    
    // Update viewer state
    actions.setSelectedPresetId(combo.id);
    if (combo.scene) {
      actions.setSelectedScene(combo.scene);
    }
    if (combo.lighting) {
      actions.setSelectedLighting(combo.lighting);
    }
    
    // Apply the actual effects to the renderer (no card flipping)
    if (combo.effects && applyPreset) {
      console.log('🎨 ImmersiveCardViewer: Applying effects to renderer:', combo.effects);
      applyPreset(combo.effects, combo.id);
    } else {
      console.warn('⚠️ ImmersiveCardViewer: No effects or applyPreset function available', {
        hasEffects: !!combo.effects,
        hasApplyPreset: !!applyPreset,
        effectsType: typeof combo.effects
      });
    }
  };

  if (!isOpen) return null;

  return (
    <ViewerEffectsManager
      card={card}
      viewerState={state}
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
              isFullscreen={state.isFullscreen}
              showCustomizePanel={state.showCustomizePanel}
              setShowCustomizePanel={actions.setShowCustomizePanel}
              isHovering={state.isHovering}
              setIsHovering={actions.setIsHovering}
              isHoveringControls={state.isHoveringControls}
              showEffects={state.showEffects}
              setShowEffects={actions.setShowEffects}
              autoRotate={state.autoRotate}
              setAutoRotate={actions.setAutoRotate}
              isFlipped={state.isFlipped}
              setIsFlipped={actions.setIsFlipped}
              showStats={showStats}
              effectValues={effectValues}
              selectedScene={state.selectedScene}
              selectedLighting={state.selectedLighting}
              materialSettings={state.materialSettings}
              overallBrightness={state.overallBrightness}
              interactiveLighting={state.interactiveLighting}
              mousePosition={state.mousePosition}
              rotation={state.rotation}
              zoom={state.zoom}
              isDragging={state.isDragging}
              frameStyles={frameStyles}
              enhancedEffectStyles={enhancedEffectStyles}
              SurfaceTexture={<div style={surfaceTextureStyles} />}
              environmentControls={state.environmentControls}
              containerRef={containerRef}
              cardContainerRef={cardContainerRef}
              handleMouseMove={handleMouseMove}
              handleDragStart={handleDragStart}
              handleDrag={handleDrag}
              handleDragEnd={handleDragEnd}
              handleZoom={actions.handleZoom}
              handleResetWithEffects={() => handleResetWithEffects(resetAllEffects)}
              handleResetCamera={actions.handleResetCamera}
              onCardClick={actions.onCardClick}
              hasMultipleCards={hasMultipleCards}
              solidCardTransition={state.solidCardTransition}
              selectedPresetId={state.selectedPresetId}
            />
          </ViewerActionsManager>

          {/* Studio Panel with Environment Controls */}
          <StudioPanel
            isVisible={state.showCustomizePanel}
            onClose={() => actions.setShowCustomizePanel(false)}
            selectedScene={state.selectedScene}
            selectedLighting={state.selectedLighting}
            effectValues={effectValues}
            overallBrightness={state.overallBrightness}
            interactiveLighting={state.interactiveLighting}
            materialSettings={state.materialSettings}
            environmentControls={state.environmentControls}
            onSceneChange={actions.setSelectedScene}
            onLightingChange={actions.setSelectedLighting}
            onEffectChange={handleEffectChange}
            onBrightnessChange={actions.setOverallBrightness}
            onInteractiveLightingToggle={() => actions.setInteractiveLighting(!state.interactiveLighting)}
            onMaterialSettingsChange={actions.setMaterialSettings}
            selectedPresetId={state.selectedPresetId}
            onPresetSelect={actions.setSelectedPresetId}
            onApplyCombo={(combo) => handleApplyCombo(combo, applyPreset)}
            isApplyingPreset={isApplyingPreset}
            onResetCamera={actions.handleResetCamera}
            solidCardTransition={state.solidCardTransition}
            onSolidCardTransitionChange={actions.setSolidCardTransition}
          />

          {/* Export Options Dialog */}
          <ExportOptionsDialog
            isOpen={state.showExportDialog}
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
