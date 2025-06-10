
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        {/* Studio Header */}
        <StudioHeader />

        {/* Immersive Card Viewer with Enhanced Error Handling */}
        <ErrorBoundary 
          fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-text-primary text-xl mb-2">Viewer Error</div>
                <div className="text-text-secondary">Please try refreshing the page</div>
              </div>
            </div>
          }
        >
          <ImmersiveCardViewer
            card={selectedCard}
            cards={mockCards}
            currentCardIndex={currentCardIndex}
            onCardChange={handleCardChange}
            isOpen={true}
            onClose={handleClose}
            onShare={handleShare}
            onDownload={handleDownload}
            allowRotation={true}
            showStats={true}
            ambient={true}
          />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
