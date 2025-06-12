
import React, { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import type { CardData } from '@/hooks/useCardEditor';
import { useImmersiveViewerState } from './hooks/useImmersiveViewerState';
import { Card3D } from './spaces/Card3D';
import { ViewerControls } from './components/ViewerControls';
import { StudioFooter } from './components/studio/StudioFooter';
import { ExportOptionsDialog } from './components/ExportOptionsDialog';
import { BackgroundRenderer } from './components/BackgroundRenderer';
import { ViewerHeader } from './components/ViewerHeader';
import { toast } from 'sonner';

interface ImmersiveCardViewerProps {
  card: CardData;
  cards?: CardData[];
  currentCardIndex?: number;
  onCardChange?: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = false,
  ambient = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    viewerState,
    effectValues,
    adaptedCard,
    handleResetWithEffects,
    handleShareClick,
    handleDownloadClick
  } = useImmersiveViewerState({
    card,
    allowRotation,
    onShare
  });

  // Handle rotate button - toggle auto rotation
  const handleRotateToggle = useCallback(() => {
    console.log('🎯 Rotate button clicked, toggling auto-rotation');
    viewerState.setAutoRotate(prev => !prev);
    if (!viewerState.autoRotate) {
      toast.success('Auto-rotation enabled');
    } else {
      toast.success('Auto-rotation disabled');
    }
  }, [viewerState]);

  // Handle reset button - reset rotation but preserve effects
  const handleReset = useCallback(() => {
    console.log('🎯 Reset button clicked');
    viewerState.setRotation({ x: 0, y: 0 });
    viewerState.setZoom(1);
    viewerState.setAutoRotate(false);
    toast.success('View reset to front');
  }, [viewerState]);

  // Handle zoom controls
  const handleZoomIn = useCallback(() => {
    viewerState.setZoom(prev => Math.min(3, prev + 0.2));
  }, [viewerState]);

  const handleZoomOut = useCallback(() => {
    viewerState.setZoom(prev => Math.max(0.5, prev - 0.2));
  }, [viewerState]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black/90 flex items-center justify-center select-none ${
      isFullscreen ? 'p-0' : 'p-8'
    }`}>
      {/* Header */}
      <ViewerHeader
        onClose={onClose}
        showStudioButton={!viewerState.showCustomizePanel}
        onOpenStudio={() => viewerState.setShowCustomizePanel(true)}
      />

      {/* Main 3D Scene */}
      <div className="relative w-full h-full">
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 8], fov: 45 }}
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Environment preset="studio" />
          
          <Card3D
            card={adaptedCard}
            controls={{
              orbitSpeed: 0.5,
              floatIntensity: 1.0,
              cameraDistance: 8,
              autoRotate: viewerState.autoRotate,
              gravityEffect: 0.0
            }}
            effectValues={effectValues}
            selectedScene={viewerState.selectedScene}
            selectedLighting={viewerState.selectedLighting}
            materialSettings={viewerState.materialSettings}
            overallBrightness={viewerState.overallBrightness}
            interactiveLighting={viewerState.interactiveLighting}
            onClick={viewerState.onCardClick}
          />

          {/* Orbit Controls for fallback interaction */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={false} // Let our Card3D handle rotation
            autoRotate={false}
            minDistance={4}
            maxDistance={15}
          />
        </Canvas>

        {/* Background Renderer - Fixed: Added missing props */}
        <div className="absolute inset-0 -z-10">
          <BackgroundRenderer
            backgroundType={viewerState.backgroundType}
            selectedScene={viewerState.selectedScene}
            overallBrightness={viewerState.overallBrightness}
            spaceControls={{
              orbitSpeed: 0.5,
              floatIntensity: 1.0,
              cameraDistance: 8,
              autoRotate: viewerState.autoRotate,
              gravityEffect: 0.0
            }}
            adaptedCard={adaptedCard}
            onCardClick={viewerState.onCardClick}
            onCameraReset={handleReset}
            effectValues={effectValues}
            selectedLighting={viewerState.selectedLighting}
            materialSettings={viewerState.materialSettings}
          />
        </div>

        {/* Viewer Controls */}
        <ViewerControls
          showEffects={viewerState.showEffects}
          autoRotate={viewerState.autoRotate}
          onToggleEffects={() => viewerState.setShowEffects(prev => !prev)}
          onToggleAutoRotate={handleRotateToggle}
          onReset={handleReset}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />

        {/* Studio Footer */}
        <div className="absolute bottom-0 left-0 right-0">
          <StudioFooter
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            onDownload={onDownload || handleDownloadClick}
            onShare={onShare ? () => handleShareClick() : undefined}
          />
        </div>
      </div>

      {/* Export Dialog - Fixed: removed canvasRef prop and added required props */}
      {viewerState.showExportDialog && (
        <ExportOptionsDialog
          isOpen={viewerState.showExportDialog}
          onClose={() => viewerState.setShowExportDialog(false)}
          onExport={(options) => {
            // Handle export with options
            console.log('Exporting with options:', options);
            viewerState.setShowExportDialog(false);
          }}
          isExporting={false}
          exportProgress={0}
          cardTitle={card.title}
        />
      )}
    </div>
  );
};
