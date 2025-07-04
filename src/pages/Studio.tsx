import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { DatabaseSeedPrompt } from './Studio/components/DatabaseSeedPrompt';
import { useStudioState } from './Studio/hooks/useStudioState';
import { checkIfDatabaseHasCards } from '@/utils/seedDatabase';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { Slider } from '@/components/ui/slider';
import { SharedStudioEnvironment } from '@/components/viewer/shared/SharedStudioEnvironment';
import { useImmersiveViewerState } from '@/components/viewer/hooks/useImmersiveViewerState';
import type { CardData } from '@/types/card';

// Helper function to convert CardData to the format expected by ImmersiveCardViewer
const convertCardForViewer = (card: CardData) => {
  console.log('🔄 Converting card for viewer:', card.title, 'Image URL:', card.image_url);
  
  return {
    id: card.id,
    title: card.title,
    description: card.description,
    image_url: card.image_url, // Ensure image_url is preserved
    thumbnail_url: card.thumbnail_url,
    tags: card.tags,
    design_metadata: card.design_metadata,
    visibility: card.visibility,
    template_id: card.template_id,
    // Map epic to legendary for compatibility with viewer, but preserve others
    rarity: card.rarity === 'epic' ? 'legendary' as const : 
           card.rarity as 'common' | 'uncommon' | 'rare' | 'legendary',
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
    },
    verification_status: card.verification_status,
    print_metadata: card.print_metadata,
    creator_id: card.creator_id,
    // Add properties that might be needed
    is_public: card.visibility === 'public',
    collection_id: card.collection_id,
    team_id: card.team_id,
    view_count: card.view_count,
    created_at: card.created_at
  };
};

const Studio = () => {
  const { cardId } = useParams();
  const { user } = useAuth();
  const [showSeedPrompt, setShowSeedPrompt] = useState(false);
  const [hasCheckedDatabase, setHasCheckedDatabase] = useState(false);
  const [cardSpacing, setCardSpacing] = useState([100]); // State for gap between cards
  
  // Initialize shared viewer state for the environment
  const { viewerState, actions } = useImmersiveViewerState();
  
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
    console.log('🖼️ Card image URL:', selectedCard.image_url);
  }

  // Convert card and mockCards for viewer compatibility
  const viewerCard = convertCardForViewer(selectedCard);
  const viewerCards = mockCards.map(convertCardForViewer);

  console.log('🎯 Converted viewer card:', viewerCard.title, 'Image URL:', viewerCard.image_url);
  console.log('🔍 Studio: Total viewerCards:', viewerCards.length, 'Cards:', viewerCards.map(c => c.title));
  console.log('🎮 Studio: About to render', viewerCards.slice(0, 2).length, 'card viewers');

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

  // Handle card interactions in the shared environment
  const handleCardInteraction = (cardIndex: number, event: React.MouseEvent) => {
    console.log(`🎯 Card ${cardIndex} interaction:`, event.type);
    // You can add specific interaction logic here
  };

  // Handle camera changes in the shared environment
  const handleCameraChange = (position: { x: number; y: number; z: number }, rotation: { x: number; y: number }) => {
    console.log('📷 Camera changed:', { position, rotation });
    // You can add camera state management here
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
        
        {/* Spacing Control Slider */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 bg-crd-darkest/90 backdrop-blur-sm rounded-lg p-4 border border-crd-mediumGray/20">
          <div className="flex items-center gap-4 min-w-[300px]">
            <span className="text-white text-sm font-medium whitespace-nowrap">Card Spacing:</span>
            <div className="flex-1">
              <Slider
                value={cardSpacing}
                onValueChange={setCardSpacing}
                max={200}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
            <span className="text-crd-green text-sm font-mono w-12 text-right">{cardSpacing[0]}px</span>
          </div>
        </div>

        {/* Shared 3D Environment with Both Cards */}
        <div className="w-full h-screen">
          <SharedStudioEnvironment
            cards={viewerCards.slice(0, 2)}
            selectedScene={viewerState.selectedScene}
            selectedLighting={viewerState.selectedLighting}
            materialSettings={viewerState.materialSettings}
            environmentControls={viewerState.environmentControls}
            overallBrightness={viewerState.overallBrightness}
            interactiveLighting={viewerState.interactiveLighting}
            effectValues={{}} // We'll need to implement effects integration
            cardSpacing={cardSpacing[0]}
            allowRotation={true}
            autoRotate={false}
            zoom={1}
            onCardInteraction={handleCardInteraction}
            onCameraChange={handleCameraChange}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
