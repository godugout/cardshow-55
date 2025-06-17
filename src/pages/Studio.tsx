
import React, { useState, useEffect } from 'react';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { DatabaseSeedPrompt } from './Studio/components/DatabaseSeedPrompt';
import { useStudioState } from './Studio/hooks/useStudioState';
import { checkIfDatabaseHasCards } from '@/utils/seedDatabase';
import { useAuth } from '@/features/auth/providers/AuthProvider';

const Studio = () => {
  const { user } = useAuth();
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

  // Hide the main navbar when studio is mounted
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.display = 'none';
    }
    
    // Cleanup: show navbar when component unmounts
    return () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, []);

  // Check if database has cards and show seed prompt if needed
  useEffect(() => {
    const checkDatabase = async () => {
      if (!user || hasCheckedDatabase) return;
      
      try {
        const hasCards = await checkIfDatabaseHasCards();
        console.log('🔍 Database check result:', hasCards ? 'Has cards' : 'Empty');
        if (!hasCards) {
          setShowSeedPrompt(true);
        }
        setHasCheckedDatabase(true);
      } catch (error) {
        console.error('Error checking database:', error);
        setHasCheckedDatabase(true);
      }
    };

    checkDatabase();
  }, [user, hasCheckedDatabase]);

  const handleSeedComplete = () => {
    setShowSeedPrompt(false);
    console.log('🌱 Database seeded, reloading studio...');
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingState message="Loading studio..." fullPage />;
  }

  if (showSeedPrompt && user && dataSource !== 'database') {
    return <DatabaseSeedPrompt onSeedComplete={handleSeedComplete} />;
  }

  if (!selectedCard) {
    return <NoCardSelected />;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`🎮 Studio rendering card: ${selectedCard.title} from ${dataSource} source`);
  }

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 z-50 bg-crd-darkest">
        {/* Data source indicator (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 left-4 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs">
            Source: {dataSource} ({mockCards.length} cards)
          </div>
        )}
        
        {/* Immersive Card Viewer - Full control over the entire viewport */}
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
