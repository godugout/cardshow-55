import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StudioCardManager } from '@/components/studio/StudioCardManager';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { DatabaseSeedPrompt } from './Studio/components/DatabaseSeedPrompt';
import { StudioPauseButton } from '@/components/studio/StudioPauseButton';
import { StudioResetButton } from '@/components/studio/StudioResetButton';
import { useStudioState } from './Studio/hooks/useStudioState';
import { checkIfDatabaseHasCards } from '@/utils/seedDatabase';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import type { CardData } from '@/types/card';


const Studio = () => {
  const { cardId } = useParams();
  const { user } = useAuth();
  const [showSeedPrompt, setShowSeedPrompt] = useState(false);
  const [hasCheckedDatabase, setHasCheckedDatabase] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
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
  } = useStudioState(cardId);

  console.log('🎮 Studio: Rendering with cardId:', cardId, 'selectedCard:', selectedCard?.title);

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
        console.error('❌ Studio: Error checking database:', error);
        setHasCheckedDatabase(true);
        
        // Don't show seed prompt if there's a database error
        // The app can still function with mock data
        if (error instanceof Error && error.message.includes('auth')) {
          console.warn('⚠️ Studio: Authentication error - continuing with mock data');
        } else {
          console.warn('⚠️ Studio: Database error - continuing with mock data');
        }
      }
    };

    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (!hasCheckedDatabase) {
        console.warn('⚠️ Studio: Database check timeout - continuing with mock data');
        setHasCheckedDatabase(true);
      }
    }, 5000);

    checkDatabase().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => clearTimeout(timeoutId);
  }, [user, hasCheckedDatabase]);

  const handleSeedComplete = () => {
    setShowSeedPrompt(false);
    console.log('🌱 Database seeded, reloading studio...');
    // Trigger a reload of the studio state
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingState message="Loading studio..." fullPage />;
  }

  // Show seed prompt if database is empty and user is authenticated
  if (showSeedPrompt && user && dataSource !== 'database') {
    return <DatabaseSeedPrompt onSeedComplete={handleSeedComplete} />;
  }

  if (!selectedCard) {
    return <NoCardSelected />;
  }

  // Debug info in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎮 Studio rendering card: ${selectedCard.title} from ${dataSource} source`);
    console.log('🖼️ Card image URL:', selectedCard.image_url);
  }

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    console.log('🎮 Animation paused:', !isPaused);
  };

  const handleReset = () => {
    console.log('🔄 Resetting camera view');
    // Reset camera and animation state
  };

  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-crd-darkest relative">
        {/* 3D Card Viewer - Full Screen */}
        <StudioCardManager
          cards={mockCards}
          selectedCardIndex={currentCardIndex}
          onCardSelect={handleCardChange}
          enableInteraction={true}
          showGrid={false}
          cameraControls={true}
        />

        {/* Simple Controls - Lower Left */}
        <StudioResetButton onReset={handleReset} />
        <StudioPauseButton 
          isPaused={isPaused} 
          onTogglePause={handleTogglePause} 
        />
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
