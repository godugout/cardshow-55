import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { ImmersiveCardViewerProps } from './types';
import { 
  useEnhancedCardEffects, 
  type EffectValues 
} from './hooks/useEnhancedCardEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { ViewerControls } from './components/ViewerControls';
import { SimplifiedEnhancedCardContainer } from './components/SimplifiedEnhancedCardContainer';
import { CompactCardDetails } from './components/CompactCardDetails';
import { useCardExport } from './hooks/useCardExport';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { ViewerHeader } from './components/ViewerHeader';
import { ViewerInfoPanel } from './components/ViewerInfoPanel';
import { StudioPanel } from './components/StudioPanel';
import { useViewerState } from './hooks/useViewerState';
import { adaptCardForSpaceRenderer } from './utils/cardAdapter';
import { BackgroundRenderer } from './components/BackgroundRenderer';
import { useSimplifiedViewerInteractions } from './hooks/useSimplifiedViewerInteractions';
import { CardNavigationHandler } from './components/CardNavigationHandler';

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

  // Use the custom state hook
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
  const animationRef = useRef<number>();

  // Navigation logic
  const hasMultipleCards = cards.length > 1;

  // Simplified viewer interactions hook with enhanced physics
  const { 
    containerRef, 
    handleMouseMove, 
    handleDragStart, 
    handleDragEnd,
    gripPoint,
    physicsState,
    rotationIndicator
  } = useSimplifiedViewerInteractions({
    allowRotation,
    autoRotate,
    isDragging,
    setIsDragging,
    setDragStart,
    setAutoRotate,
    setRotation,
    setMousePosition,
    rotation,
    dragStart,
    handleZoom,
    effectIntensity: totalEffectIntensity // Pass effect intensity for dynamic physics
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
  const { getFrameStyles, getEnhancedEffectStyles, SurfaceTexture } = useCardEffects({
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

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isDragging) {
      const animate = () => {
        setRotation(prev => ({
          x: Math.sin(Date.now() * 0.0005) * 10,
          y: prev.y + 0.5
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate, isDragging, setRotation]);

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

  // Add environment controls state
  const [environmentControls, setEnvironmentControls] = useState({
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  });

  if (!isOpen || !card) {
    console.log('🎯 ImmersiveCardViewer: Not rendering - isOpen:', isOpen, 'card:', !!card);
    return null;
  }

  const panelWidth = 320;
  const shouldShowPanel = showCustomizePanel;

  // Adapt card for space renderer
  const adaptedCard = adaptCardForSpaceRenderer(card);

  // Calculate total effect intensity for physics feedback
  const totalEffectIntensity = React.useMemo(() => {
    if (!effectValues) return 0;
    return Object.values(effectValues).reduce((total, effect) => {
      const intensity = effect.intensity as number;
      return total + (typeof intensity === 'number' ? intensity : 0);
    }, 0);
  }, [effectValues]);

  return (
    <>
      <div 
        ref={containerRef}
        className={`fixed inset-0 z-50 bg-black/90 flex items-center justify-center select-none ${
          isFullscreen ? 'p-0' : 'p-8'
        }`}
        style={{
          paddingRight: shouldShowPanel ? `${panelWidth + 32}px` : isFullscreen ? '0' : '32px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Background - Only show when not in plain mode */}
        {backgroundType !== 'plain' && (
          <BackgroundRenderer
            backgroundType={backgroundType}
            selectedSpace={selectedSpace}
            spaceControls={spaceControls}
            adaptedCard={adaptedCard}
            onCardClick={onCardClick}
            onCameraReset={handleResetCamera}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            mousePosition={mousePosition}
            isHovering={isHovering}
            effectValues={effectValues}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
          />
        )}

        {/* Header */}
        <ViewerHeader
          onClose={onClose}
          showStudioButton={!shouldShowPanel}
          onOpenStudio={() => setShowCustomizePanel(true)}
        />

        {/* Main Card Display - Enhanced with 360° Physics */}
        <div 
          ref={cardContainerRef} 
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <div className="pointer-events-auto">
            <SimplifiedEnhancedCardContainer
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
              environmentControls={environmentControls}
              showBackgroundInfo={false}
              onMouseDown={handleDragStart}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => setIsFlipped(!isFlipped)}
              gripPoint={gripPoint}
              physicsState={physicsState}
              rotationIndicator={rotationIndicator}
            />
          </div>
        </div>

        {/* Compact Card Details */}
        <div className="absolute bottom-20 left-4 z-20 select-none pointer-events-auto">
          <CompactCardDetails 
            card={card}
            effectValues={effectValues}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
          />
        </div>

        {/* Basic Controls */}
        <div className={`absolute bottom-4 left-4 transition-opacity duration-200 z-20 pointer-events-auto ${isHoveringControls ? 'opacity-100' : 'opacity-80'}`}>
          <ViewerControls
            showEffects={showEffects}
            autoRotate={autoRotate}
            onToggleEffects={() => setShowEffects(!showEffects)}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            onReset={handleResetWithEffects}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
          />
        </div>

        {/* Card Navigation Controls */}
        <CardNavigationHandler
          cards={cards}
          currentCardIndex={currentCardIndex}
          onCardChange={onCardChange}
          setIsFlipped={setIsFlipped}
        />

        {/* Info Panel */}
        <ViewerInfoPanel
          showStats={showStats}
          isFlipped={isFlipped}
          shouldShowPanel={shouldShowPanel}
          hasMultipleCards={hasMultipleCards}
        />
      </div>

      {/* Studio Panel */}
      <StudioPanel
        isVisible={shouldShowPanel}
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
        onApplyCombo={handleComboApplication}
        isApplyingPreset={isApplyingPreset}
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
    </>
  );
};

export default ImmersiveCardViewer;
