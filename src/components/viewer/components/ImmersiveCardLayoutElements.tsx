
import React from 'react';
import { ViewerHeader } from './ViewerHeader';
import { CompactCardDetails } from './CompactCardDetails';
import { ViewerControls } from './ViewerControls';
import { CardNavigationControls } from './CardNavigationControls';
import { ViewerInfoPanel } from './ViewerInfoPanel';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface ImmersiveCardLayoutElementsProps {
  onClose?: () => void;
  shouldShowPanel: boolean;
  setShowCustomizePanel: (show: boolean) => void;
  card: any;
  effectValues: EffectValues;
  selectedScene: any;
  selectedLighting: any;
  materialSettings: any;
  overallBrightness: number[];
  interactiveLighting: boolean;
  isHoveringControls: boolean;
  showEffects: boolean;
  setShowEffects: (show: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (rotate: boolean) => void;
  handleResetWithEffects: () => void;
  handleZoom: (delta: number) => void;
  hasMultipleCards: boolean;
  currentCardIndex: number;
  totalCards: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  handlePreviousCard: () => void;
  handleNextCard: () => void;
  showStats: boolean;
  isFlipped: boolean;
}

export const ImmersiveCardLayoutElements: React.FC<ImmersiveCardLayoutElementsProps> = ({
  onClose,
  shouldShowPanel,
  setShowCustomizePanel,
  card,
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  isHoveringControls,
  showEffects,
  setShowEffects,
  autoRotate,
  setAutoRotate,
  handleResetWithEffects,
  handleZoom,
  hasMultipleCards,
  currentCardIndex,
  totalCards,
  canGoPrev,
  canGoNext,
  handlePreviousCard,
  handleNextCard,
  showStats,
  isFlipped
}) => {
  return (
    <>
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
        totalCards={totalCards}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrevious={handlePreviousCard}
        onNext={handleNextCard}
      />

      {/* Info Panel */}
      <ViewerInfoPanel
        showStats={showStats}
        isFlipped={isFlipped}
        shouldShowPanel={shouldShowPanel}
        hasMultipleCards={hasMultipleCards}
      />
    </>
  );
};
