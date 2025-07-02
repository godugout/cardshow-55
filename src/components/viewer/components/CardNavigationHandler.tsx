
import React, { useEffect, useCallback } from 'react';
import { CardNavigationControls } from './CardNavigationControls';

interface CardNavigationHandlerProps {
  cards: any[];
  currentCardIndex: number;
  onCardChange?: (index: number) => void;
}

export const CardNavigationHandler: React.FC<CardNavigationHandlerProps> = ({
  cards,
  currentCardIndex,
  onCardChange
}) => {
  const hasMultipleCards = cards.length > 1;
  const canGoNext = hasMultipleCards && currentCardIndex < cards.length - 1;
  const canGoPrev = hasMultipleCards && currentCardIndex > 0;

  const handlePreviousCard = useCallback(() => {
    if (canGoPrev && onCardChange) {
      onCardChange(currentCardIndex - 1);
    }
  }, [canGoPrev, currentCardIndex, onCardChange]);

  const handleNextCard = useCallback(() => {
    if (canGoNext && onCardChange) {
      onCardChange(currentCardIndex + 1);
    }
  }, [canGoNext, currentCardIndex, onCardChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousCard();
      } else if (e.key === 'ArrowRight') {
        handleNextCard();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlePreviousCard, handleNextCard]);

  return (
    <CardNavigationControls
      hasMultipleCards={hasMultipleCards}
      currentCardIndex={currentCardIndex}
      totalCards={cards.length}
      canGoPrev={canGoPrev}
      canGoNext={canGoNext}
      onPrevious={handlePreviousCard}
      onNext={handleNextCard}
    />
  );
};
