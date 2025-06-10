
import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { ImmersiveCardViewerProps, EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { 
  useEnhancedCardEffects, 
  type EffectValues 
} from './hooks/useEnhancedCardEffects';
import { useCardEffects } from './hooks/useCardEffects';
import { ViewerControls } from './components/ViewerControls';
import { EnhancedCardContainer } from './components/EnhancedCardContainer';
import { CompactCardDetails } from './components/CompactCardDetails';
import { useCardExport } from './hooks/useCardExport';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { ViewerHeader } from './components/ViewerHeader';
import { CardNavigationControls } from './components/CardNavigationControls';
import { ViewerInfoPanel } from './components/ViewerInfoPanel';
import { StudioPanel } from './components/StudioPanel';
import { EnhancedEnvironmentSphere } from './components/EnhancedEnvironmentSphere';
import { SpaceRenderer3D } from './spaces/SpaceRenderer3D';
import { Card3D } from './spaces/Card3D';
import { useViewerState } from './hooks/useViewerState';
import { useSafeZones } from './hooks/useSafeZones';
import { adaptCardForSpaceRenderer } from './utils/cardAdapter';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Navigation logic
  const hasMultipleCards = cards.length > 1;
  const canGoNext = hasMultipleCards && currentCardIndex < cards.length - 1;
  const canGoPrev = hasMultipleCards && currentCardIndex > 0;

  const handlePreviousCard = useCallback(() => {
    if (canGoPrev && onCardChange) {
      onCardChange(currentCardIndex - 1);
      setIsFlipped(false);
    }
  }, [canGoPrev, currentCardIndex, onCardChange, setIsFlipped]);

  const handleNextCard = useCallback(() => {
    if (canGoNext && onCardChange) {
      onCardChange(currentCardIndex + 1);
      setIsFlipped(false);
    }
  }, [canGoNext, currentCardIndex, onCardChange, setIsFlipped]);

  // Safe zone detection
  const { isInSafeZone } = useSafeZones({
    panelWidth: 320,
    showPanel: showCustomizePanel,
    showStats,
    hasNavigation: hasMultipleCards
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousCard();
      } else if (e.key === 'ArrowRight') {
        handleNextCard();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlePreviousCard, handleNextCard]);

  // Enhanced mouse handling with safe zones
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (!isDragging && !inSafeZone) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      const isInControlsArea = e.clientX - rect.left < 300 && e.clientY - rect.top > rect.height - 100;
      setIsHoveringControls(isInControlsArea);
      
      if (allowRotation && !autoRotate) {
        setRotation({
          x: (y - 0.5) * 20,
          y: (x - 0.5) * -20
        });
      }
    }
  }, [isDragging, allowRotation, autoRotate, isInSafeZone, setMousePosition, setIsHoveringControls, setRotation]);

  // Enhanced wheel handling for safe zones
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (!inSafeZone) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(zoomDelta);
    }
  }, [isInSafeZone, handleZoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const inSafeZone = isInSafeZone(e.clientX, e.clientY, rect);
    
    if (allowRotation && !inSafeZone) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      setAutoRotate(false);
    }
  }, [rotation, allowRotation, isInSafeZone, setIsDragging, setDragStart, setAutoRotate]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (isDragging && allowRotation) {
      setRotation({
        x: e.clientY - dragStart.y,
        y: e.clientX - dragStart.x
      });
    }
  }, [isDragging, dragStart, allowRotation, setRotation]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

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

  if (!isOpen) return null;

  const panelWidth = 320;
  const shouldShowPanel = showCustomizePanel;

  // Adapt card for space renderer
  const adaptedCard = adaptCardForSpaceRenderer(card);

  return (
    <>
      <div 
        ref={containerRef}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isFullscreen ? 'p-0' : 'p-8'
        } ${shouldShowPanel ? `pr-[${panelWidth + 32}px]` : ''}`}
        style={{
          paddingRight: shouldShowPanel ? `${panelWidth + 32}px` : isFullscreen ? '0' : '32px'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Emergency Fallback Background - Always renders first */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darker" />

        {/* Background Renderer - 2D or 3D */}
        <div className="absolute inset-0 z-10">
          {backgroundType === '3dSpace' && selectedSpace ? (
            <SpaceRenderer3D
              card={adaptedCard}
              environment={selectedSpace}
              controls={spaceControls}
              onCardClick={onCardClick}
              onCameraReset={handleResetCamera}
            />
          ) : (
            <>
              {/* Use the improved environment sphere with better depth effects */}
              <div 
                className="absolute inset-0"
                style={{
                  background: selectedScene.backgroundImage || selectedScene.gradient || 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  filter: `brightness(${selectedLighting.brightness}%)`,
                  transition: 'all 0.5s ease'
                }}
              />
              
              {/* Improved depth layers without jarring parallax */}
              <div className="absolute inset-0">
                {/* Static depth layer 1 - Far background */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url(${selectedScene.backgroundImage || selectedScene.panoramicUrl})`,
                    backgroundSize: '130% 130%',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(8px) brightness(0.7)',
                    transform: 'scale(1.1) translateZ(-200px)',
                    mixBlendMode: 'multiply'
                  }}
                />
                
                {/* Static depth layer 2 - Mid background */}
                <div 
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage: `url(${selectedScene.backgroundImage || selectedScene.panoramicUrl})`,
                    backgroundSize: '115% 115%',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(4px) brightness(0.8)',
                    transform: 'scale(1.05) translateZ(-100px)',
                    mixBlendMode: 'overlay'
                  }}
                />
                
                {/* Main background layer with subtle breathing animation */}
                <div 
                  className="absolute inset-0 transition-all duration-[3000ms] ease-in-out"
                  style={{
                    backgroundImage: `url(${selectedScene.backgroundImage || selectedScene.panoramicUrl})`,
                    backgroundSize: '120% 120%',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    transform: `scale(${1 + Math.sin(Date.now() * 0.0008) * 0.01})`,
                    filter: `brightness(${selectedScene.lighting.intensity}) contrast(1.1) saturate(1.2)`,
                    opacity: 0.9
                  }}
                />
              </div>
              
              {/* Dynamic lighting that follows mouse */}
              <div 
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                    ${selectedScene.lighting.color}40 0%, 
                    ${selectedScene.lighting.color}20 30%,
                    transparent 70%)`,
                  mixBlendMode: 'overlay'
                }}
              />
              
              {/* Atmospheric particles */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white opacity-20"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${Math.random() * 3 + 1}px`,
                      height: `${Math.random() * 3 + 1}px`,
                      transform: `translateY(${Math.sin(Date.now() * 0.001 * (i + 1)) * 15}px)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  />
                ))}
              </div>
              
              {/* Enhanced Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 z-10" />
            </>
          )}
        </div>

        {/* Subtle Ambient Background Effect (only for 2D scenes) */}
        {ambient && backgroundType === 'scene' && (
          <div 
            className="absolute inset-0 opacity-20 z-15 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                ${selectedScene.lighting.color} 0%, transparent 40%)`,
              mixBlendMode: 'screen',
              opacity: isHovering ? 0.3 : 0.2
            }}
          />
        )}

        {/* Header */}
        <ViewerHeader
          onClose={onClose}
          showStudioButton={!shouldShowPanel}
          onOpenStudio={() => setShowCustomizePanel(true)}
        />

        {/* Compact Card Details */}
        <div className="absolute bottom-20 left-4 z-20">
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
        <div className={`transition-opacity duration-200 ${isHoveringControls ? 'opacity-100 z-20' : 'opacity-100 z-10'}`}>
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
        <CardNavigationControls
          hasMultipleCards={hasMultipleCards}
          currentCardIndex={currentCardIndex}
          totalCards={cards.length}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrevious={handlePreviousCard}
          onNext={handleNextCard}
        />

        {/* Enhanced Card Container (only for 2D scenes) */}
        {backgroundType === 'scene' && (
          <div ref={cardContainerRef}>
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
              environmentControls={environmentControls}
              showBackgroundInfo={false}
              onMouseDown={handleDragStart}
              onMouseMove={handleDrag}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => setIsFlipped(!isFlipped)}
            />
          </div>
        )}

        {/* Info Panel */}
        <ViewerInfoPanel
          showStats={showStats}
          isFlipped={isFlipped}
          shouldShowPanel={shouldShowPanel}
          hasMultipleCards={hasMultipleCards}
        />
      </div>

      {/* Studio Panel with Environment Controls */}
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
        onEnvironmentControlsChange={setEnvironmentControls}
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
