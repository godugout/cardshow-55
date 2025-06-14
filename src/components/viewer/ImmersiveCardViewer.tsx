
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
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls, BackgroundType } from './types';
import type { SpaceEnvironment, SpaceControls } from './spaces/types';
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

// Enhanced function to convert MaterialSettings to EffectValues with proper debugging
const convertMaterialSettingsToEffectValues = (materialSettings: MaterialSettings | undefined): EffectValues => {
  console.log('🎨 Converting MaterialSettings to EffectValues:', materialSettings);
  
  if (!materialSettings || typeof materialSettings !== 'object') {
    console.log('🎨 No material settings provided, using defaults');
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

  // Map MaterialSettings properties to EffectValues
  const effectValues: EffectValues = {
    holographic: { 
      intensity: materialSettings.holographic || 0,
      shiftSpeed: 150,
      rainbowSpread: 280,
      prismaticDepth: 70
    },
    crystal: { 
      intensity: materialSettings.crystal || 0,
      clarity: 80,
      refraction: 60
    },
    chrome: { 
      intensity: materialSettings.chrome || 0,
      reflectivity: 90
    },
    brushedmetal: { 
      intensity: materialSettings.brushedmetal || 0,
      texture: 75
    },
    gold: { 
      intensity: materialSettings.gold || 0, 
      goldTone: 'classic',
      brilliance: 85
    },
    vintage: { 
      intensity: materialSettings.vintage || 0,
      aging: 60,
      sepia: 40
    },
    prizm: { 
      intensity: materialSettings.prizm || 0,
      spectrum: 90,
      shift: 120
    },
    interference: { 
      intensity: materialSettings.interference || 0,
      pattern: 80
    },
    foilspray: { 
      intensity: materialSettings.foilspray || 0,
      density: 70,
      sparkle: 85
    },
    aurora: { 
      intensity: materialSettings.starlight || materialSettings.aurora || 0, // Map Starlight to Aurora
      waveSpeed: 80,
      colorShift: 120
    },
    ice: { 
      intensity: materialSettings.ice || 0,
      frost: 60,
      crystalline: 80
    },
    lunar: { 
      intensity: materialSettings.lunar || 0,
      dust: 50,
      glow: 70
    },
    waves: { 
      intensity: materialSettings.waves || 0,
      frequency: 100,
      amplitude: 60
    }
  };

  console.log('🎨 Converted EffectValues:', effectValues);
  
  // Log specific effects that have intensity > 0
  const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
    effect.intensity && effect.intensity > 0
  );
  console.log('🎨 Active effects (intensity > 0):', activeEffects);

  return effectValues;
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

  // Convert MaterialSettings to EffectValues with enhanced debugging
  const effectValues = useMemo(() => {
    const converted = convertMaterialSettingsToEffectValues(materialSettings);
    console.log('🎨 Memoized EffectValues:', converted);
    return converted;
  }, [materialSettings]);

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
      {/* Background Renderer - SINGLE RENDER MODE ONLY */}
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

      {/* Main Card Display - ONLY FOR 2D MODE */}
      {backgroundType !== '3dSpace' && (
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
      )}

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
          console.log('🎨 Effect change:', effectId, parameterId, value);
          setMaterialSettings(prev => ({
            ...prev,
            [effectId]: value
          }));
        }}
        onBrightnessChange={setOverallBrightness}
        onInteractiveLightingToggle={() => setInteractiveLighting(prev => !prev)}
        onMaterialSettingsChange={(settings) => {
          console.log('🎨 Material settings change:', settings);
          setMaterialSettings(settings);
        }}
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
        onResetCamera={handleReset}
      />
    </div>
  );
};
