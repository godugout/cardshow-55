
import React, { useState, useCallback } from 'react';
import {
  Share2,
  Download,
  Maximize2,
  Minimize2,
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { ViewerControls } from './components/ViewerControls';
import { ViewerHeader } from './components/ViewerHeader';
import { StudioPanel } from './components/StudioPanel';
import { EnhancedEnvironmentSphere } from './components/EnhancedEnvironmentSphere';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { OptimizedSpaceRenderer } from './spaces/OptimizedSpaceRenderer';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { useViewerState } from './hooks/useViewerState';
import type { ImmersiveCardViewerProps, BackgroundType } from './types';

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card: providedCard,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen = true,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = true,
  ambient = false
}) => {
  // Use default card if none provided
  const card = providedCard || {
    id: 'default',
    title: 'Sample Card',
    image_url: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    description: 'A sample trading card for testing'
  };

  const {
    isFullscreen,
    rotation,
    setRotation,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    zoom,
    setZoom,
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
    selectedSpace,
    setSelectedSpace,
    spaceControls,
    setSpaceControls,
    handleReset,
    handleZoom,
    toggleFullscreen,
    handleResetCamera
  } = useViewerState();

  const { effectValues, handleEffectChange, handleApplyCombo, isApplyingPreset, environmentControls, setEnvironmentControls } = useEnhancedCardEffects();

  // Simplified background type state
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('scene');

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, [setMousePosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [setIsDragging, setDragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    if (!isHoveringControls) {
      setIsHovering(false);
    }
  }, [setIsDragging, setIsHovering, isHoveringControls]);

  const handleZoomIn = useCallback(() => {
    handleZoom(0.1);
  }, [handleZoom]);

  const handleZoomOut = useCallback(() => {
    handleZoom(-0.1);
  }, [handleZoom]);

  const handleNext = useCallback(() => {
    if (cards.length > 0 && onCardChange) {
      const nextIndex = (currentCardIndex + 1) % cards.length;
      onCardChange(cards[nextIndex], nextIndex);
    }
  }, [cards, currentCardIndex, onCardChange]);

  const handlePrev = useCallback(() => {
    if (cards.length > 0 && onCardChange) {
      const prevIndex = (currentCardIndex - 1 + cards.length) % cards.length;
      onCardChange(cards[prevIndex], prevIndex);
    }
  }, [cards, currentCardIndex, onCardChange]);

  // Unified rendering method that chooses between scene and 3D space rendering
  const renderViewer = () => {
    if (backgroundType === '3dSpace' && selectedSpace) {
      return (
        <OptimizedSpaceRenderer
          environment={selectedSpace}
          controls={spaceControls}
          card={card}
          onCameraReset={handleResetCamera}
          environmentIntensity={overallBrightness[0] / 100}
        />
      );
    }

    // Default to scene-based rendering with optimized container
    return (
      <div className="relative w-full h-full">
        <EnhancedEnvironmentSphere 
          scene={selectedScene}
          controls={environmentControls}
          mousePosition={mousePosition}
          isHovering={isHovering}
        />
        
        <EnhancedCardContainer
          card={card}
          effectValues={effectValues}
          rotation={rotation}
          zoom={zoom}
          isFlipped={isFlipped}
          autoRotate={autoRotate}
          showEffects={showEffects}
          materialSettings={materialSettings}
          lightingPreset={selectedLighting}
          environmentBrightness={overallBrightness[0] / 100}
          interactiveLightingEnabled={interactiveLighting}
          mousePosition={mousePosition}
          isHovering={isHovering}
          isDragging={isDragging}
          frameStyles={{}}
          enhancedEffectStyles={{}}
          SurfaceTexture={null}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsFlipped(!isFlipped)}
          environmentControls={environmentControls}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <div className="relative w-full h-full">
        {/* Main Viewer Area */}
        <div className="absolute inset-0">
          {renderViewer()}
        </div>

        {/* ViewerHeader */}
        <ViewerHeader
          onClose={onClose}
          showStudioButton={!showCustomizePanel}
          onOpenStudio={() => setShowCustomizePanel(true)}
        />

        {/* Bottom Controls */}
        <ViewerControls
          showEffects={showEffects}
          autoRotate={autoRotate}
          onToggleEffects={() => setShowEffects(!showEffects)}
          onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
          onReset={handleReset}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />

        {/* Card Navigation */}
        {cards.length > 1 && onCardChange && (
          <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Studio Panel */}
        <StudioPanel
          isVisible={showCustomizePanel}
          onClose={() => setShowCustomizePanel(false)}
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
          isApplyingPreset={isApplyingPreset}
          environmentControls={environmentControls}
          onEnvironmentControlsChange={setEnvironmentControls}
          backgroundType={backgroundType}
          onBackgroundTypeChange={setBackgroundType}
          onSpaceChange={setSelectedSpace}
          selectedSpace={selectedSpace}
          spaceControls={spaceControls}
          onSpaceControlsChange={setSpaceControls}
          onResetCamera={handleResetCamera}
        />

        {/* Export Dialog */}
        <ExportOptionsDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          onExport={() => {}}
          isExporting={false}
          exportProgress={0}
          cardTitle={card.title || 'Card'}
        />
      </div>
    </div>
  );
};
