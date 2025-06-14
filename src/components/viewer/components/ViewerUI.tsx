
import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface ViewerUIProps {
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  card: CardData;
  cards: CardData[];
  currentCardIndex: number;
  showStats?: boolean;
}

export const ViewerUI: React.FC<ViewerUIProps> = ({
  onClose,
  onNext,
  onPrev,
  card,
  cards,
  currentCardIndex,
  showStats = false
}) => {
  const hasNext = currentCardIndex < cards.length - 1;
  const hasPrev = currentCardIndex > 0;

  return (
    <div className="absolute top-0 left-0 right-0 z-40 p-4">
      <div className="flex items-center justify-between">
        {/* Left side - Card navigation */}
        <div className="flex items-center space-x-2">
          {cards.length > 1 && (
            <>
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="p-2 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous card"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-white/60 text-sm">
                {currentCardIndex + 1} / {cards.length}
              </span>
              
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="p-2 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next card"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Center - Card title */}
        <div className="text-center">
          <h2 className="text-white text-lg font-semibold">{card.title}</h2>
          {showStats && card.rarity && (
            <p className="text-white/60 text-sm uppercase tracking-wide">{card.rarity}</p>
          )}
        </div>

        {/* Right side - Close button */}
        <button
          onClick={onClose}
          className="p-2 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 text-white transition-colors"
          title="Close viewer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
