import React, { useState } from 'react';
import { RevolutionaryCardCreator } from './RevolutionaryCardCreator';

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
  const [currentCard, setCurrentCard] = useState<InteractiveCardData | null>(null);

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