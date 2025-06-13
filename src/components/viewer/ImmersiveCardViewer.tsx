
import React from 'react';
import { ViewerContainer } from './components/ViewerContainer';
import type { CardData } from '@/hooks/useCardEditor';

// Update the interface to support card navigation
interface ExtendedImmersiveCardViewerProps {
  card: CardData;
  cards?: any[];
  currentCardIndex?: number;
  onCardChange?: (index: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (card: CardData) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export const ImmersiveCardViewer: React.FC<ExtendedImmersiveCardViewerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen = true,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = true,
  ambient = true
}) => {
  return (
    <ViewerContainer
      card={card}
      cards={cards}
      currentCardIndex={currentCardIndex}
      onCardChange={onCardChange}
      isOpen={isOpen}
      onClose={onClose}
      onShare={onShare}
      onDownload={onDownload}
      allowRotation={allowRotation}
      showStats={showStats}
      ambient={ambient}
    />
  );
};

export default ImmersiveCardViewer;
