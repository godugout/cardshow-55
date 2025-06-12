
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { StandardCardItem } from './StandardCardItem';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { useCardConversion } from '@/pages/Gallery/hooks/useCardConversion';
import type { Tables } from '@/integrations/supabase/types';

type DbCard = Tables<'cards'>;

interface CardGridProps {
  cards: DbCard[];
  loading: boolean;
  viewMode: 'grid' | 'masonry' | 'feed';
}

const LoadingSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-[3/4] rounded-t-lg bg-crd-mediumGray" />
    <div className="space-y-2 p-4">
      <Skeleton className="h-4 bg-crd-mediumGray rounded" />
      <Skeleton className="h-3 bg-crd-mediumGray rounded w-2/3" />
      <div className="flex justify-between mt-3">
        <Skeleton className="h-3 bg-crd-mediumGray rounded w-16" />
        <Skeleton className="h-3 bg-crd-mediumGray rounded w-20" />
      </div>
    </div>
  </div>
);

export const CardGrid: React.FC<CardGridProps> = ({ cards, loading, viewMode }) => {
  const [showViewer, setShowViewer] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DbCard | null>(null);
  const { convertCardsToCardData } = useCardConversion();

  const handleView3D = (card: DbCard) => {
    setSelectedCard(card);
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setSelectedCard(null);
  };

  const handleShare = () => {
    if (selectedCard && navigator.share) {
      navigator.share({
        title: selectedCard.title,
        text: selectedCard.description || 'Check out this card!',
        url: `${window.location.origin}/card/${selectedCard.id}`
      });
    }
  };

  const handleDownload = () => {
    console.log('Download card:', selectedCard?.id);
  };

  if (loading) {
    return (
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          : viewMode === 'masonry'
          ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6'
          : 'space-y-6'
      }>
        {Array(8).fill(0).map((_, i) => (
          <LoadingSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-crd-lightGray mb-4">No cards found</p>
      </div>
    );
  }

  const convertedCards = convertCardsToCardData(cards);
  const currentCardIndex = selectedCard ? cards.findIndex(c => c.id === selectedCard.id) : 0;
  const convertedSelectedCard = selectedCard ? convertCardsToCardData([selectedCard])[0] : null;

  return (
    <>
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          : viewMode === 'masonry'
          ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6'
          : 'space-y-6'
      }>
        {cards.map((card, index) => (
          <StandardCardItem
            key={`card-${card.id}-${index}`}
            card={card}
            onView3D={handleView3D}
            showPrivacyBadge={true}
          />
        ))}
      </div>

      {/* 3D Viewer Modal */}
      {showViewer && convertedSelectedCard && (
        <ImmersiveCardViewer
          card={convertedSelectedCard}
          cards={convertedCards}
          currentCardIndex={currentCardIndex}
          onCardChange={(index) => {
            setSelectedCard(cards[index]);
          }}
          isOpen={showViewer}
          onClose={handleCloseViewer}
          onShare={handleShare}
          onDownload={handleDownload}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </>
  );
};
