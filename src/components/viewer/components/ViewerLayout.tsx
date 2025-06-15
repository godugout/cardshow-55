
import React, { useRef, useEffect } from 'react';
import { ViewerHeader } from './ViewerHeader';
import { CompactCardDetails } from './CompactCardDetails';
import { ViewerControls } from './ViewerControls';
import { CardNavigationHandler } from './CardNavigationHandler';
import { ViewerInfoPanel } from './ViewerInfoPanel';
import { BackgroundRenderer } from './BackgroundRenderer';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { BackgroundType } from '../types';

interface ViewerLayoutProps {
  card: CardData;
  cards: any[];
  currentCardIndex: number;
  onCardChange?: (index: number) => void;
  onClose?: () => void;
  isFullscreen: boolean;
  showCustomizePanel: boolean;
  setShowCustomizePanel: (show: boolean) => void;
  isHovering: boolean;
  setIsHovering: (hover: boolean) => void;
  isHoveringControls: boolean;
  showEffects: boolean;
  setShowEffects: (show: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (rotate: boolean) => void;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  showStats: boolean;
  effectValues: EffectValues;
  selectedScene: any;
  selectedLighting: any;
  materialSettings: any;
  overallBrightness: number[];
  interactiveLighting: boolean;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  backgroundType: BackgroundType;
  selectedSpace: any;
  spaceControls: any;
  adaptedCard: any;
  frameStyles: any;
  enhancedEffectStyles: any;
  SurfaceTexture: any;
  environmentControls: any;
  containerRef: React.RefObject<HTMLDivElement>;
  cardContainerRef: React.RefObject<HTMLDivElement>;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleDragStart: (e: React.MouseEvent) => void;
  handleDrag: (e: React.MouseEvent) => void;
  handleDragEnd: () => void;
  handleZoom: (delta: number) => void;
  handleResetWithEffects: () => void;
  handleResetCamera: () => void;
  onCardClick: () => void;
  hasMultipleCards: boolean;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  card,
  cards,
  currentCardIndex,
  onCardChange,
  onClose,
  isFullscreen,
  showCustomizePanel,
  setShowCustomizePanel,
  isHovering,
  setIsHovering,
  isHoveringControls,
  showEffects,
  setShowEffects,
  autoRotate,
  setAutoRotate,
  isFlipped,
  setIsFlipped,
  showStats,
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  backgroundType,
  selectedSpace,
  spaceControls,
  adaptedCard,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  environmentControls,
  containerRef,
  cardContainerRef,
  handleMouseMove,
  handleDragStart,
  handleDrag,
  handleDragEnd,
  handleZoom,
  handleResetWithEffects,
  handleResetCamera,
  onCardClick,
  hasMultipleCards
}) => {
  const panelWidth = 320;
  const shouldShowPanel = showCustomizePanel;

  return (
    <div 
      ref={containerRef}
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
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
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
      <CardNavigationHandler
        cards={cards}
        currentCardIndex={currentCardIndex}
        onCardChange={onCardChange}
        setIsFlipped={setIsFlipped}
      />

      {/* Enhanced Card Container (only for scene background) */}
      {backgroundType === 'scene' && (
        <div ref={cardContainerRef}>
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
            environmentControls={environmentControls}
            showBackgroundInfo={false}
            onMouseDown={handleDragStart}
            onMouseMove={handleDrag}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => {}}
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
  );
};
