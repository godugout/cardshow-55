
import React from 'react';
import { SimplifiedImmersiveCardViewer } from '@/components/viewer/SimplifiedImmersiveCardViewer';
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

  const handleCardChangeWrapper = (card: any, index: number) => {
    handleCardChange(index);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        {/* Studio Header */}
        <StudioHeader />

        {/* Simplified Immersive Card Viewer */}
        <SimplifiedImmersiveCardViewer
          card={selectedCard}
          cards={mockCards}
          currentCardIndex={currentCardIndex}
          onCardChange={handleCardChangeWrapper}
          isOpen={true}
          onClose={handleClose}
          onShare={() => handleShare(selectedCard)}
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
