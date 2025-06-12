
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
      {/* Background - Only show when not in plain mode */}
      {props.backgroundType !== 'plain' && (
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
      )}

      {/* Header with Navigation Controls */}
      <ViewerHeader
        onClose={props.onClose}
        showStudioButton={!props.shouldShowPanel}
        onOpenStudio={props.onOpenStudio}
        hasMultipleCards={props.hasMultipleCards}
        currentCardIndex={props.currentCardIndex}
        totalCards={props.cards.length}
        onCardChange={props.onCardChange}
        setIsFlipped={props.setIsFlipped}
      />

      {/* Main Card Display - Enhanced with 360° Physics */}
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

      {/* Card Details and Stats - Side by side in lower left */}
      <div className="absolute bottom-20 left-4 z-20 flex space-x-4 select-none pointer-events-auto">
        <CompactCardDetails 
          card={props.card}
          effectValues={props.effectValues}
          selectedScene={props.selectedScene}
          selectedLighting={props.selectedLighting}
          materialSettings={props.materialSettings}
          overallBrightness={props.overallBrightness}
          interactiveLighting={props.interactiveLighting}
        />
        
        {/* Card Stats Panel */}
        <div className="bg-black bg-opacity-90 backdrop-blur-lg rounded-lg p-4 border border-white/10 max-w-sm select-none">
          <h4 className="text-white font-semibold text-sm mb-3">Card Stats</h4>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-400">Rarity:</span>
                <span className="text-white ml-2">{props.card.rarity}</span>
              </div>
              <div>
                <span className="text-gray-400">Template:</span>
                <span className="text-white ml-2">{props.card.template_id || 'Custom'}</span>
              </div>
            </div>
            
            {props.card.tags && props.card.tags.length > 0 && (
              <div>
                <span className="text-gray-400">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {props.card.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-crd-purple/20 text-crd-purple px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {props.card.tags.length > 3 && (
                    <span className="text-gray-500 text-xs">+{props.card.tags.length - 3} more</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-gray-400">ID:</span>
                <span className="text-white text-xs">{props.card.id ? props.card.id.slice(0, 8) + '...' : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Controls - Center bottom above help text */}
      <div className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 z-20 pointer-events-auto ${props.isHoveringControls ? 'opacity-100' : 'opacity-80'}`}>
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

      {/* Help Text Info Panel - Bottom center */}
      <ViewerInfoPanel
        showStats={props.showStats}
        isFlipped={props.isFlipped}
        shouldShowPanel={props.shouldShowPanel}
        hasMultipleCards={props.hasMultipleCards}
      />

      {/* Hidden Navigation Handler for Keyboard Controls */}
      <div className="hidden">
        <CardNavigationHandler
          cards={props.cards}
          currentCardIndex={props.currentCardIndex}
          onCardChange={props.onCardChange}
          setIsFlipped={props.setIsFlipped}
        />
      </div>
    </div>
  );
};
