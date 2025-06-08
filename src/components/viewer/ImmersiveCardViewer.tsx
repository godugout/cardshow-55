
import React, { useRef, useCallback } from 'react';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { 
  useEnhancedCardEffects, 
  type EffectValues 
} from './hooks/useEnhancedCardEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { useCardExport } from './hooks/useCardExport';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { StudioPanel } from './components/StudioPanel';
import { useViewerState } from './hooks/useViewerState';
import { useSafeZones } from './hooks/useSafeZones';
import { useCardNavigation } from './hooks/useCardNavigation';
import { useMouseInteraction } from './hooks/useMouseInteraction';
import { useAutoRotationEffect } from './hooks/useAutoRotationEffect';
import { useWheelZoom } from './hooks/useWheelZoom';
import { useSpacesState } from './hooks/useSpacesState';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { Enhanced3DSpaceCanvas } from './components/spaces/Enhanced3DSpaceCanvas';
import { ImmersiveCardBackground } from './components/ImmersiveCardBackground';
import { ImmersiveCardLayoutElements } from './components/ImmersiveCardLayoutElements';

// Update the interface to support card navigation and spaces
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
  // Main viewer state
  const viewerState = useViewerState();
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
    handleZoom
  } = viewerState;

  // Spaces state for 3D environments
  const spacesState = useSpacesState();
  const {
    spaceState,
    setSelectedTemplate,
    addCard,
    removeCard,
    updateCardPosition,
    toggleCardSelection,
    setEditMode,
    templates
  } = spacesState;

  // Determine if we're in 3D space mode
  const isSpaceMode = !!spaceState.selectedTemplate;

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

  // Navigation logic
  const cardNavigation = useCardNavigation({
    cards,
    currentCardIndex,
    onCardChange,
    setIsFlipped
  });

  // Safe zone detection
  const { isInSafeZone } = useSafeZones({
    panelWidth: 320,
    showPanel: showCustomizePanel,
    showStats,
    hasNavigation: cardNavigation.hasMultipleCards
  });

  // Mouse interaction
  const mouseInteraction = useMouseInteraction({
    rotation,
    setRotation,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    setAutoRotate,
    setMousePosition,
    setIsHoveringControls,
    allowRotation,
    autoRotate,
    isInSafeZone
  });

  // Auto-rotation effect
  useAutoRotationEffect({
    autoRotate,
    isDragging,
    setRotation
  });

  // Wheel zoom
  useWheelZoom({
    containerRef: mouseInteraction.containerRef,
    handleZoom,
    isInSafeZone
  });

  // Export functionality
  const { exportCard, isExporting, exportProgress } = useCardExport({
    cardRef: cardContainerRef,
    card,
    onRotationChange: setRotation,
    onEffectChange: handleEffectChange,
    effectValues
  });

  // Style generation hook
  const { getFrameStyles, getEnhancedEffectStyles, getEnvironmentStyle, SurfaceTexture } = useCardEffects({
    card,
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

  // Event handlers
  const handleDownloadClick = useCallback(() => {
    setShowExportDialog(true);
  }, [setShowExportDialog]);

  const handleShareClick = useCallback(() => {
    if (onShare) {
      onShare(card);
    }
  }, [onShare, card]);

  // Enhanced combo application with validation
  const handleComboApplication = useCallback((combo: any) => {
    console.log('🚀 Applying combo with enhanced synchronization:', combo.id);
    
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

  // Enhanced manual effect change with state tracking
  const handleManualEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    if (!isApplyingPreset) {
      setSelectedPresetId(undefined);
    }
    handleEffectChange(effectId, parameterId, value);
  }, [handleEffectChange, isApplyingPreset, setSelectedPresetId]);

  // Enhanced reset that includes all state
  const handleResetWithEffects = useCallback(() => {
    handleReset();
    resetAllEffects();
    validateEffectState();
    setSelectedTemplate(null); // Also reset spaces mode
  }, [handleReset, resetAllEffects, validateEffectState, setSelectedTemplate]);

  // Handle template selection - this switches to 3D space mode
  const handleTemplateSelect = useCallback((template: any) => {
    setSelectedTemplate(template);
    if (template && card) {
      // Add current card to the space when template is selected
      addCard(card);
    }
  }, [setSelectedTemplate, addCard, card]);

  if (!isOpen) return null;

  const panelWidth = 380;
  const shouldShowPanel = showCustomizePanel;

  return (
    <>
      <div 
        ref={mouseInteraction.containerRef}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isFullscreen ? 'p-0' : 'p-8'
        } ${shouldShowPanel ? `pr-[${panelWidth + 32}px]` : ''}`}
        style={{
          ...getEnvironmentStyle(),
          paddingRight: shouldShowPanel ? `${panelWidth + 32}px` : isFullscreen ? '0' : '32px'
        }}
        onMouseMove={mouseInteraction.handleMouseMove}
        onMouseUp={mouseInteraction.handleDragEnd}
        onMouseLeave={mouseInteraction.handleDragEnd}
      >
        <ImmersiveCardBackground
          selectedScene={selectedScene}
          mousePosition={mousePosition}
          ambient={ambient}
          getEnvironmentStyle={getEnvironmentStyle}
        />

        <ImmersiveCardLayoutElements
          onClose={onClose}
          shouldShowPanel={shouldShowPanel}
          setShowCustomizePanel={setShowCustomizePanel}
          card={card}
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          isHoveringControls={isHoveringControls}
          showEffects={showEffects}
          setShowEffects={setShowEffects}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          handleResetWithEffects={handleResetWithEffects}
          handleZoom={handleZoom}
          hasMultipleCards={cardNavigation.hasMultipleCards}
          currentCardIndex={currentCardIndex}
          totalCards={cards.length}
          canGoPrev={cardNavigation.canGoPrev}
          canGoNext={cardNavigation.canGoNext}
          handlePreviousCard={cardNavigation.handlePreviousCard}
          handleNextCard={cardNavigation.handleNextCard}
          showStats={showStats}
          isFlipped={isFlipped}
        />

        {/* Conditional rendering: 3D Space or Single Card */}
        <div ref={cardContainerRef}>
          {isSpaceMode ? (
            // 3D Space Mode
            <Enhanced3DSpaceCanvas
              spaceCards={spaceState.cards}
              template={spaceState.selectedTemplate}
              effectValues={effectValues}
              selectedScene={selectedScene}
              selectedLighting={selectedLighting}
              materialSettings={materialSettings}
              overallBrightness={overallBrightness}
              interactiveLighting={interactiveLighting}
              isEditMode={spaceState.isEditMode}
              onCardSelect={toggleCardSelection}
              onCardPositionChange={updateCardPosition}
            />
          ) : (
            // Single Card Mode
            <EnhancedCardContainer
              card={card}
              isFlipped={isFlipped}
              isHovering={isHovering}
              showEffects={showEffects}
              effectValues={effectValues}
              mousePosition={mousePosition}
              rotation={rotation}
              zoom={zoom}
              isDragging={isDragging}
              frameStyles={getFrameStyles()}
              enhancedEffectStyles={getEnhancedEffectStyles()}
              SurfaceTexture={SurfaceTexture}
              interactiveLighting={interactiveLighting}
              selectedScene={selectedScene}
              selectedLighting={selectedLighting}
              materialSettings={materialSettings}
              overallBrightness={overallBrightness}
              showBackgroundInfo={!shouldShowPanel}
              onMouseDown={mouseInteraction.handleDragStart}
              onMouseMove={mouseInteraction.handleDrag}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => setIsFlipped(!isFlipped)}
            />
          )}
        </div>
      </div>

      {/* Studio Panel with Spaces Integration */}
      <StudioPanel
        isVisible={shouldShowPanel}
        onClose={() => setShowCustomizePanel(false)}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        effectValues={effectValues}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        materialSettings={materialSettings}
        onSceneChange={setSelectedScene}
        onLightingChange={setSelectedLighting}
        onEffectChange={handleManualEffectChange}
        onBrightnessChange={setOverallBrightness}
        onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
        onMaterialSettingsChange={setMaterialSettings}
        selectedPresetId={selectedPresetId}
        onPresetSelect={setSelectedPresetId}
        onApplyCombo={handleComboApplication}
        isApplyingPreset={isApplyingPreset}
        currentCard={card}
        // Spaces integration props
        spaceState={spaceState}
        spacesTemplates={templates}
        onTemplateSelect={handleTemplateSelect}
        onAddCardToSpace={() => card && addCard(card)}
        onRemoveCardFromSpace={removeCard}
        onToggleEditMode={() => setEditMode(!spaceState.isEditMode)}
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
