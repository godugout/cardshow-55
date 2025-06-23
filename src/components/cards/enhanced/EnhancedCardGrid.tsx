
import React, { useState, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { Card3DViewer } from '../3d/Card3DViewer';
import { Card3DToggle } from '../shared/Card3DToggle';
import { CardThumbnail } from '../mobile/CardThumbnail';
import { useDeviceCapabilities } from '../3d/hooks/useDeviceCapabilities';
import { Button } from '@/components/ui/button';
import { Grid as GridIcon, Rows3 } from 'lucide-react';
import type { Card } from '@/types/card';

interface EnhancedCardGridProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  className?: string;
  containerHeight?: number;
  containerWidth?: number;
}

export const EnhancedCardGrid: React.FC<EnhancedCardGridProps> = ({
  cards,
  onCardClick,
  className = '',
  containerHeight = 600,
  containerWidth = 800
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | undefined>();
  const [is3DMode, setIs3DMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const capabilities = useDeviceCapabilities();

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    onCardClick?.(card);
  };

  const GridCell = ({ columnIndex, rowIndex, style }: any) => {
    const itemsPerRow = capabilities.isMobile ? 2 : 4;
    const cardIndex = rowIndex * itemsPerRow + columnIndex;
    const card = cards[cardIndex];

    if (!card) return null;

    return (
      <div style={style} className="p-2">
        <CardThumbnail
          card={card}
          size={capabilities.isMobile ? 'sm' : 'md'}
          onClick={handleCardClick}
          showRarity={true}
          showPrice={true}
          className="w-full h-full"
        />
      </div>
    );
  };

  const itemsPerRow = capabilities.isMobile ? 2 : 4;
  const rowCount = Math.ceil(cards.length / itemsPerRow);
  const itemWidth = containerWidth / itemsPerRow;
  const itemHeight = capabilities.isMobile ? 140 : 180;

  // Show 3D view if supported and enabled
  if (is3DMode && capabilities.tier !== 'fallback') {
    return (
      <div className={`w-full h-full ${className}`}>
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">
            Card Collection ({cards.length} cards)
          </h3>
          <div className="flex gap-2">
            <Card3DToggle is3D={is3DMode} onToggle={setIs3DMode} />
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl">
          <Card3DViewer
            cards={cards}
            selectedCard={selectedCard}
            onCardSelect={handleCardClick}
            showControls={true}
            className="w-full h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">
          Card Collection ({cards.length} cards)
        </h3>
        <div className="flex gap-2">
          <Card3DToggle is3D={is3DMode} onToggle={setIs3DMode} />
          
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <GridIcon className="w-4 h-4" />
          </Button>
          
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <Rows3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 2D Grid View */}
      {viewMode === 'grid' ? (
        <div 
          className="bg-crd-darker rounded-xl p-4" 
          style={{ height: containerHeight, width: containerWidth }}
        >
          <Grid
            columnCount={itemsPerRow}
            columnWidth={itemWidth}
            height={containerHeight - 32}
            rowCount={rowCount}
            rowHeight={itemHeight}
            width={containerWidth - 32}
          >
            {GridCell}
          </Grid>
        </div>
      ) : (
        /* List View */
        <div className="bg-crd-darker rounded-xl p-4 space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center gap-4 p-3 bg-crd-mediumGray rounded-lg hover:bg-crd-mediumGray/80 cursor-pointer transition-colors"
              onClick={() => handleCardClick(card)}
            >
              <div className="w-16 h-22 flex-shrink-0">
                <CardThumbnail
                  card={card}
                  size="xs"
                  onClick={() => {}}
                  showRarity={false}
                  className="w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{card.title}</h4>
                {card.description && (
                  <p className="text-crd-lightGray text-sm truncate">{card.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-crd-green capitalize">{card.rarity}</span>
                  {card.price && (
                    <span className="text-xs text-crd-lightGray">${card.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          Device tier: {capabilities.tier} | WebGL: {capabilities.webglVersion > 0 ? 'Supported' : 'Not supported'}
        </div>
      )}
    </div>
  );
};
