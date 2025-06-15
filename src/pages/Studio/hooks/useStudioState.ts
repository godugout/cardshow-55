
import { useState, useEffect } from 'react';
import { useResolveStudioCard } from './useResolveStudioCard';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import { mockCards } from '../mockData';

// Core studio state management
export const useStudioState = () => {
  const resolveCard = useResolveStudioCard();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // On mount and when params change, resolve the card
  useEffect(() => {
    setIsLoading(true);
    const [card, idx] = resolveCard();
    setSelectedCard(card);
    setCurrentCardIndex(idx);
    setIsLoading(false);
    // Log to debug card selection logic
    console.log('[Studio] Loaded card:', card?.id, idx);
  }, [resolveCard]);

  // Handle navigation (next/prev) by index.
  const handleCardChange = (index: number) => {
    const newCard = mockCards[index];
    if (newCard) {
      setSelectedCard(newCard);
      setCurrentCardIndex(index);
      window.history.replaceState(null, '', `/studio/${newCard.id}`);
    }
  };

  // Handle sharing - generates shareable URL
  const handleShare = (card: CardData) => {
    const shareUrl = `${window.location.origin}/studio/${card.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Studio link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    } else {
      toast.error('Sharing not supported in this browser');
    }
  };

  // Fake download (could expand later)
  const handleDownload = () => {
    if (selectedCard) {
      toast.success(`Exporting ${selectedCard.title}...`);
    }
  };

  // On studio close, return to gallery
  const handleClose = () => {
    window.location.href = '/gallery';
  };

  return {
    selectedCard,
    currentCardIndex,
    isLoading,
    mockCards,
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  };
};
