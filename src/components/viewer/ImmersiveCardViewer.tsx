
import React, { useRef } from 'react';
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
import { useStudioEffectsBridge } from './hooks/useStudioEffectsBridge';

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

  if (!isOpen) return null;

  return (
    <ViewerEffectsManager
      card={card}
      viewerState={viewerState}
      onEffectChange={() => {}}
      onResetAllEffects={() => {}}
      onApplyPreset={() => {}}
      onValidateEffectState={() => {}}
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
      }) => {
        console.log('🎮 ImmersiveCardViewer: Current effectValues:', effectValues);

        // Studio Effects Bridge - NOW receives actual effect values
        const studioBridge = useStudioEffectsBridge({
          selectedScene: viewerState.selectedScene,
          selectedLighting: viewerState.selectedLighting,
          effectValues: effectValues, // Pass actual effect values here
          materialSettings: viewerState.materialSettings,
          overallBrightness: viewerState.overallBrightness,
          interactiveLighting: viewerState.interactiveLighting
        });

        console.log('🌉 Studio Bridge Output:', studioBridge.bridgedEffects);

        // Export functionality
        const { exportCard, isExporting, exportProgress } = useCardExport({
          cardRef: cardContainerRef,
          card,
          onRotationChange: setRotation,
          onEffectChange: handleEffectChange,
          effectValues: studioBridge.bridgedEffects
        });

        // Enhanced reset that includes all state
        const handleResetWithEffects = () => {
          handleReset();
          resetAllEffects();
        };

        // Enhanced combo application that properly updates effects
        const handleApplyCombo = (combo: any) => {
          console.log('🚀 Applying style combo with effects:', combo.id, combo.effects);
          
          // Set the preset ID first
          actions.setSelectedPresetId(combo.id);
          
          // Apply the preset effects through the ViewerEffectsManager
          applyPreset(combo.effects, combo.id);
          
          // Apply scene and lighting changes if present
          if (combo.scene) {
            actions.setSelectedScene(combo.scene);
          }
          if (combo.lighting) {
            actions.setSelectedLighting(combo.lighting);
          }
        };

        // Use the bridged effects for the card rendering
        const finalEffectValues = studioBridge.bridgedEffects;

        return (
          <>
            <ViewerActionsManager
              card={card}
              onShare={onShare}
              effectValues={finalEffectValues}
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
                effectValues={finalEffectValues}
                selectedScene={viewerState.selectedScene}
                selectedLighting={viewerState.selectedLighting}
                materialSettings={viewerState.materialSettings}
                overallBrightness={viewerState.overallBrightness}
                interactiveLighting={studioBridge.enhancedInteractiveLighting}
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
                handleResetWithEffects={handleResetWithEffects}
                handleResetCamera={handleResetCamera}
                onCardClick={onCardClick}
                hasMultipleCards={hasMultipleCards}
                solidCardTransition={viewerState.solidCardTransition}
                dynamicBrightness={studioBridge.dynamicBrightness}
                activeEffectsCount={studioBridge.activeEffectsCount}
              />
            </ViewerActionsManager>

            {/* Studio Panel with proper effect handling */}
            <StudioPanel
              isVisible={viewerState.showCustomizePanel}
              onClose={() => actions.setShowCustomizePanel(false)}
              selectedScene={viewerState.selectedScene}
              selectedLighting={viewerState.selectedLighting}
              effectValues={finalEffectValues}
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
              onApplyCombo={handleApplyCombo}
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
        );
      }}
    </ViewerEffectsManager>
  );
};

export default ImmersiveCardViewer;
