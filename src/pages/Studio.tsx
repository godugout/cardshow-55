
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { DatabaseSeedPrompt } from './Studio/components/DatabaseSeedPrompt';
import { useStudioState } from './Studio/hooks/useStudioState';
import { checkIfDatabaseHasCards } from '@/utils/seedDatabase';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import type { CardData } from '@/types/card';

// Helper function to convert CardData to the format expected by ImmersiveCardViewer
const convertCardForViewer = (card: CardData) => {
  return {
    ...card,
    // Map epic to ultra-rare for compatibility with viewer
    rarity: card.rarity === 'epic' ? 'ultra-rare' as const : card.rarity as 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary',
    // Ensure creator_attribution has required properties for viewer
    creator_attribution: {
      creator_name: card.creator_attribution?.creator_name || 'Unknown Creator',
      creator_id: card.creator_attribution?.creator_id || '',
      collaboration_type: (card.creator_attribution?.collaboration_type as 'solo' | 'collaboration') || 'solo'
    },
    // Ensure publishing_options has required properties for viewer
    publishing_options: {
      marketplace_listing: card.publishing_options?.marketplace_listing ?? false,
      crd_catalog_inclusion: card.publishing_options?.crd_catalog_inclusion ?? false,
      print_available: card.publishing_options?.print_available ?? false,
      pricing: card.publishing_options?.pricing,
      distribution: {
        limited_edition: card.publishing_options?.distribution?.limited_edition ?? false,
        edition_size: card.publishing_options?.distribution?.edition_size
      }
    }
  };
};

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

  if (!selectedCard) {
    return <NoCardSelected />;
  }

  // Debug info in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎮 Studio rendering card: ${selectedCard.title} from ${dataSource} source`);
  }

  // Convert card and mockCards for viewer compatibility
  const viewerCard = convertCardForViewer(selectedCard);
  const viewerCards = mockCards.map(convertCardForViewer);

  const handleViewerShare = (card: any) => {
    // Convert back to original CardData format for the handler
    const originalCard: CardData = {
      ...card,
      rarity: card.rarity === 'ultra-rare' ? 'epic' : card.rarity
    };
    handleShare(originalCard);
  };

  const handleViewerDownload = (card: any) => {
    // Convert back to original CardData format for the handler
    const originalCard: CardData = {
      ...card,
      rarity: card.rarity === 'ultra-rare' ? 'epic' : card.rarity
    };
    handleDownload(originalCard);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        {/* Data source indicator (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 left-4 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs">
            Source: {dataSource} ({mockCards.length} cards) | Card: {cardId || 'auto-selected'}
          </div>
        )}
        
        {/* Immersive Card Viewer - the navbar logo will show through */}
        <ImmersiveCardViewer
          card={viewerCard}
          cards={viewerCards}
          currentCardIndex={currentCardIndex}
          onCardChange={handleCardChange}
          isOpen={true}
          onClose={handleClose}
          onShare={handleViewerShare}
          onDownload={handleViewerDownload}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
