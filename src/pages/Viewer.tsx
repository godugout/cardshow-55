
import React, { useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ViewerHeader } from '@/components/viewer/ViewerHeader';
import { ViewerModeSelector } from '@/components/viewer/ViewerModeSelector';
import { ShopPanel } from '@/components/viewer/ShopPanel';
import { useViewerData } from './Viewer/hooks/useViewerData';
import type { CardData } from '@/hooks/useCardEditor';

export type ViewerMode = 'view' | 'studio' | 'shop';

const Viewer = () => {
  const { cardId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract mode from URL or default to 'view'
  const mode = (searchParams.get('mode') as ViewerMode) || 'view';
  const collectionId = searchParams.get('collection');
  const cardIndex = searchParams.get('index') ? parseInt(searchParams.get('index')!) : 0;

  // State management
  const [showStudioPanel, setShowStudioPanel] = useState(mode === 'studio');
  const [showShopPanel, setShowShopPanel] = useState(mode === 'shop');

  // Data fetching
  const {
    selectedCard,
    cards,
    currentCardIndex,
    isLoading,
    error,
    handleCardChange,
    createNewCard
  } = useViewerData({ cardId, collectionId, cardIndex });

  // Mode switching
  const handleModeChange = useCallback((newMode: ViewerMode) => {
    const params = new URLSearchParams(searchParams);
    params.set('mode', newMode);
    navigate(`/viewer${cardId ? `/${cardId}` : ''}?${params.toString()}`, { replace: true });
    
    // Update panel visibility
    setShowStudioPanel(newMode === 'studio');
    setShowShopPanel(newMode === 'shop');
  }, [cardId, searchParams, navigate]);

  // Navigation handlers
  const handleClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleShare = useCallback((card: CardData) => {
    const shareUrl = `${window.location.origin}/viewer/${card.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => console.log('Card link copied to clipboard'))
        .catch(() => console.error('Failed to copy link'));
    }
  }, []);

  const handleDownload = useCallback((card: CardData) => {
    // Export functionality will be handled by the viewer
    console.log('Download card:', card.title);
  }, []);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error Loading Viewer</h2>
          <p className="text-crd-lightGray mb-6">{error}</p>
          <button 
            onClick={handleClose}
            className="px-6 py-3 bg-crd-purple rounded-lg hover:bg-crd-purple/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <LoadingState message="Loading viewer..." fullPage />;
  }

  // Shop mode with no card - show creation interface
  if (mode === 'shop' && !selectedCard) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-crd-darkest">
          <ViewerHeader 
            mode={mode}
            onModeChange={handleModeChange}
            onClose={handleClose}
          />
          
          <ShopPanel
            isVisible={true}
            onClose={() => handleModeChange('view')}
            onCardCreate={createNewCard}
            mode="create"
          />
        </div>
      </ErrorBoundary>
    );
  }

  // No card selected and not in shop mode
  if (!selectedCard) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Card Selected</h2>
          <p className="text-crd-lightGray mb-6">Choose a card to view or create a new one</p>
          <div className="space-x-4">
            <button 
              onClick={handleClose}
              className="px-6 py-3 bg-crd-lightGray text-crd-dark rounded-lg hover:bg-crd-lightGray/90 transition-colors"
            >
              Browse Cards
            </button>
            <button 
              onClick={() => handleModeChange('shop')}
              className="px-6 py-3 bg-crd-purple rounded-lg hover:bg-crd-purple/90 transition-colors"
            >
              Create New Card
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest relative">
        {/* Floating Header with Mode Selector */}
        <div className="absolute top-0 left-0 right-0 z-50 p-4">
          <div className="flex justify-between items-center">
            <ViewerModeSelector 
              currentMode={mode}
              onModeChange={handleModeChange}
            />
            <button
              onClick={handleClose}
              className="bg-black/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/40 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Main Viewer Experience */}
        <ImmersiveCardViewer
          card={selectedCard}
          cards={cards}
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

        {/* Shop Panel for Card Creation/Editing */}
        {showShopPanel && selectedCard && (
          <ShopPanel
            isVisible={showShopPanel}
            onClose={() => setShowShopPanel(false)}
            onCardCreate={createNewCard}
            card={selectedCard}
            mode="edit"
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Viewer;
