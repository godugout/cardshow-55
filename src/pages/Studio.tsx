
import React from 'react';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { StudioHeader } from './Studio/components/StudioHeader';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { useStudioState } from './Studio/hooks/useStudioState';
import { useViewerState } from '@/components/viewer/hooks/useViewerState';
import { useEnhancedCardEffects } from '@/components/viewer/hooks/useEnhancedCardEffects';
import { EnhancedCardCanvas } from '@/components/viewer/components/EnhancedCardCanvas';
import { SpaceRenderer3D } from '@/components/viewer/spaces/SpaceRenderer3D';
import { StudioFooter } from '@/components/viewer/components/studio/StudioFooter';
import type { CardData } from '@/hooks/useCardEditor';

const Studio = () => {
  const {
    selectedCard,
    currentCardIndex,
    isLoading,
    mockCards,
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  } = useStudioState();
  
  const viewerState = useViewerState();
  const { effectValues, resetAllEffects } = useEnhancedCardEffects();
  const mainRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedCard?.design_metadata?.effects) {
        // When card changes, reset effects to match the new card's data
        resetAllEffects(); // First clear any existing effects
        // This is where you would apply effects from selectedCard
    }
  }, [selectedCard, resetAllEffects]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mainRef.current) {
      const rect = mainRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      viewerState.setMousePosition({ x, y });
    }
  };

  const handleToggle3D = () => {
    viewerState.setBackgroundType(prev => (prev === 'scene' ? 'space' : 'scene'));
  };

  if (isLoading) {
    return <LoadingState message="Loading studio..." fullPage />;
  }

  if (!selectedCard) {
    return <NoCardSelected />;
  }

  // A simple card object for 3D renderer
  const simpleCard = {
      id: selectedCard.id || 'default',
      title: selectedCard.title || 'Card',
      image_url: selectedCard.image_url
  };

  return (
    <ErrorBoundary>
      <div className="h-screen bg-crd-darkest flex flex-col">
        <StudioHeader />

        <main 
          ref={mainRef}
          className="flex-1 flex items-center justify-center relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => viewerState.setIsHovering(true)}
          onMouseLeave={() => viewerState.setIsHovering(false)}
        >
          {viewerState.backgroundType === 'scene' ? (
            <EnhancedCardCanvas
              card={selectedCard}
              effectValues={effectValues}
              mousePosition={viewerState.mousePosition}
              isHovering={viewerState.isHovering}
              rotation={viewerState.rotation}
              selectedScene={viewerState.selectedScene}
              selectedLighting={viewerState.selectedLighting}
              overallBrightness={viewerState.overallBrightness[0]}
              interactiveLighting={viewerState.interactiveLighting}
              materialSettings={viewerState.materialSettings}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => viewerState.setIsHovering(true)}
              onMouseLeave={() => viewerState.setIsHovering(false)}
            />
          ) : viewerState.selectedSpace ? (
            <SpaceRenderer3D
              card={simpleCard}
              environment={viewerState.selectedSpace}
              controls={viewerState.spaceControls}
              effectValues={effectValues}
              selectedScene={viewerState.selectedScene}
              selectedLighting={viewerState.selectedLighting}
              materialSettings={viewerState.materialSettings}
              overallBrightness={viewerState.overallBrightness}
              interactiveLighting={viewerState.interactiveLighting}
              onCardClick={viewerState.onCardClick}
              onCameraReset={viewerState.handleResetCamera}
            />
          ) : (
             <div className="text-white bg-black/30 p-4 rounded-lg">
                Please select a 3D space from the customization panel to view the card in 3D.
             </div>
          )}
        </main>
        
        <StudioFooter
          isFullscreen={viewerState.isFullscreen}
          onToggleFullscreen={() => viewerState.setIsFullscreen(!viewerState.isFullscreen)}
          onDownload={handleDownload}
          onShare={() => handleShare(selectedCard)}
          onToggle3D={handleToggle3D}
          is3D={viewerState.backgroundType === 'space'}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
