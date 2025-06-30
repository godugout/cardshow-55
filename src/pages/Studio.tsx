import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NoCardSelected } from './Studio/components/NoCardSelected';
import { DatabaseSeedPrompt } from './Studio/components/DatabaseSeedPrompt';
import { useStudioState } from './Studio/hooks/useStudioState';
import { useStudioEffectsBridge } from '@/components/viewer/hooks/useStudioEffectsBridge';
import { checkIfDatabaseHasCards } from '@/utils/seedDatabase';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import type { CardData } from '@/types/card';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '@/components/viewer/types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '@/components/viewer/constants';

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
  
  // Studio effects state
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    metalness: 0.5,
    roughness: 0.5,
    reflectivity: 0.5,
    clearcoat: 0.3
  });
  const [overallBrightness, setOverallBrightness] = useState(100);
  const [interactiveLighting, setInteractiveLighting] = useState(true);

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

  // Bridge Studio effects to card rendering
  const { cardEffects, updateStudioEffect } = useStudioEffectsBridge(
    {}, // Initial effects
    selectedScene,
    selectedLighting,
    materialSettings,
    overallBrightness,
    interactiveLighting
  );

  console.log('🎮 Studio: Enhanced effects active:', Object.keys(cardEffects));

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
    console.log('✨ Active effects:', cardEffects);
  }

  // Convert card and mockCards for viewer compatibility with enhanced effects
  const viewerCard = {
    ...convertCardForViewer(selectedCard),
    // Inject enhanced effects into card data
    design_metadata: {
      ...selectedCard.design_metadata,
      enhanced_effects: cardEffects,
      studio_settings: {
        selectedScene,
        selectedLighting,
        materialSettings,
        overallBrightness,
        interactiveLighting
      }
    }
  };
  
  const viewerCards = mockCards.map(card => ({
    ...convertCardForViewer(card),
    design_metadata: {
      ...card.design_metadata,
      enhanced_effects: cardEffects,
      studio_settings: {
        selectedScene,
        selectedLighting,
        materialSettings,
        overallBrightness,
        interactiveLighting
      }
    }
  }));

  console.log('🎯 Enhanced viewer card with effects:', viewerCard.title);

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
            <br />Effects: {Object.keys(cardEffects).length} active
          </div>
        )}
        
        {/* Enhanced Immersive Card Viewer with Studio Effects */}
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
          // Pass Studio panel state for real-time effect updates
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={[overallBrightness]}
          interactiveLighting={interactiveLighting}
          // Callbacks for Studio panel controls
          onSceneChange={setSelectedScene}
          onLightingChange={setSelectedLighting}
          onMaterialSettingsChange={setMaterialSettings}
          onBrightnessChange={(value: number[]) => setOverallBrightness(value[0])}
          onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
