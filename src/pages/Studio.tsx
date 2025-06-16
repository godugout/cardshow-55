
import React from 'react';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
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
        {/* Immersive Card Viewer - the navbar logo will show through */}
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
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
