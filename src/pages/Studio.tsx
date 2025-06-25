
import React, { useState, useEffect } from 'react';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { SwipeableCardViewer } from '@/components/mobile/SwipeableCardViewer';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { DatabaseSeedPrompt } from './Studio/components/DatabaseSeedPrompt';
import { useStudioState } from './Studio/hooks/useStudioState';
import { checkIfDatabaseHasCards } from '@/utils/seedDatabase';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

const Studio = () => {
  const { user } = useAuth();
  const { isMobile } = useResponsiveLayout();
  const [showSeedPrompt, setShowSeedPrompt] = useState(false);
  const [hasCheckedDatabase, setHasCheckedDatabase] = useState(false);
  
  const {
    selectedCard,
    currentCardIndex,
    isLoading,
    mockCards,
    dataSource,
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  } = useStudioState();

  // Check if database has cards and show seed prompt if needed (only if no cards found)
  useEffect(() => {
    const checkDatabase = async () => {
      if (!user || hasCheckedDatabase) return;
      
      try {
        const hasCards = await checkIfDatabaseHasCards();
        console.log('🔍 Database check result:', hasCards ? 'Has cards' : 'Empty');
        
        // Only show seed prompt if we have no cards from any source
        if (!hasCards && mockCards.length === 0 && dataSource === 'none') {
          setShowSeedPrompt(true);
        }
        setHasCheckedDatabase(true);
      } catch (error) {
        console.error('Error checking database:', error);
        setHasCheckedDatabase(true);
      }
    };

    // Only check if we don't have any cards loaded
    if (dataSource === 'none' || (!isLoading && mockCards.length === 0)) {
      checkDatabase();
    }
  }, [user, hasCheckedDatabase, mockCards.length, dataSource, isLoading]);

  const handleSeedComplete = () => {
    setShowSeedPrompt(false);
    console.log('🌱 Database seeded, reloading studio...');
    // Trigger a reload of the studio state
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingState message="Loading studio..." fullPage />;
  }

  // Show seed prompt if database is empty and we have no cards from any source
  if (showSeedPrompt && user && dataSource === 'none' && mockCards.length === 0) {
    return <DatabaseSeedPrompt onSeedComplete={handleSeedComplete} />;
  }

  if (!selectedCard) {
    return <NoCardSelected />;
  }

  // Debug info in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎮 Studio rendering card: ${selectedCard.title} from ${dataSource} source, isMobile: ${isMobile}`);
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        {/* Data source indicator (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 left-4 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs">
            Source: {dataSource} ({mockCards.length} cards) - {isMobile ? 'Mobile' : 'Desktop'}
          </div>
        )}
        
        {/* Mobile vs Desktop Studio Experience */}
        {isMobile ? (
          <SwipeableCardViewer
            cards={mockCards}
            currentIndex={currentCardIndex}
            onCardChange={handleCardChange}
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
          </SwipeableCardViewer>
        ) : (
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
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
