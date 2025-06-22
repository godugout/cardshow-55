
import React, { useState, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import type { CardData } from '@/hooks/useCardEditor';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SwipeableCardViewerProps {
  cards: CardData[];
  currentIndex: number;
  onCardChange: (index: number) => void;
  children: React.ReactNode;
}

export const SwipeableCardViewer: React.FC<SwipeableCardViewerProps> = ({
  cards,
  currentIndex,
  onCardChange,
  children
}) => {
  const { isMobile } = useResponsiveLayout();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSwipeLeft = useCallback(() => {
    if (isTransitioning) return;
    
    const nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
    setIsTransitioning(true);
    onCardChange(nextIndex);
    
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentIndex, cards.length, onCardChange, isTransitioning]);

  const handleSwipeRight = useCallback(() => {
    if (isTransitioning) return;
    
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
    setIsTransitioning(true);
    onCardChange(prevIndex);
    
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentIndex, cards.length, onCardChange, isTransitioning]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    delta: 50, // Minimum swipe distance
    preventScrollOnSwipe: true,
    trackMouse: false, // Only touch events
  });

  if (!isMobile) {
    return <>{children}</>;
  }

  const hasMultipleCards = cards.length > 1;

  return (
    <div className="relative w-full h-full" {...swipeHandlers}>
      {/* Card content */}
      <div className={`w-full h-full transition-transform duration-300 ${isTransitioning ? 'scale-95' : 'scale-100'}`}>
        {children}
      </div>

      {/* Navigation indicators */}
      {hasMultipleCards && (
        <>
          {/* Swipe indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => onCardChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-crd-green scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Navigation arrows (optional backup) */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwipeRight}
              className="bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwipeLeft}
              className="bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Swipe hint on first card */}
          {currentIndex === 0 && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg animate-fade-in">
              <p className="text-white text-sm text-center">
                Swipe left or right to browse cards
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
