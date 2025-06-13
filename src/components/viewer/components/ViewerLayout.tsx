
import React from 'react';
import { ViewerHeader } from './ViewerHeader';
import { ViewerControls } from './ViewerControls';
import { CompactCardDetails } from './CompactCardDetails';
import { ViewerInfoPanel } from './ViewerInfoPanel';
import { StudioPanel } from './StudioPanel';
import { ExportOptionsDialog } from './ExportOptionsDialog';
import { ViewerBackground } from './ViewerBackground';
import { ViewerCardDisplay } from './ViewerCardDisplay';
import { ViewerInteractionLayer } from './ViewerInteractionLayer';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface ViewerLayoutProps {
  // Card and navigation props
  card: CardData;
  cards: any[];
  currentCardIndex: number;
  onCardChange?: (index: number) => void;
  onClose?: () => void;
  
  // State props
  isFullscreen: boolean;
  rotation: { x: number; y: number };
  setRotation: (rotation: { x: number; y: number }) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  dragStart: { x: number; y: number };
  setDragStart: (start: { x: number; y: number }) => void;
  zoom: number;
  isFlipped: boolean;
  autoRotate: boolean;
  setAutoRotate: (rotate: boolean) => void;
  showEffects: boolean;
  setShowEffects: (show: boolean) => void;
  mousePosition: { x: number; y: number };
  setMousePosition: (position: { x: number; y: number }) => void;
  showCustomizePanel: boolean;
  setShowCustomizePanel: (show: boolean) => void;
  isHovering: boolean;
  setIsHovering: (hovering: boolean) => void;
  isHoveringControls: boolean;
  setIsHoveringControls: (hovering: boolean) => void;
  showExportDialog: boolean;
  setShowExportDialog: (show: boolean) => void;
  
  // Advanced settings
  backgroundType: any;
  setBackgroundType: (type: any) => void;
  selectedScene: any;
  setSelectedScene: (scene: any) => void;
  selectedLighting: any;
  setSelectedLighting: (lighting: any) => void;
  overallBrightness: number[];
  setOverallBrightness: (brightness: number[]) => void;
  interactiveLighting: boolean;
  setInteractiveLighting: (lighting: boolean) => void;
  materialSettings: any;
  setMaterialSettings: (settings: any) => void;
  selectedPresetId?: string;
  setSelectedPresetId: (id?: string) => void;
  selectedSpace: any;
  setSelectedSpace: (space: any) => void;
  spaceControls: any;
  setSpaceControls: (controls: any) => void;
  
  // Action handlers
  handleReset: () => void;
  handleZoom: (delta: number) => void;
  handleResetCamera: () => void;
  onCardClick: () => void;
  
  // Effects manager props
  effectValues: EffectValues;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  handleEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  handleComboApplication: (combo: any) => void;
  isApplyingPreset: boolean;
  
  // Export props
  exportCard: (options: any) => void;
  isExporting: boolean;
  exportProgress: number;
  
  // Configuration
  allowRotation: boolean;
  showStats: boolean;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = (props) => {
  const {
    card,
    cards,
    currentCardIndex,
    onCardChange,
    onClose,
    isFullscreen,
    showCustomizePanel,
    showStats,
    allowRotation,
    // All other props passed through
    ...layoutProps
  } = props;

  const hasMultipleCards = cards.length > 1;
  const shouldShowPanel = showCustomizePanel;
  const panelWidth = 320;

  return (
    <div 
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
    >
      {/* Background Renderer */}
      <ViewerBackground
        backgroundType={layoutProps.backgroundType}
        selectedSpace={layoutProps.selectedSpace}
        spaceControls={layoutProps.spaceControls}
        card={card}
        onCardClick={layoutProps.onCardClick}
        onCameraReset={layoutProps.handleResetCamera}
        selectedScene={layoutProps.selectedScene}
        selectedLighting={layoutProps.selectedLighting}
        mousePosition={layoutProps.mousePosition}
        isHovering={layoutProps.isHovering}
        effectValues={layoutProps.effectValues}
        materialSettings={layoutProps.materialSettings}
        overallBrightness={layoutProps.overallBrightness}
        interactiveLighting={layoutProps.interactiveLighting}
      />

      {/* Interaction Layer */}
      <ViewerInteractionLayer
        allowRotation={allowRotation}
        autoRotate={layoutProps.autoRotate}
        isDragging={layoutProps.isDragging}
        setIsDragging={layoutProps.setIsDragging}
        setDragStart={layoutProps.setDragStart}
        setAutoRotate={layoutProps.setAutoRotate}
        setRotation={layoutProps.setRotation}
        setMousePosition={layoutProps.setMousePosition}
        setIsHoveringControls={layoutProps.setIsHoveringControls}
        rotation={layoutProps.rotation}
        dragStart={layoutProps.dragStart}
        handleZoom={layoutProps.handleZoom}
        showCustomizePanel={showCustomizePanel}
        showStats={showStats}
        hasMultipleCards={hasMultipleCards}
      >
        {/* Header */}
        <ViewerHeader
          onClose={onClose}
          showStudioButton={!shouldShowPanel}
          onOpenStudio={() => layoutProps.setShowCustomizePanel(true)}
        />

        {/* Compact Card Details */}
        <div className="absolute bottom-20 left-4 z-20 select-none">
          <CompactCardDetails 
            card={card}
            effectValues={layoutProps.effectValues}
            selectedScene={layoutProps.selectedScene}
            selectedLighting={layoutProps.selectedLighting}
            materialSettings={layoutProps.materialSettings}
            overallBrightness={layoutProps.overallBrightness}
            interactiveLighting={layoutProps.interactiveLighting}
          />
        </div>

        {/* Basic Controls */}
        <div className={`transition-opacity duration-200 ${layoutProps.isHoveringControls ? 'opacity-100 z-20' : 'opacity-100 z-10'}`}>
          <ViewerControls
            showEffects={layoutProps.showEffects}
            autoRotate={layoutProps.autoRotate}
            onToggleEffects={() => layoutProps.setShowEffects(!layoutProps.showEffects)}
            onToggleAutoRotate={() => layoutProps.setAutoRotate(!layoutProps.autoRotate)}
            onReset={layoutProps.handleReset}
            onZoomIn={() => layoutProps.handleZoom(0.1)}
            onZoomOut={() => layoutProps.handleZoom(-0.1)}
          />
        </div>

        {/* Info Panel */}
        <ViewerInfoPanel
          showStats={showStats}
          isFlipped={layoutProps.isFlipped}
          shouldShowPanel={shouldShowPanel}
          hasMultipleCards={hasMultipleCards}
        />

        {/* Card Display */}
        <ViewerCardDisplay
          card={card}
          cards={cards}
          currentCardIndex={currentCardIndex}
          onCardChange={onCardChange}
          isHovering={layoutProps.isHovering}
          showEffects={layoutProps.showEffects}
          effectValues={layoutProps.effectValues}
          mousePosition={layoutProps.mousePosition}
          rotation={layoutProps.rotation}
          zoom={layoutProps.zoom}
          isDragging={layoutProps.isDragging}
          frameStyles={layoutProps.frameStyles}
          enhancedEffectStyles={layoutProps.enhancedEffectStyles}
          SurfaceTexture={layoutProps.SurfaceTexture}
          interactiveLighting={layoutProps.interactiveLighting}
          selectedScene={layoutProps.selectedScene}
          selectedLighting={layoutProps.selectedLighting}
          materialSettings={layoutProps.materialSettings}
          overallBrightness={layoutProps.overallBrightness}
          onMouseDown={(e) => console.log('🎯 Card mouse down:', e.clientX, e.clientY)}
          onMouseMove={(e) => console.log('🎯 Card mouse move:', e.clientX, e.clientY)}
          onMouseEnter={() => {
            console.log('🎯 Card mouse enter');
            layoutProps.setIsHovering(true);
          }}
          onMouseLeave={() => {
            console.log('🎯 Card mouse leave');
            layoutProps.setIsHovering(false);
          }}
          onClick={() => console.log('🎯 Card clicked')}
        />
      </ViewerInteractionLayer>

      {/* Studio Panel */}
      <StudioPanel
        isVisible={shouldShowPanel}
        onClose={() => layoutProps.setShowCustomizePanel(false)}
        selectedScene={layoutProps.selectedScene}
        selectedLighting={layoutProps.selectedLighting}
        effectValues={layoutProps.effectValues}
        overallBrightness={layoutProps.overallBrightness}
        interactiveLighting={layoutProps.interactiveLighting}
        materialSettings={layoutProps.materialSettings}
        onSceneChange={layoutProps.setSelectedScene}
        onLightingChange={layoutProps.setSelectedLighting}
        onEffectChange={layoutProps.handleEffectChange}
        onBrightnessChange={layoutProps.setOverallBrightness}
        onInteractiveLightingToggle={() => layoutProps.setInteractiveLighting(!layoutProps.interactiveLighting)}
        onMaterialSettingsChange={layoutProps.setMaterialSettings}
        selectedPresetId={layoutProps.selectedPresetId}
        onPresetSelect={layoutProps.setSelectedPresetId}
        onApplyCombo={layoutProps.handleComboApplication}
        isApplyingPreset={layoutProps.isApplyingPreset}
        backgroundType={layoutProps.backgroundType}
        onBackgroundTypeChange={layoutProps.setBackgroundType}
        onSpaceChange={layoutProps.setSelectedSpace}
        selectedSpace={layoutProps.selectedSpace}
        spaceControls={layoutProps.spaceControls}
        onSpaceControlsChange={layoutProps.setSpaceControls}
        onResetCamera={layoutProps.handleResetCamera}
      />

      {/* Export Options Dialog */}
      <ExportOptionsDialog
        isOpen={layoutProps.showExportDialog}
        onClose={() => layoutProps.setShowExportDialog(false)}
        onExport={layoutProps.exportCard}
        isExporting={layoutProps.isExporting}
        exportProgress={layoutProps.exportProgress}
        cardTitle={card.title}
      />
    </div>
  );
};
