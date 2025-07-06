import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { DatabaseSeedPrompt } from './Studio/components/DatabaseSeedPrompt';
import { useStudioState } from './Studio/hooks/useStudioState';
import { checkIfDatabaseHasCards } from '@/utils/seedDatabase';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CardGallery } from '@/components/cards/display/CardGallery';
import type { CardData } from '@/types/card';

const Studio = () => {
  const { cardId } = useParams();
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
        console.error('Error checking database:', error);
        setHasCheckedDatabase(true);
      }
    };

    checkDatabase();
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

  if (!selectedCard || mockCards.length === 0) {
    return <NoCardSelected />;
  }

  // Debug info in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎮 Studio rendering card: ${selectedCard.title} from ${dataSource} source`);
    console.log('🖼️ Card image URL:', selectedCard.image_url);
    console.log('📦 Available cards:', mockCards.length);
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        {/* Data source indicator (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 left-4 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs">
            Source: {dataSource} ({mockCards.length} cards) | Card: {cardId || 'auto-selected'}
          </div>
        )}
        
        {/* Header */}
        <div className="p-6 border-b border-crd-mediumGray">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-crd-white">Card Studio</h1>
              <p className="text-crd-lightGray">Interactive card design and preview system</p>
            </div>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-crd-mediumGray text-crd-white rounded-lg hover:bg-crd-lightGray hover:text-crd-darkest transition-all"
            >
              Close Studio
            </button>
          </div>
        </div>
        
        {/* Card Gallery */}
        <div className="max-w-7xl mx-auto p-6">
          <CardGallery
            cards={mockCards}
            mode="sandwich"
            showStyleVariations={false}
            debug={process.env.NODE_ENV === 'development'}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
