
import React, { useState, useCallback, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { Card } from '@/types/card';
import { CardPreview } from '../mobile/CardPreview';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface CardGridProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  onFavorite?: (card: Card) => void;
  onShare?: (card: Card) => void;
  selectedCards?: string[];
  onSelectionChange?: (selectedCards: string[]) => void;
  layout?: 'grid' | 'masonry';
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardClick,
  onFavorite,
  onShare,
  selectedCards = [],
  onSelectionChange,
  layout = 'grid',
  className = ''
}) => {
  const { windowSize } = useResponsiveLayout();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Calculate grid dimensions
  const getGridDimensions = useCallback(() => {
    const containerWidth = windowSize.width - 64; // Account for padding
    const cardWidth = 280;
    const cardHeight = 420;
    const gap = 24;
    
    const columnsCount = Math.floor((containerWidth + gap) / (cardWidth + gap));
    const actualCardWidth = (containerWidth - (gap * (columnsCount - 1))) / columnsCount;
    
    return {
      columnCount: Math.max(1, columnsCount),
      rowCount: Math.ceil(cards.length / columnsCount),
      cardWidth: actualCardWidth,
      cardHeight,
      gap
    };
  }, [windowSize.width, cards.length]);

  const { columnCount, rowCount, cardWidth, cardHeight } = getGridDimensions();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;

      const currentIndex = hoveredCard ? cards.findIndex(c => c.id === hoveredCard) : -1;
      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = Math.min(currentIndex + 1, cards.length - 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = Math.min(currentIndex + columnCount, cards.length - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = Math.max(currentIndex - columnCount, 0);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (hoveredCard) {
            const card = cards.find(c => c.id === hoveredCard);
            if (card) onCardClick?.(card);
          }
          break;
        case 'Escape':
          setHoveredCard(null);
          break;
      }

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
        setHoveredCard(cards[newIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards, hoveredCard, columnCount, onCardClick]);

  // Multi-select handling
  const handleCardClick = useCallback((card: Card, event: React.MouseEvent) => {
    if (onSelectionChange && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      const isSelected = selectedCards.includes(card.id);
      if (isSelected) {
        onSelectionChange(selectedCards.filter(id => id !== card.id));
      } else {
        onSelectionChange([...selectedCards, card.id]);
      }
    } else {
      onCardClick?.(card);
    }
  }, [selectedCards, onSelectionChange, onCardClick]);

  // Grid cell renderer
  const GridCell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    const card = cards[index];

    if (!card) return null;

    const isSelected = selectedCards.includes(card.id);
    const isHovered = hoveredCard === card.id;

    return (
      <div
        style={{
          ...style,
          padding: '12px',
          width: cardWidth,
          height: cardHeight
        }}
        onMouseEnter={() => setHoveredCard(card.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div
          className={`
            relative transition-all duration-200 h-full
            ${isHovered ? 'transform scale-105 z-10' : ''}
            ${isSelected ? 'ring-2 ring-crd-green ring-offset-2 ring-offset-crd-darkest' : ''}
          `}
          onClick={(e) => handleCardClick(card, e)}
        >
          <CardPreview
            card={card}
            onFavorite={onFavorite}
            onShare={onShare}
            className="h-full"
          />
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-2 left-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (layout === 'masonry') {
    // Simple masonry layout for now
    return (
      <div className={`columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 ${className}`}>
        {cards.map((card) => (
          <div key={card.id} className="break-inside-avoid mb-6">
            <CardPreview
              card={card}
              onCardClick={onCardClick}
              onFavorite={onFavorite}
              onShare={onShare}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} tabIndex={0}>
      <Grid
        columnCount={columnCount}
        columnWidth={cardWidth}
        height={Math.min(windowSize.height - 200, rowCount * cardHeight)}
        rowCount={rowCount}
        rowHeight={cardHeight}
        width={windowSize.width - 64}
        overscanRowCount={2}
        overscanColumnCount={2}
      >
        {GridCell}
      </Grid>
    </div>
  );
};
