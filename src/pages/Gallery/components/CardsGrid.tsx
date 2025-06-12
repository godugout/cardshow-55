
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { StandardCardItem } from '@/components/cards/StandardCardItem';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { useCardConversion } from '../hooks/useCardConversion';
import type { Tables } from '@/integrations/supabase/types';

type DbCard = Tables<'cards'>;

interface CardsGridProps {
  cards: DbCard[];
  loading: boolean;
  onCardClick: (card: DbCard) => void;
}

export const CardsGrid: React.FC<CardsGridProps> = ({
  cards,
  loading,
  onCardClick
}) => {
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
    // TODO: Implement download functionality
    console.log('Download card:', selectedCard?.id);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[3/4] rounded-lg bg-crd-mediumGray" />
            <Skeleton className="h-4 bg-crd-mediumGray rounded" />
            <Skeleton className="h-3 bg-crd-mediumGray rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <p className="text-crd-lightGray col-span-4 text-center py-8">No featured cards found</p>
    );
  }

  const convertedCards = convertCardsToCardData(cards);
  const currentCardIndex = selectedCard ? cards.findIndex(c => c.id === selectedCard.id) : 0;
  const convertedSelectedCard = selectedCard ? convertCardsToCardData([selectedCard])[0] : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.slice(0, 8).map((card) => (
          <StandardCardItem
            key={card.id}
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
