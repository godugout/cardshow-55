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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { ViewerControls } from './components/ViewerControls';
import { StudioPanel } from './components/StudioPanel';
import { EnhancedEnvironmentSphere } from './components/EnhancedEnvironmentSphere';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { useViewerState } from './hooks/useViewerState';
import type { ImmersiveCardViewerProps, BackgroundType } from './types';
import type { SpaceEnvironment, SpaceControls } from './spaces/types';
import { SpaceRenderer3D } from './spaces/SpaceRenderer3D';

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
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
  ambient = false
}) => {
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

  // Background type state
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

  const handleRotate = useCallback((deltaX: number, deltaY: number) => {
    setRotation(prev => ({
      x: prev.x + deltaY * 0.2,
      y: prev.y + deltaX * 0.2
    }));
  }, [setRotation]);

  const handleNext = useCallback(() => {
    if (cards.length > 0) {
      const nextIndex = (currentCardIndex + 1) % cards.length;
      onCardChange?.(cards[nextIndex], nextIndex);
    }
  }, [cards, currentCardIndex, onCardChange]);

  const handlePrev = useCallback(() => {
    if (cards.length > 0) {
      const prevIndex = (currentCardIndex - 1 + cards.length) % cards.length;
      onCardChange?.(cards[prevIndex], prevIndex);
    }
  }, [cards, currentCardIndex, onCardChange]);

  const renderViewer = () => {
    if (backgroundType === '3dSpace' && selectedSpace) {
      return (
        <SpaceRenderer3D
          environment={selectedSpace}
          controls={spaceControls}
          onCameraReset={handleResetCamera}
          environmentIntensity={overallBrightness[0] / 100}
          card={card}
        >
          {/* No additional children needed as Card3D is rendered inside SpaceRenderer3D */}
        </SpaceRenderer3D>
      );
    }

    // Default to scene-based rendering
    return (
      <div className="relative w-full h-full">
        <EnhancedEnvironmentSphere 
          scene={selectedScene}
          controls={environmentControls || {
            depthOfField: 0,
            parallaxIntensity: 0.5,
            fieldOfView: 75,
            atmosphericDensity: 0.5
          }}
          mousePosition={mousePosition}
          isHovering={isHovering}
        />
        
        <EnhancedCardContainer
          card={card}
          effects={effectValues}
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

        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExportDialog(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
          >
            <Download className="w-4 h-4 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare?.(card)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
          >
            <Share2 className="w-4 h-4 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomizePanel(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
          >
            <Settings className="w-4 h-4 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
          >
            <X className="w-4 h-4 text-white" />
          </Button>
        </div>

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
        {cards.length > 1 && (
          <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
            >
              <ChevronRight className="w-4 h-4 text-white" />
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
          card={card}
          onExport={() => {}}
          isExporting={false}
          exportProgress={0}
          cardTitle={card.title || 'Card'}
        />
      </div>
    </div>
  );
};
