
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import { mockCards as fallbackMockCards } from '../mockData';
import { useCards } from '@/hooks/useCards';
import { useCardConversion } from '@/pages/Gallery/hooks/useCardConversion';

export const useStudioState = () => {
  const { cardId } = useParams<{ cardId?: string }>();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { featuredCards, loading: cardsLoading } = useCards();
  const { convertCardsToCardData } = useCardConversion();

  // Load card data based on URL params and available data
  useEffect(() => {
    if (cardsLoading) {
      setIsLoading(true);
      return;
    }

    const dbCards = convertCardsToCardData(featuredCards || []);
    const availableCards = dbCards.length > 0 ? dbCards : fallbackMockCards;
    setAllCards(availableCards);

    let cardToSelect: CardData | undefined;
    let cardIndex = -1;

    if (cardId) {
      // Check for invalid card IDs that should redirect
      if (cardId.startsWith('fallback-') || cardId === 'undefined' || cardId === 'null') {
        console.warn(`Invalid card ID detected: ${cardId}, redirecting to first available card`);
        cardToSelect = availableCards[0];
        cardIndex = 0;
        
        // Redirect to valid card ID
        if (cardToSelect) {
          navigate(`/studio/${cardToSelect.id}`, { replace: true });
          toast.info('Redirected to available card');
        }
      } else {
        // Find the specific card from all available cards
        cardIndex = availableCards.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
          cardToSelect = availableCards[cardIndex];
        } else {
          console.warn(`Card with ID ${cardId} not found`);
          toast.error('Card not found. Showing default card instead.');
          cardToSelect = availableCards[0];
          cardIndex = 0;
          
          // Redirect to valid card ID
          if (cardToSelect) {
            navigate(`/studio/${cardToSelect.id}`, { replace: true });
          }
        }
      }
    } else {
      // Default to first card if no ID specified
      cardToSelect = availableCards[0];
      cardIndex = 0;
      
      // Update URL to include card ID
      if (cardToSelect) {
        navigate(`/studio/${cardToSelect.id}`, { replace: true });
      }
    }

    if (cardToSelect) {
      setSelectedCard(cardToSelect);
      setCurrentCardIndex(cardIndex >= 0 ? cardIndex : 0);
    } else {
      // This case happens if both DB and mock cards are empty
      toast.error('No cards are available to display.');
      navigate('/gallery');
    }
    
    setIsLoading(false);
  }, [cardId, navigate, featuredCards, cardsLoading, convertCardsToCardData]);

  // Handle card navigation
  const handleCardChange = (index: number) => {
    const newCard = allCards[index];
    if (newCard) {
      setSelectedCard(newCard);
      setCurrentCardIndex(index);
      
      // Update URL when changing cards
      navigate(`/studio/${newCard.id}`, { replace: true });
    }
  };

  // Handle sharing - generates shareable URL
  const handleShare = (card: CardData) => {
    const shareUrl = `${window.location.origin}/studio/${card.id}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Studio link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    } else {
      toast.error('Sharing not supported in this browser');
    }
  };

  // Handle download/export
  const handleDownload = () => {
    if (selectedCard) {
      toast.success(`Exporting ${selectedCard.title}...`);
    }
  };

  // Handle closing studio
  const handleClose = () => {
    navigate('/gallery');
  };

  return {
    selectedCard,
    currentCardIndex,
    isLoading,
    mockCards: allCards, // Pass the correct list of cards
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  };
};
