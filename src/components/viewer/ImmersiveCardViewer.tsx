
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { ViewerUI } from './components/ViewerUI';
import { StudioPanel } from './components/StudioPanel';
import { StudioToggleButton } from './components/StudioToggleButton';
import { BackgroundRenderer } from './components/BackgroundRenderer';
import { useViewerState } from '@/hooks/useViewerState';
import { ViewerControls } from './components/ViewerControls';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { useUnifiedCardInteraction } from './hooks/useUnifiedCardInteraction';
import type { EffectValues } from './hooks/useEnhancedCardEffects';
import type { EnvironmentControls, MaterialSettings } from './types';
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

// Helper function to convert MaterialSettings to EffectValues with null safety
const convertMaterialSettingsToEffectValues = (materialSettings: MaterialSettings | undefined): EffectValues => {
  if (!materialSettings || typeof materialSettings !== 'object') {
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
  }

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
    autoRotate,
    setAutoRotate,
    showEffects,
    setShowEffects,
    showCustomizePanel,
    setShowCustomizePanel,
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
    handleResetCamera,
    onCardClick
  } = useViewerState();

  // Use unified interaction system
  const {
    mousePosition,
    isHovering,
    rotation,
    isDragging,
    zoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleZoom,
    handleReset
  } = useUnifiedCardInteraction({
    allowRotation,
    autoRotate,
    interactiveLighting
  });

  const [showBackgroundInfo, setShowBackgroundInfo] = useState(true);
  const [environmentControls, setEnvironmentControls] = useState<EnvironmentControls>({
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  });

  // Performance monitoring with reduced impact
  const performanceMetrics = usePerformanceMonitor();

  // Convert MaterialSettings to EffectValues with null safety
  const effectValues = useMemo(() => 
    convertMaterialSettingsToEffectValues(materialSettings), 
    [materialSettings]
  );

  // Memoize adapted card to prevent unnecessary re-renders
  const adaptedCard = useMemo(() => ({
    id: card?.id || 'default',
    title: card?.title || 'Default Card',
    image_url: card?.image_url
  }), [card?.id, card?.title, card?.image_url]);

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

  const handleToggleEffects = useCallback(() => {
    setShowEffects(prev => !prev);
  }, [setShowEffects]);

  const handleToggleBackgroundInfo = useCallback(() => {
    setShowBackgroundInfo(prev => !prev);
  }, [setShowBackgroundInfo]);

  // Memoized styles to prevent re-renders
  const frameStyles: React.CSSProperties = useMemo(() => ({
    background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`,
    border: '1px solid rgba(255,255,255,0.1)'
  }), []);

  const enhancedEffectStyles: React.CSSProperties = useMemo(() => ({
    filter: `brightness(${(overallBrightness?.[0] || 100) / 100}) contrast(1.05)`
  }), [overallBrightness]);

  const SurfaceTexture = useMemo(() => (
    <div 
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    />
  ), []);

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Background Renderer */}
      <BackgroundRenderer
        selectedScene={selectedScene}
        mousePosition={mousePosition}
        isHovering={isHovering}
      />

      {/* Main Card Display */}
      <div 
        className="relative h-full flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="relative"
          style={{
            width: '400px',
            height: '560px',
            perspective: '1000px'
          }}
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
            onMouseDown={() => {}}
            onMouseMove={() => {}}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onClick={onCardClick}
            environmentControls={environmentControls}
          />
        </div>
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

      {/* Studio Toggle Button */}
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
        onResetCamera={handleReset}
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
      />
    </div>
  );
};
