
import React, { useState, useEffect, useRef } from 'react';
import { Card3DViewer } from './Card3DViewer';
import type { CardData } from '@/hooks/useCardEditor';

interface Card3DManagerProps {
  cards: CardData[];
  maxConcurrent?: number;
  className?: string;
}

interface ActiveCard {
  id: string;
  card: CardData;
  timestamp: number;
}

export const Card3DManager: React.FC<Card3DManagerProps> = ({
  cards,
  maxConcurrent = 3,
  className = ''
}) => {
  const [activeCards, setActiveCards] = useState<ActiveCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const memoryUsage = useRef(0);

  // Monitor memory usage
  useEffect(() => {
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage.current = memory.usedJSHeapSize / 1024 / 1024; // MB
        console.log(`Memory usage: ${memoryUsage.current.toFixed(2)}MB`);
      }
    };

    const interval = setInterval(monitorMemory, 5000);
    return () => clearInterval(interval);
  }, []);

  // Manage active 3D cards to prevent memory issues
  useEffect(() => {
    if (cards.length === 0) return;

    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    setActiveCards(prev => {
      const existing = prev.find(ac => ac.id === currentCard.id);
      if (existing) {
        // Update timestamp for existing card
        return prev.map(ac => 
          ac.id === currentCard.id 
            ? { ...ac, timestamp: Date.now() }
            : ac
        );
      }

      // Add new card
      const newActiveCards = [
        ...prev,
        { id: currentCard.id!, card: currentCard, timestamp: Date.now() }
      ];

      // Remove oldest cards if exceeding limit
      if (newActiveCards.length > maxConcurrent) {
        newActiveCards.sort((a, b) => b.timestamp - a.timestamp);
        return newActiveCards.slice(0, maxConcurrent);
      }

      return newActiveCards;
    });
  }, [currentIndex, cards, maxConcurrent]);

  // Navigation functions
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          prevCard();
          break;
        case 'ArrowRight':
          nextCard();
          break;
        case ' ':
          event.preventDefault();
          // Space bar could trigger flip
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (cards.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <p className="text-text-secondary">No cards available</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Main 3D viewer */}
      <Card3DViewer
        card={currentCard}
        className="w-full h-full"
        interactive={true}
        autoRotate={false}
        showStats={process.env.NODE_ENV === 'development'}
      />

      {/* Navigation controls */}
      {cards.length > 1 && (
        <>
          <button
            onClick={prevCard}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-3 rounded-full hover:bg-black transition-colors"
            aria-label="Previous card"
          >
            ←
          </button>
          
          <button
            onClick={nextCard}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-3 rounded-full hover:bg-black transition-colors"
            aria-label="Next card"
          >
            →
          </button>

          {/* Card counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded">
            {currentIndex + 1} / {cards.length}
          </div>
        </>
      )}

      {/* Memory usage indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/80 text-white px-2 py-1 rounded text-xs">
          Active: {activeCards.length}/{maxConcurrent}
          <br />
          Memory: {memoryUsage.current.toFixed(1)}MB
        </div>
      )}
    </div>
  );
};
