import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { ViewerUI } from './components/ViewerUI';
import { StudioPanel } from './components/StudioPanel';
import { StudioToggleButton } from './components/StudioToggleButton';
import { BackgroundRenderer } from './components/BackgroundRenderer';
import { useViewerState } from '@/hooks/useViewerState';
import { ViewerControls } from './components/ViewerControls';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import type { EffectValues } from './hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls, BackgroundType } from './types';
import type { SpaceEnvironment, SpaceControls } from './spaces/types';
import { useThrottledMousePosition } from './hooks/useThrottledMousePosition';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';

interface ImmersiveCardViewerProps {
  card: CardData;
  cards?: CardData[];
  currentCardIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onCardChange?: (card: CardData, index: number) => void;
  onShare?: (card: CardData) => void;
  onDownload?: () => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

// Helper function to convert MaterialSettings to EffectValues
const convertMaterialSettingsToEffectValues = (materialSettings: MaterialSettings): EffectValues => {
  return {
    holographic: { intensity: 0 },
    crystal: { intensity: 0 },
    chrome: { intensity: 0 },
    brushedmetal: { intensity: 0 },
    gold: { intensity: 0, goldTone: 'classic' },
    vintage: { intensity: 0 },
    prizm: { intensity: 0 },
    interference: { intensity: 0 },
    foilspray: { intensity: 0 },
    aurora: { intensity: 0 },
    ice: { intensity: 0 },
    lunar: { intensity: 0 },
    waves: { intensity: 0 }
  };
};

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  isOpen,
  onClose,
  onCardChange,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = false,
  ambient = false
}) => {
  const {
    isFullscreen,
    setIsFullscreen,
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
  } = useViewerState();

  const [showBackgroundInfo, setShowBackgroundInfo] = useState(true);
  const [environmentControls, setEnvironmentControls] = useState<EnvironmentControls>({
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  });

  // Performance monitoring with reduced impact
  const performanceMetrics = usePerformanceMonitor();

  // Convert MaterialSettings to EffectValues for compatibility
  const effectValues = React.useMemo(() => 
    convertMaterialSettingsToEffectValues(materialSettings), 
    [materialSettings]
  );

  const adaptedCard = {
    id: card.id,
    title: card.title,
    image_url: card.image_url
  };

  const handleNext = useCallback(() => {
    if (currentCardIndex < cards.length - 1 && onCardChange) {
      const newIndex = currentCardIndex + 1;
      onCardChange(cards[newIndex], newIndex);
    }
  }, [cards, currentCardIndex, onCardChange]);

  const handlePrev = useCallback(() => {
    if (currentCardIndex > 0 && onCardChange) {
      const newIndex = currentCardIndex - 1;
      onCardChange(cards[newIndex], newIndex);
    }
  }, [cards, currentCardIndex, onCardChange]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === 'ArrowLeft') {
      handlePrev();
    } else if (event.key === 'Escape') {
      onClose();
    }
  }, [handleNext, handlePrev, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, [setIsFullscreen]);

  const handleToggleEffects = useCallback(() => {
    setShowEffects(prev => !prev);
  }, [setShowEffects]);

  const handleToggleBackgroundInfo = useCallback(() => {
    setShowBackgroundInfo(prev => !prev);
  }, [setShowBackgroundInfo]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [setIsDragging, setDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !allowRotation) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Optimize rotation updates with throttling
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      setRotation(prev => ({
        x: prev.x + deltaY * 0.2,
        y: prev.y + deltaX * 0.2,
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart, setRotation, allowRotation]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, [setIsHovering]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsDragging(false);
  }, [setIsHovering, setIsDragging]);

  const { mousePosition: throttledMousePosition, updateMousePosition } = useThrottledMousePosition(32); // Reduced frequency

  const effectiveMousePosition = interactiveLighting ? throttledMousePosition : mousePosition;

  const frameStyles: React.CSSProperties = React.useMemo(() => ({
    background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`,
    border: '1px solid rgba(255,255,255,0.1)'
  }), []);

  const enhancedEffectStyles: React.CSSProperties = React.useMemo(() => ({
    filter: `brightness(${overallBrightness[0] / 100}) contrast(1.05)` // Reduced contrast
  }), [overallBrightness]);

  const SurfaceTexture = React.useMemo(() => (
    <div 
      className="absolute inset-0 opacity-10" // Reduced opacity
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    />
  ), []);

  const CardFlipControls = React.lazy(() => 
    import('./components/CardFlipControls').then(module => ({ default: module.CardFlipControls }))
  );

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Background Renderer */}
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

      {/* Main Card Display */}
      <div className="relative h-full flex items-center justify-center">
        <div 
          className="relative"
          style={{
            width: '400px',
            height: '560px',
            perspective: '1000px'
          }}
          onMouseMove={allowRotation ? handleMouseMove : undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <EnhancedCardContainer
            card={card}
            isHovering={isHovering}
            showEffects={showEffects}
            effectValues={effectValues}
            mousePosition={mousePosition}
            rotation={rotation}
            zoom={zoom}
            isDragging={isDragging}
            frameStyles={frameStyles}
            enhancedEffectStyles={enhancedEffectStyles}
            SurfaceTexture={SurfaceTexture}
            interactiveLighting={interactiveLighting}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
            showBackgroundInfo={showBackgroundInfo}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onCardClick}
            environmentControls={environmentControls}
          />
        </div>

        {/* Card Flip Controls */}
        <React.Suspense fallback={null}>
          <CardFlipControls
            rotation={rotation}
            onRotationChange={setRotation}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          />
        </React.Suspense>
      </div>

      {/* Top UI Controls */}
      <ViewerUI
        onClose={onClose}
        onNext={handleNext}
        onPrev={handlePrev}
        card={card}
        cards={cards}
        currentCardIndex={currentCardIndex}
        showStats={showStats}
      />

      {/* Studio Toggle Button - Prominent placement with proper spacing */}
      <div className="absolute top-4 right-4 z-40">
        <StudioToggleButton
          isVisible={showCustomizePanel}
          onToggle={() => setShowCustomizePanel(prev => !prev)}
        />
      </div>

      {/* Performance Indicator - Only show if critically low performance */}
      {performanceMetrics.isLowPerformance && performanceMetrics.fps < 20 && (
        <div className="absolute top-16 right-4 z-40">
          <div className="bg-red-600/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-md border border-red-500/30">
            Low Performance: {performanceMetrics.fps} FPS
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <ViewerControls
        showEffects={showEffects}
        showBackgroundInfo={showBackgroundInfo}
        interactiveLighting={interactiveLighting}
        autoRotate={autoRotate}
        onToggleEffects={handleToggleEffects}
        onToggleBackgroundInfo={handleToggleBackgroundInfo}
        onToggleAutoRotate={() => setAutoRotate(prev => !prev)}
        onZoomIn={() => handleZoom(0.1)}
        onZoomOut={() => handleZoom(-0.1)}
        onResetCamera={handleResetCamera}
        onMouseEnter={() => setIsHoveringControls(true)}
        onMouseLeave={() => setIsHoveringControls(false)}
      />

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
        onEffectChange={(effectId, parameterId, value) => {
          setMaterialSettings(prev => ({
            ...prev,
            [effectId]: {
              ...prev[effectId],
              [parameterId]: value
            }
          }));
        }}
        onBrightnessChange={setOverallBrightness}
        onInteractiveLightingToggle={() => setInteractiveLighting(prev => !prev)}
        onMaterialSettingsChange={setMaterialSettings}
        selectedPresetId={selectedPresetId}
        onPresetSelect={setSelectedPresetId}
        onApplyCombo={() => {}}
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
    </div>
  );
};
