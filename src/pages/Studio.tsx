
import React from 'react';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { StudioHeader } from './Studio/components/StudioHeader';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { useStudioState } from './Studio/hooks/useStudioState';

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

  if (isLoading) {
    return <LoadingState message="Loading studio..." fullPage />;
  }

  if (!selectedCard) {
    return <NoCardSelected />;
  }

  // Create wrapper functions that don't require parameters
  const handleShareWrapper = () => {
    if (selectedCard) {
      handleShare(selectedCard);
    }
  };

  const handleDownloadWrapper = () => {
    if (selectedCard) {
      handleDownload(selectedCard);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        {/* Studio Header */}
        <StudioHeader />

        {/* Immersive Card Viewer */}
        <ImmersiveCardViewer
          card={selectedCard}
          cards={mockCards}
          currentCardIndex={currentCardIndex}
          onCardChange={handleCardChange}
          isOpen={true}
          onClose={handleClose}
          onShare={handleShareWrapper}
          onDownload={handleDownloadWrapper}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
