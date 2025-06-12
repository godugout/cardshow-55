
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
  // Calculate if card is in AR mode for UI adjustments
  const isCardInARMode = props.zoom > 1.2;
  const cardTransparencyFactor = isCardInARMode ? Math.max(0.3, 1 - (props.zoom - 1.2) * 0.8) : 1;

  return (
    <div 
      ref={props.containerRef}
      className={`fixed inset-0 z-50 bg-black/90 flex items-center justify-center select-none ${
        props.isFullscreen ? 'p-0' : 'p-8'
      }`}
      style={{
        paddingRight: props.shouldShowPanel ? `${props.panelWidth + 32}px` : props.isFullscreen ? '0' : '32px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onMouseMove={props.handleMouseMove}
      onMouseUp={props.handleDragEnd}
      onMouseLeave={props.handleDragEnd}
    >
      {/* Background - Only show when not in plain mode, with AR transparency */}
      {props.backgroundType !== 'plain' && (
        <div 
          style={{
            opacity: cardTransparencyFactor,
            filter: isCardInARMode ? `blur(${(props.zoom - 1.2) * 2}px)` : 'none'
          }}
          className="transition-all duration-300"
        >
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

      {/* Header with AR transparency */}
      <div 
        style={{
          opacity: cardTransparencyFactor,
          filter: isCardInARMode ? `blur(${Math.min((props.zoom - 1.2) * 1, 2)}px)` : 'none'
        }}
        className="transition-all duration-300"
      >
        <ViewerHeader
          onClose={props.onClose}
          showStudioButton={!props.shouldShowPanel}
          onOpenStudio={props.onOpenStudio}
        />
      </div>

      {/* Main Card Display - Enhanced with AR capabilities */}
      <div 
        ref={props.cardContainerRef} 
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      >
        <div className="pointer-events-auto">
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

      {/* Compact Card Details with AR transparency */}
      <div 
        className="absolute bottom-20 left-4 z-20 select-none pointer-events-auto transition-all duration-300"
        style={{
          opacity: cardTransparencyFactor,
          filter: isCardInARMode ? `blur(${Math.min((props.zoom - 1.2) * 0.5, 1)}px)` : 'none',
          transform: isCardInARMode && props.zoom > 1.5 ? 'translateY(-10px)' : 'translateY(0)'
        }}
      >
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

      {/* Basic Controls with AR transparency */}
      <div 
        className={`absolute bottom-4 left-4 transition-all duration-300 z-20 pointer-events-auto`}
        style={{
          opacity: Math.min(cardTransparencyFactor, props.isHoveringControls ? 1 : 0.8),
          filter: isCardInARMode ? `blur(${Math.min((props.zoom - 1.2) * 0.5, 1)}px)` : 'none',
          transform: isCardInARMode && props.zoom > 1.5 ? 'translateY(-10px)' : 'translateY(0)'
        }}
      >
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

      {/* Card Navigation Controls with AR transparency */}
      <div 
        style={{
          opacity: cardTransparencyFactor,
          filter: isCardInARMode ? `blur(${Math.min((props.zoom - 1.2) * 0.5, 1)}px)` : 'none'
        }}
        className="transition-all duration-300"
      >
        <CardNavigationHandler
          cards={props.cards}
          currentCardIndex={props.currentCardIndex}
          onCardChange={props.onCardChange}
          setIsFlipped={props.setIsFlipped}
        />
      </div>

      {/* Info Panel with AR transparency */}
      <div 
        style={{
          opacity: cardTransparencyFactor,
          filter: isCardInARMode ? `blur(${Math.min((props.zoom - 1.2) * 0.5, 1)}px)` : 'none'
        }}
        className="transition-all duration-300"
      >
        <ViewerInfoPanel
          showStats={props.showStats}
          isFlipped={props.isFlipped}
          shouldShowPanel={props.shouldShowPanel}
          hasMultipleCards={props.hasMultipleCards}
        />
      </div>
    </div>
  );
};
