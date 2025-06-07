
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CardData } from '@/hooks/useCardEditor';

interface UseViewerDataProps {
  cardId?: string;
  collectionId?: string;
  cardIndex: number;
}

export const useViewerData = ({ cardId, collectionId, cardIndex }: UseViewerDataProps) => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(cardIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development - replace with actual data fetching
  const mockCards: CardData[] = [
    {
      id: 'card-1',
      title: 'Lightning Strike Pro',
      description: 'Elite sports card with dynamic lightning effects',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
      thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop',
      rarity: 'rare',
      tags: ['sports', 'basketball', 'action'],
      template_id: 'sports-pro',
      design_metadata: {
        effects: ['holographic', 'lightning'],
        background: 'arena'
      },
      visibility: 'public',
      creator_attribution: {
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: true,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    },
    {
      id: 'card-2',
      title: 'Mystic Dragon',
      description: 'Fantasy card with mystical dragon artwork',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=300&fit=crop',
      rarity: 'legendary',
      tags: ['fantasy', 'dragon', 'mystical'],
      template_id: 'fantasy-elite',
      design_metadata: {
        effects: ['chrome', 'glow'],
        background: 'crystal-cave'
      },
      visibility: 'public',
      creator_attribution: {
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: true,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: true }
      }
    }
  ];

  // Load card data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (cardId) {
          // Find specific card
          const card = mockCards.find(c => c.id === cardId);
          if (card) {
            setSelectedCard(card);
            setCards(mockCards);
            setCurrentCardIndex(mockCards.findIndex(c => c.id === cardId));
          } else {
            setError(`Card with ID "${cardId}" not found`);
          }
        } else if (collectionId) {
          // Load collection
          setCards(mockCards);
          setSelectedCard(mockCards[cardIndex] || mockCards[0]);
          setCurrentCardIndex(cardIndex);
        } else {
          // No specific card, load default
          setCards(mockCards);
          setSelectedCard(mockCards[0]);
          setCurrentCardIndex(0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load card data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [cardId, collectionId, cardIndex]);

  // Handle card navigation
  const handleCardChange = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < cards.length) {
      setCurrentCardIndex(newIndex);
      setSelectedCard(cards[newIndex]);
      
      // Update URL to reflect current card
      const newCardId = cards[newIndex].id;
      navigate(`/viewer/${newCardId}`, { replace: true });
    }
  }, [cards, navigate]);

  // Create new card
  const createNewCard = useCallback((cardData: Partial<CardData>) => {
    const newCard: CardData = {
      id: `card-${Date.now()}`,
      title: cardData.title || 'New Card',
      description: cardData.description || '',
      image_url: cardData.image_url || '',
      thumbnail_url: cardData.thumbnail_url || '',
      rarity: cardData.rarity || 'common',
      tags: cardData.tags || [],
      template_id: cardData.template_id || 'basic',
      design_metadata: cardData.design_metadata || {},
      visibility: 'private',
      creator_attribution: {
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    };

    setSelectedCard(newCard);
    setCards(prev => [newCard, ...prev]);
    setCurrentCardIndex(0);
    
    // Navigate to the new card
    navigate(`/viewer/${newCard.id}?mode=studio`, { replace: true });
  }, [navigate]);

  return {
    selectedCard,
    cards,
    currentCardIndex,
    isLoading,
    error,
    handleCardChange,
    createNewCard
  };
};
