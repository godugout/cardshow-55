
import React, { useState, useCallback, useMemo } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { ViewerUI } from './components/ViewerUI';
import { StudioToggleButton } from './components/StudioToggleButton';
import { BackgroundRenderer } from './components/BackgroundRenderer';
import { ViewerControls } from './components/ViewerControls';
import { useUnifiedCardInteraction } from './hooks/useUnifiedCardInteraction';
import { useSimpleCardEffects } from './hooks/useSimpleCardEffects';
import { SimpleCustomizePanel } from './components/SimpleCustomizePanel';
import { SimpleCardEffectsLayer } from './components/SimpleCardEffectsLayer';
import { Card3DTransform } from './components/Card3DTransform';
import type { LightingPreset } from './types';
import type { SpaceControls } from './spaces/types';
import { LIGHTING_PRESETS } from './constants/lightingPresets';
import { ENVIRONMENT_SCENES } from './constants/environmentScenes';

interface SimplifiedImmersiveCardViewerProps {
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

export const SimplifiedImmersiveCardViewer: React.FC<SimplifiedImmersiveCardViewerProps> = ({
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
  // Simple state management
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState<number[]>([100]);
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  // Simple effects hook
  const { effectValues, updateEffect, resetAllEffects } = useSimpleCardEffects();

  // Unified interaction system
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

  // Navigation handlers
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

  // Memoized adapted card for background renderer
  const adaptedCard = useMemo(() => ({
    id: card?.id || 'default',
    title: card?.title || 'Default Card',
    image_url: card?.image_url
  }), [card?.id, card?.title, card?.image_url]);

  // Default space controls
  const defaultSpaceControls: SpaceControls = useMemo(() => ({
    orbitSpeed: 1,
    floatIntensity: 0.5,
    cameraDistance: 5,
    autoRotate: autoRotate,
    gravityEffect: 0.1
  }), [autoRotate]);

  // Use a proper default environment scene
  const defaultScene = useMemo(() => ENVIRONMENT_SCENES[0], []); // Use first environment scene as default

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Background Renderer */}
      <BackgroundRenderer
        backgroundType="scene"
        selectedSpace={null}
        spaceControls={defaultSpaceControls}
        adaptedCard={adaptedCard}
        onCardClick={() => {}}
        onCameraReset={handleReset}
        selectedScene={defaultScene}
        selectedLighting={selectedLighting}
        mousePosition={mousePosition}
        isHovering={isHovering}
        effectValues={{}}
        materialSettings={{}}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
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
          <Card3DTransform
            rotation={rotation}
            mousePosition={mousePosition}
            isDragging={isDragging}
            interactiveLighting={interactiveLighting}
            isHovering={isHovering}
            onClick={() => {}}
          >
            {/* Card Container */}
            <div
              className="relative w-full h-full rounded-xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`,
                border: '1px solid rgba(255,255,255,0.1)',
                filter: `brightness(${overallBrightness[0] / 100}) contrast(1.05)`
              }}
            >
              {/* Card Image */}
              {card.image_url && (
                <img
                  src={card.image_url}
                  alt={card.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              )}

              {/* Card Effects Layer */}
              {showEffects && (
                <SimpleCardEffectsLayer
                  effectValues={effectValues}
                  mousePosition={mousePosition}
                  isHovering={isHovering}
                  interactiveLighting={interactiveLighting}
                />
              )}

              {/* Surface Texture */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
            </div>
          </Card3DTransform>
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

      {/* Bottom Controls */}
      <ViewerControls
        showEffects={showEffects}
        showBackgroundInfo={false}
        interactiveLighting={interactiveLighting}
        autoRotate={autoRotate}
        onToggleEffects={() => setShowEffects(prev => !prev)}
        onToggleBackgroundInfo={() => {}}
        onToggleAutoRotate={() => setAutoRotate(prev => !prev)}
        onZoomIn={() => handleZoom(0.1)}
        onZoomOut={() => handleZoom(-0.1)}
        onResetCamera={handleReset}
        onMouseEnter={() => setIsHoveringControls(true)}
        onMouseLeave={() => setIsHoveringControls(false)}
      />

      {/* Simple Customize Panel */}
      <SimpleCustomizePanel
        isVisible={showCustomizePanel}
        onClose={() => setShowCustomizePanel(false)}
        effectValues={effectValues}
        onEffectChange={updateEffect}
        selectedLighting={selectedLighting}
        onLightingChange={setSelectedLighting}
        overallBrightness={overallBrightness}
        onBrightnessChange={setOverallBrightness}
        interactiveLighting={interactiveLighting}
        onInteractiveLightingToggle={() => setInteractiveLighting(prev => !prev)}
        onResetEffects={resetAllEffects}
      />
    </div>
  );
};
