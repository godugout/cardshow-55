import React, { useState } from 'react';
import { CardDisplay, CardDisplayMode, CardStyle } from './CardDisplay';
import { CardData } from '@/types/card';

interface CardGalleryProps {
  cards: CardData[];
  mode?: CardDisplayMode;
  showStyleVariations?: boolean;
  debug?: boolean;
  className?: string;
}

export const CardGallery: React.FC<CardGalleryProps> = ({
  cards,
  mode = 'front',
  showStyleVariations = false,
  debug = false,
  className = ''
}) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState<CardDisplayMode>(mode);
  const [showAllVariations, setShowAllVariations] = useState(showStyleVariations);
  const [debugMode, setDebugMode] = useState(debug);

  const styles: CardStyle[] = ['standard', 'holographic', 'gold', 'vintage'];
  const modes: CardDisplayMode[] = ['front', 'back', 'both', 'sandwich'];

  const selectedCard = cards[selectedCardIndex] || cards[0];

  const handleCardNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    } else {
      setSelectedCardIndex((prev) => (prev + 1) % cards.length);
    }
    console.log(`🔄 Navigated to card ${selectedCardIndex + 1}/${cards.length}: ${selectedCard?.title}`);
  };

  if (!selectedCard) {
    return (
      <div className="flex items-center justify-center min-h-[500px] text-crd-lightGray">
        No cards available
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Controls */}
      <div className="flex flex-col gap-4 p-6 bg-crd-darkGray rounded-lg">
        {/* Mode Selection */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-crd-lightGray font-medium">Display Mode:</span>
          {modes.map((modeOption) => (
            <button
              key={modeOption}
              onClick={() => setCurrentMode(modeOption)}
              className={`
                px-3 py-1 rounded-md text-sm font-medium transition-all
                ${currentMode === modeOption 
                  ? 'bg-crd-green text-crd-darkest' 
                  : 'bg-crd-mediumGray text-crd-white hover:bg-crd-lightGray hover:text-crd-darkest'
                }
              `}
            >
              {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
            </button>
          ))}
        </div>

        {/* Card Navigation */}
        {cards.length > 1 && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-crd-lightGray font-medium">Card:</span>
            <button
              onClick={() => handleCardNavigation('prev')}
              className="px-3 py-1 bg-crd-mediumGray text-crd-white rounded-md hover:bg-crd-lightGray hover:text-crd-darkest transition-all"
            >
              ← Previous
            </button>
            <span className="text-sm text-crd-white">
              {selectedCardIndex + 1} of {cards.length} - {selectedCard.title}
            </span>
            <button
              onClick={() => handleCardNavigation('next')}
              className="px-3 py-1 bg-crd-mediumGray text-crd-white rounded-md hover:bg-crd-lightGray hover:text-crd-darkest transition-all"
            >
              Next →
            </button>
          </div>
        )}

        {/* Debug Toggle */}
        {process.env.NODE_ENV === 'development' && (
          <label className="flex items-center gap-2 text-sm text-crd-lightGray">
            <input
              type="checkbox"
              checked={debugMode}
              onChange={(e) => setDebugMode(e.target.checked)}
              className="rounded"
            />
            Debug Mode (show borders)
          </label>
        )}
      </div>

      {/* Main Display Area */}
      <div className="flex items-center justify-center min-h-[600px] p-8">
        {showAllVariations ? (
          // Show all 4 style variations in a 2x2 grid
          <div className="grid grid-cols-2 gap-8">
            {styles.map((style) => (
              <div key={style} className="text-center">
                <CardDisplay
                  card={selectedCard}
                  mode={currentMode}
                  style={style}
                  debug={debugMode}
                />
                <p className="mt-3 text-sm text-crd-lightGray font-medium capitalize">
                  {style} Style
                </p>
              </div>
            ))}
          </div>
        ) : (
          // Show single card with current style
          <CardDisplay
            card={selectedCard}
            mode={currentMode}
            style="holographic"
            debug={debugMode}
            onFlip={() => console.log(`Card flipped: ${selectedCard.title}`)}
            onEnlarge={() => console.log(`Card enlarged: ${selectedCard.title}`)}
          />
        )}
      </div>

      {/* Style Variations Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowAllVariations(!showAllVariations)}
          className="px-6 py-3 bg-crd-blue text-white rounded-lg hover:bg-crd-blue/80 transition-all font-medium"
        >
          {showAllVariations ? 'Show Single Card' : 'Show All Style Variations'}
        </button>
      </div>

      {/* Keyboard Shortcuts Help */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-4 bg-crd-darkGray rounded-lg text-xs text-crd-lightGray">
          <h4 className="font-medium mb-2">Keyboard Shortcuts:</h4>
          <ul className="space-y-1">
            <li><kbd>Click</kbd> - Flip card front/back</li>
            <li><kbd>Double-click</kbd> - Enlarge/shrink card</li>
            <li><kbd>Escape</kbd> - Reset to normal size (coming soon)</li>
            <li><kbd>←/→</kbd> - Navigate cards (coming soon)</li>
          </ul>
        </div>
      )}
    </div>
  );
};