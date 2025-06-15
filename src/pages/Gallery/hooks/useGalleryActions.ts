
import { useState } from 'react';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import { useNavigate } from 'react-router-dom';

export const useGalleryActions = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  // Clean up: Don't manage immersive viewer state here
  // const [showImmersiveViewer, setShowImmersiveViewer] = useState(false);
  // const [isStudioInitiallyOpen, setIsStudioInitiallyOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (card: any, featuredCards: any[]) => {
    // Go directly to studio for the clicked card
    if (card && card.id) {
      navigate(`/studio/${card.id}`);
    }
  };

  const handleCardChange = (newIndex: number) => {
    setSelectedCardIndex(newIndex);
  };

  // Remove immersive logic
  const handleCloseViewer = () => {};
  const handleShareCard = (convertedCards: CardData[]) => {};
  const handleDownloadCard = (convertedCards: CardData[]) => {};

  return {
    selectedCardIndex,
    // Remove immersive viewer state from return; just export navigation handlers
    // showImmersiveViewer,
    // isStudioInitiallyOpen,
    handleCardClick,
    handleCardChange,
    handleCloseViewer,
    handleShareCard,
    handleDownloadCard
  };
};
