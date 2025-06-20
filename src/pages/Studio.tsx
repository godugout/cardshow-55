
import React, { useState, useEffect } from 'react';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { DatabaseSeedPrompt } from './Studio/components/DatabaseSeedPrompt';
import { EnhancedCardDisplay } from '@/components/viewer/EnhancedCardDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cube, Eye } from 'lucide-react';
import { useStudioState } from './Studio/hooks/useStudioState';
import { checkIfDatabaseHasCards } from '@/utils/seedDatabase';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { use3DPreferences } from '@/hooks/use3DPreferences';

const Studio = () => {
  const { user } = useAuth();
  const [showSeedPrompt, setShowSeedPrompt] = useState(false);
  const [hasCheckedDatabase, setHasCheckedDatabase] = useState(false);
  const [viewMode, setViewMode] = useState<'immersive' | '3d' | 'standard'>('3d');
  
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

  const { preferences, updatePreferences } = use3DPreferences();

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

  // Set initial view mode based on user preferences
  useEffect(() => {
    if (preferences.prefer3D) {
      setViewMode('3d');
    }
  }, [preferences.prefer3D]);

  const handleSeedComplete = () => {
    setShowSeedPrompt(false);
    console.log('🌱 Database seeded, reloading studio...');
    window.location.reload();
  };

  const handleViewModeChange = (mode: 'immersive' | '3d' | 'standard') => {
    setViewMode(mode);
    if (mode === '3d') {
      updatePreferences({ prefer3D: true });
    } else if (mode === 'standard') {
      updatePreferences({ prefer3D: false });
    }
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        {/* Data source indicator (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 left-4 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs">
            Source: {dataSource} ({mockCards.length} cards)
            <br />
            View: {viewMode}
          </div>
        )}

        {/* View mode controls */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            variant={viewMode === 'standard' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('standard')}
            className="text-xs"
          >
            <Eye className="w-4 h-4 mr-1" />
            2D
          </Button>
          
          <Button
            variant={viewMode === '3d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('3d')}
            className="text-xs"
          >
            <Cube className="w-4 h-4 mr-1" />
            3D
          </Button>
          
          <Button
            variant={viewMode === 'immersive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('immersive')}
            className="text-xs"
          >
            Immersive
          </Button>
        </div>

        {/* Back button */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </div>

        {/* Card display based on view mode */}
        {viewMode === 'immersive' ? (
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
        ) : (
          <div className="min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-2xl h-[600px]">
              <EnhancedCardDisplay
                card={selectedCard}
                className="w-full h-full"
                defaultTo3D={viewMode === '3d'}
                showToggle={false}
              />
            </div>
          </div>
        )}

        {/* Card navigation for non-immersive modes */}
        {viewMode !== 'immersive' && mockCards.length > 1 && (
          <>
            <button
              onClick={() => handleCardChange(currentCardIndex - 1)}
              className="fixed left-8 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-4 rounded-full hover:bg-black transition-colors z-40"
              aria-label="Previous card"
            >
              ←
            </button>
            
            <button
              onClick={() => handleCardChange(currentCardIndex + 1)}
              className="fixed right-8 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-4 rounded-full hover:bg-black transition-colors z-40"
              aria-label="Next card"
            >
              →
            </button>

            {/* Card counter */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded z-40">
              {currentCardIndex + 1} / {mockCards.length}
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
