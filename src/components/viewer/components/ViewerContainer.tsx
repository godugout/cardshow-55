
import React, { useState, useCallback } from 'react';
import { ViewerHeader } from './ViewerHeader';
import { ViewerControls } from './ViewerControls';
import { CompactCardDetails } from './CompactCardDetails';
import { ViewerInfoPanel } from './ViewerInfoPanel';
import { StudioPanel } from './StudioPanel';
import { ExportOptionsDialog } from './ExportOptionsDialog';
import { ViewerBackground } from './ViewerBackground';
import { ViewerCardDisplay } from './ViewerCardDisplay';
import { ViewerInteractionLayer } from './ViewerInteractionLayer';
import { useViewerEffectsManager } from '../hooks/useViewerEffectsManager';
import { useViewerState } from '../hooks/useViewerState';
import { useCardExport } from '../hooks/useCardExport';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface ViewerContainerProps {
  card: CardData;
  cards: any[];
  currentCardIndex: number;
  onCardChange?: (index: number) => void;
  isOpen: boolean;
  onClose?: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (card: CardData) => void;
  allowRotation: boolean;
  showStats: boolean;
  ambient: boolean;
}

export const ViewerContainer: React.FC<ViewerContainerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen = true,
  onClose,
  onShare,
  allowRotation = true,
  showStats = true
}) => {
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
    handleReset,
    handleZoom,
    handleResetCamera,
    onCardClick
  } = viewerState;

  // Local state for effects management
  const [effectValues, setEffectValues] = useState<EffectValues>({});
  const [presetState, setPresetState] = useState<any>({});

  // Navigation logic
  const hasMultipleCards = cards.length > 1;

  // Export functionality
  const { exportCard, isExporting, exportProgress } = useCardExport({
    cardRef: { current: null },
    card,
    onRotationChange: setRotation,
    onEffectChange: () => {},
    effectValues
  });

  const handleDownloadClick = useCallback(() => {
    setShowExportDialog(true);
  }, [setShowExportDialog]);

  const handleShareClick = useCallback(() => {
    if (onShare) {
      onShare(card);
    }
  }, [onShare, card]);

  const handleEffectValuesChange = useCallback((values: EffectValues) => {
    setEffectValues(values);
  }, []);

  const handlePresetStateChange = useCallback((state: any) => {
    if (state.selectedScene) setSelectedScene(state.selectedScene);
    if (state.selectedLighting) setSelectedLighting(state.selectedLighting);
    if (state.selectedPresetId !== undefined) setSelectedPresetId(state.selectedPresetId);
    if (state.reset) {
      handleReset();
    }
    setPresetState(prev => ({ ...prev, ...state }));
  }, [setSelectedScene, setSelectedLighting, setSelectedPresetId, handleReset]);

  // Use the effects manager hook
  const effectsManager = useViewerEffectsManager({
    card,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation,
    isHovering,
    onEffectValuesChange: handleEffectValuesChange,
    onPresetStateChange: handlePresetStateChange
  });

  if (!isOpen) return null;

  const panelWidth = 320;
  const shouldShowPanel = showCustomizePanel;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center select-none ${
        isFullscreen ? 'p-0' : 'p-8'
      } ${shouldShowPanel ? `pr-[${panelWidth + 32}px]` : ''}`}
      style={{
        paddingRight: shouldShowPanel ? `${panelWidth + 32}px` : isFullscreen ? '0' : '32px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Background Renderer */}
      <ViewerBackground
        backgroundType={backgroundType}
        selectedSpace={selectedSpace}
        spaceControls={spaceControls}
        card={card}
        onCardClick={onCardClick}
        onCameraReset={handleResetCamera}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        mousePosition={mousePosition}
        isHovering={isHovering}
        effectValues={effectsManager.effectValues}
        materialSettings={materialSettings}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
      />

      {/* Interaction Layer - This handles ALL mouse events */}
      <ViewerInteractionLayer
        allowRotation={allowRotation}
        autoRotate={autoRotate}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        setDragStart={setDragStart}
        setAutoRotate={setAutoRotate}
        setRotation={setRotation}
        setMousePosition={setMousePosition}
        setIsHoveringControls={setIsHoveringControls}
        rotation={rotation}
        dragStart={dragStart}
        handleZoom={handleZoom}
        showCustomizePanel={showCustomizePanel}
        showStats={showStats}
        hasMultipleCards={hasMultipleCards}
      >
        {/* Header */}
        <ViewerHeader
          onClose={onClose}
          showStudioButton={!shouldShowPanel}
          onOpenStudio={() => setShowCustomizePanel(true)}
        />

        {/* Compact Card Details */}
        <div className="absolute bottom-20 left-4 z-20 select-none">
          <CompactCardDetails 
            card={card}
            effectValues={effectsManager.effectValues}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
          />
        </div>

        {/* Basic Controls */}
        <div className={`transition-opacity duration-200 ${isHoveringControls ? 'opacity-100 z-20' : 'opacity-100 z-10'}`}>
          <ViewerControls
            showEffects={showEffects}
            autoRotate={autoRotate}
            onToggleEffects={() => setShowEffects(!showEffects)}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            onReset={handleReset}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
          />
        </div>

        {/* Info Panel */}
        <ViewerInfoPanel
          showStats={showStats}
          isFlipped={isFlipped}
          shouldShowPanel={shouldShowPanel}
          hasMultipleCards={hasMultipleCards}
        />

        {/* Card Display - Events handled by ViewerInteractionLayer */}
        <ViewerCardDisplay
          card={card}
          cards={cards}
          currentCardIndex={currentCardIndex}
          onCardChange={onCardChange}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectsManager.effectValues}
          mousePosition={mousePosition}
          rotation={rotation}
          zoom={zoom}
          isDragging={isDragging}
          frameStyles={effectsManager.frameStyles}
          enhancedEffectStyles={effectsManager.enhancedEffectStyles}
          SurfaceTexture={effectsManager.SurfaceTexture}
          interactiveLighting={interactiveLighting}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          onMouseDown={(e) => console.log('🎯 Card mouse down:', e.clientX, e.clientY)}
          onMouseMove={(e) => console.log('🎯 Card mouse move:', e.clientX, e.clientY)}
          onMouseEnter={() => {
            console.log('🎯 Card mouse enter');
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            console.log('🎯 Card mouse leave');
            setIsHovering(false);
          }}
          onClick={() => console.log('🎯 Card clicked')}
        />
      </ViewerInteractionLayer>

      {/* Studio Panel */}
      <StudioPanel
        isVisible={shouldShowPanel}
        onClose={() => setShowCustomizePanel(false)}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        effectValues={effectsManager.effectValues}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        materialSettings={materialSettings}
        onSceneChange={setSelectedScene}
        onLightingChange={setSelectedLighting}
        onEffectChange={effectsManager.handleEffectChange}
        onBrightnessChange={setOverallBrightness}
        onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
        onMaterialSettingsChange={setMaterialSettings}
        selectedPresetId={selectedPresetId}
        onPresetSelect={setSelectedPresetId}
        onApplyCombo={effectsManager.handleComboApplication}
        isApplyingPreset={effectsManager.isApplyingPreset}
        backgroundType={backgroundType}
        onBackgroundTypeChange={setBackgroundType}
        onSpaceChange={setSelectedSpace}
        selectedSpace={selectedSpace}
        spaceControls={spaceControls}
        onSpaceControlsChange={setSpaceControls}
        onResetCamera={handleResetCamera}
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
    </div>
  );
};
