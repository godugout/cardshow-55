import React, { useState } from 'react';
import { StudioLayout } from '@/components/studio/StudioLayout';
import { DemoCardViewer } from '@/components/studio/DemoCardViewer';
import type { CardData } from '@/hooks/useCardEditor';

export const Studio = () => {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  // Always show the demo viewer instead of the "No card selected" state
  const handleCardSelect = (card: CardData) => {
    setSelectedCard(card);
  };

  const handleCloseDemoViewer = () => {
    // Keep the demo viewer open, but could allow closing in the future
    console.log('Demo viewer close requested');
  };

  return (
    <div className="min-h-screen bg-crd-dark">
      <StudioLayout
        selectedCard={selectedCard}
        onCardSelect={handleCardSelect}
        renderViewer={() => (
          <DemoCardViewer onClose={handleCloseDemoViewer} />
        )}
      />
    </div>
  );
};

export default Studio;
