import React, { useState } from 'react';
import { RevolutionaryCardCreator } from './RevolutionaryCardCreator';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { InteractiveCardData } from '@/types/interactiveCard';
import type { CardData, CardRarity } from '@/hooks/useCardEditor';

interface RevolutionaryCardCreatorWrapperProps {
  onComplete: (cardData: CardData) => void;
  onCancel: () => void;
  initialMode?: string;
}

export const RevolutionaryCardCreatorWrapper: React.FC<RevolutionaryCardCreatorWrapperProps> = ({
  onComplete,
  onCancel
}) => {
  const { isEnabled, loading } = useFeatureFlags();
  const [currentCard, setCurrentCard] = useState<InteractiveCardData | null>(null);

  // Show loading state while checking feature flags
  if (loading) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-crd-white">Loading...</div>
      </div>
    );
  }

  // Redirect if revolutionary mode is not enabled
  if (!isEnabled('revolutionary_create_mode')) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <div className="text-crd-white text-xl mb-4">Revolutionary Mode Not Available</div>
          <div className="text-crd-lightGray mb-6">This feature is currently disabled.</div>
          <button 
            onClick={onCancel}
            className="bg-crd-green text-black px-6 py-2 rounded-lg hover:bg-crd-green/80 transition-colors"
          >
            Back to Standard Creator
          </button>
        </div>
      </div>
    );
  }

  const handleRevolutionaryComplete = (interactiveCard: InteractiveCardData) => {
    // Convert InteractiveCardData to CardData format for compatibility
    const compatibleCard: CardData = {
      id: interactiveCard.id,
      title: interactiveCard.title,
      description: interactiveCard.description || '',
      rarity: interactiveCard.rarity as CardRarity,
      creator_id: interactiveCard.creator_id,
      image_url: interactiveCard.assets.images[0]?.url || '',
      tags: [],
      visibility: 'private' as const,
      creator_attribution: {
        creator_name: '',
        creator_id: interactiveCard.creator_id,
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false
      },
      // Include interactive data in metadata for future enhancement
      design_metadata: {
        ...interactiveCard,
        interactive_type: 'revolutionary'
      }
    };

    onComplete(compatibleCard);
  };

  const handleSave = (card: InteractiveCardData) => {
    handleRevolutionaryComplete(card);
  };

  const handlePreview = (card: InteractiveCardData) => {
    setCurrentCard(card);
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <RevolutionaryCardCreator
        initialCard={currentCard || undefined}
        onSave={handleSave}
        onPreview={handlePreview}
      />
    </div>
  );
};