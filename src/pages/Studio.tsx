
import React from 'react';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { StudioHeader } from './Studio/components/StudioHeader';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { Card3D } from '@/components/viewer/components/NewCard3D';
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

  console.log('🎬 Studio rendering with card:', {
    title: selectedCard.title,
    imageUrl: selectedCard.image_url,
    expectedImage: 'Should be Puff the Magic Dragon'
  });

  const handleCardFlip = (isFlipped: boolean) => {
    console.log('🔄 Card flipped to:', isFlipped ? 'BACK (CRD Logo)' : 'FRONT (Puff the Magic Dragon)');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Studio Header */}
        <StudioHeader />

        {/* Main Studio Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
          <div className="flex flex-col items-center space-y-8">
            {/* Card Title */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">
                {selectedCard.title}
              </h1>
              <p className="text-gray-400 text-lg">
                Card {currentCardIndex + 1} of {mockCards.length}
              </p>
            </div>

            {/* New Simplified 3D Card */}
            <Card3D
              frontImage={selectedCard.image_url || '/placeholder-card.jpg'}
              backImage="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png"
              title={selectedCard.title}
              onFlip={handleCardFlip}
              onClick={() => console.log('💫 Card clicked!')}
              effects={{
                holographic: 30,
                chrome: 20,
                brightness: 110
              }}
              className="mb-8"
            />

            {/* Card Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleCardChange(Math.max(0, currentCardIndex - 1))}
                disabled={currentCardIndex === 0}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <span className="text-white px-4">
                {currentCardIndex + 1} / {mockCards.length}
              </span>
              
              <button
                onClick={() => handleCardChange(Math.min(mockCards.length - 1, currentCardIndex + 1))}
                disabled={currentCardIndex === mockCards.length - 1}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleShare(selectedCard)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Share Card
              </button>
              
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Download
              </button>
              
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
