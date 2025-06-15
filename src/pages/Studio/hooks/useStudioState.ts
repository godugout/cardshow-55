
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import { mockCards } from '../mockData';

export const useStudioState = () => {
  const { cardId } = useParams<{ cardId?: string }>();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load card data based on URL params - always load default card for /studio (no cardId)
  useEffect(() => {
    const loadCard = async () => {
      setIsLoading(true);
      if (cardId) {
        // Find the specific card
        const card = mockCards.find(c => c.id === cardId);
        if (card) {
          setSelectedCard(card);
          const index = mockCards.findIndex(c => c.id === cardId);
          setCurrentCardIndex(index);
        } else {
          toast.error('Card not found');
          // If invalid cardId, fallback to default
          setSelectedCard(mockCards[0]);
          setCurrentCardIndex(0);
          navigate('/studio', { replace: true });
          return;
        }
      } else {
        // Always load default card (first card in array) if no ID specified
        setSelectedCard(mockCards[0]);
        setCurrentCardIndex(0);
        // If the user is not already at /studio/default-card, update route
        if (window.location.pathname !== '/studio/default-card') {
          navigate('/studio/default-card', { replace: true });
        }
      }
      setIsLoading(false);
    };

    loadCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, navigate]);

  // Handle card navigation
  const handleCardChange = (index: number) => {
    const newCard = mockCards[index];
    if (newCard) {
      setSelectedCard(newCard);
      setCurrentCardIndex(index);
      
      // Update URL without preset if we're changing cards
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
    mockCards,
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  };
};

