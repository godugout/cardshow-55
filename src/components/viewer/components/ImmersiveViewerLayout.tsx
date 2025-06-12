
import React from 'react';
import { ViewerHeader } from './ViewerHeader';
import { SimplifiedEnhancedCardContainer } from './SimplifiedEnhancedCardContainer';
import { CompactCardDetails } from './CompactCardDetails';
import { ViewerControls } from './ViewerControls';
import { CardNavigationHandler } from './CardNavigationHandler';
import { ViewerInfoPanel } from './ViewerInfoPanel';
import { BackgroundRenderer } from './BackgroundRenderer';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface ImmersiveViewerLayoutProps {
  card: CardData;
  cards: any[];
  currentCardIndex: number;
  onCardChange?: (index: number) => void;
  onClose?: () => void;
  showStats: boolean;
  isFullscreen: boolean;
  shouldShowPanel: boolean;
  panelWidth: number;
  hasMultipleCards: boolean;
  // State props
  backgroundType: any;
  selectedSpace: any;
  spaceControls: any;
  adaptedCard: any;
  selectedScene: any;
  selectedLighting: any;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  effectValues: EffectValues;
  materialSettings: any;
  overallBrightness: number[];
  interactiveLighting: boolean;
  showEffects: boolean;
  autoRotate: boolean;
  isFlipped: boolean;
  zoom: number;
  rotation: { x: number; y: number };
  isDragging: boolean;
  isHoveringControls: boolean;
  // Handlers
  onCardClick: () => void;
  onResetCamera: () => void;
  onOpenStudio: () => void;
  onToggleEffects: () => void;
  onToggleAutoRotate: () => void;
  onResetWithEffects: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  setIsFlipped: (flipped: boolean) => void;
  setIsHovering: (hovering: boolean) => void;
  setIsHoveringControls: (hovering: boolean) => void;
  // Viewer interactions
  cardContainerRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleDragStart: (e: React.MouseEvent) => void;
  handleDragEnd: () => void;
  gripPoint: { x: number; y: number } | null;
  physicsState: any;
  rotationIndicator: { show: boolean; angle: number };
  // Effects
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  // Environment
  environmentControls: any;
}

export const ImmersiveViewerLayout: React.FC<ImmersiveViewerLayoutProps> = (props) => {
  return (
    <div 
      ref={props.containerRef}
      className="fixed inset-0 z-50 bg-black/90 select-none"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onMouseMove={props.handleMouseMove}
      onMouseUp={props.handleDragEnd}
      onMouseLeave={props.handleDragEnd}
    >
      {/* Background - Only show when not in plain mode */}
      {props.backgroundType !== 'plain' && (
        <div className="absolute inset-0 z-0">
          <BackgroundRenderer
            backgroundType={props.backgroundType}
            selectedSpace={props.selectedSpace}
            spaceControls={props.spaceControls}
            adaptedCard={props.adaptedCard}
            onCardClick={props.onCardClick}
            onCameraReset={props.onResetCamera}
            selectedScene={props.selectedScene}
            selectedLighting={props.selectedLighting}
            mousePosition={props.mousePosition}
            isHovering={props.isHovering}
            effectValues={props.effectValues}
            materialSettings={props.materialSettings}
            overallBrightness={props.overallBrightness}
            interactiveLighting={props.interactiveLighting}
          />
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <ViewerHeader
          onClose={props.onClose}
          showStudioButton={!props.shouldShowPanel}
          onOpenStudio={props.onOpenStudio}
        />
      </div>

      {/* Main Card Display - Full Screen */}
      <div 
        ref={props.cardContainerRef} 
        className="absolute inset-0 z-10 pointer-events-none"
      >
        <div className="w-full h-full pointer-events-auto">
          <SimplifiedEnhancedCardContainer
            card={props.card}
            isFlipped={props.isFlipped}
            isHovering={props.isHovering}
            showEffects={props.showEffects}
            effectValues={props.effectValues}
            mousePosition={props.mousePosition}
            rotation={props.rotation}
            zoom={props.zoom}
            isDragging={props.isDragging}
            frameStyles={props.frameStyles}
            enhancedEffectStyles={props.enhancedEffectStyles}
            SurfaceTexture={props.SurfaceTexture}
            interactiveLighting={props.interactiveLighting}
            selectedScene={props.selectedScene}
            selectedLighting={props.selectedLighting}
            materialSettings={props.materialSettings}
            overallBrightness={props.overallBrightness}
            environmentControls={props.environmentControls}
            showBackgroundInfo={false}
            onMouseDown={props.handleDragStart}
            onMouseMove={props.handleMouseMove}
            onMouseEnter={() => props.setIsHovering(true)}
            onMouseLeave={() => props.setIsHovering(false)}
            onClick={() => props.setIsFlipped(!props.isFlipped)}
            gripPoint={props.gripPoint}
            physicsState={props.physicsState}
            rotationIndicator={props.rotationIndicator}
          />
        </div>
      </div>

      {/* Compact Card Details */}
      <div className="absolute bottom-20 left-4 z-20 select-none pointer-events-auto">
        <CompactCardDetails 
          card={props.card}
          effectValues={props.effectValues}
          selectedScene={props.selectedScene}
          selectedLighting={props.selectedLighting}
          materialSettings={props.materialSettings}
          overallBrightness={props.overallBrightness}
          interactiveLighting={props.interactiveLighting}
        />
      </div>

      {/* Basic Controls */}
      <div className={`absolute bottom-4 left-4 transition-opacity duration-200 z-20 pointer-events-auto ${props.isHoveringControls ? 'opacity-100' : 'opacity-80'}`}>
        <ViewerControls
          showEffects={props.showEffects}
          autoRotate={props.autoRotate}
          onToggleEffects={props.onToggleEffects}
          onToggleAutoRotate={props.onToggleAutoRotate}
          onReset={props.onResetWithEffects}
          onZoomIn={props.onZoomIn}
          onZoomOut={props.onZoomOut}
        />
      </div>

      {/* Card Navigation Controls */}
      <CardNavigationHandler
        cards={props.cards}
        currentCardIndex={props.currentCardIndex}
        onCardChange={props.onCardChange}
        setIsFlipped={props.setIsFlipped}
      />

      {/* Info Panel */}
      <ViewerInfoPanel
        showStats={props.showStats}
        isFlipped={props.isFlipped}
        shouldShowPanel={props.shouldShowPanel}
        hasMultipleCards={props.hasMultipleCards}
      />
    </div>
  );
};
