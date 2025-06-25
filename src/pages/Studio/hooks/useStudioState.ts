
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
  const [dataSource, setDataSource] = useState<'database' | 'mock' | 'none'>('none');

  // Use ALL cards instead of just featured cards for Studio
  const { cards, loading: cardsLoading, error: cardsError } = useCards();
  const { convertCardsToCardData } = useCardConversion();

  // Load card data based on URL params and available data
  useEffect(() => {
    if (cardsLoading) {
      setIsLoading(true);
      return;
    }

    console.log('🏗️ Studio: Processing card data...');
    console.log('📊 Raw cards from database:', cards?.length || 0);
    console.log('⚠️ Cards loading error:', cardsError);

    // Convert database cards to CardData format - handle type safety
    let dbCards: CardData[] = [];
    if (cards && cards.length > 0) {
      try {
        // Cast cards to any to bypass type checking since we know the conversion handles missing fields
        dbCards = convertCardsToCardData(cards as any);
        console.log('🔄 Converted database cards:', dbCards.length);
        
        // Log first card for debugging
        if (dbCards.length > 0) {
          console.log('🃏 First converted card:', {
            id: dbCards[0].id,
            title: dbCards[0].title,
            image_url: dbCards[0].image_url,
            creator_id: dbCards[0].creator_id
          });
        }
      } catch (error) {
        console.error('❌ Failed to convert cards:', error);
        dbCards = [];
      }
    }

    // Determine which card set to use (prioritize database cards)
    let availableCards: CardData[] = [];
    let source: 'database' | 'mock' = 'mock';

    if (dbCards.length > 0) {
      availableCards = dbCards;
      source = 'database';
      console.log('✅ Using database cards as primary source');
    } else {
      availableCards = fallbackMockCards;
      source = 'mock';
      console.log('⚠️ Falling back to mock cards');
      
      // Show helpful message if we have database connection issues
      if (cardsError) {
        toast.error('Database connection issue. Using sample cards.');
      } else if (cards && cards.length === 0) {
        toast.info('No cards found in database. Using sample cards.');
      }
    }

    setAllCards(availableCards);
    setDataSource(source);

    let cardToSelect: CardData | undefined;
    let cardIndex = -1;

    if (cardId) {
      // First, try to find the card in available cards
      cardIndex = availableCards.findIndex(c => c.id === cardId);
      
      if (cardIndex !== -1) {
        cardToSelect = availableCards[cardIndex];
        console.log(`🎯 Found requested card: ${cardToSelect.title} at index ${cardIndex} (${source})`);
      } else {
        // Card not found - show helpful error message
        console.warn(`❌ Card with ID "${cardId}" not found in ${source} cards`);
        console.log('🔍 Available card IDs:', availableCards.map(c => `${c.title}:${c.id}`).slice(0, 5));
        
        // Default to first available card
        cardToSelect = availableCards[0];
        cardIndex = 0;
        
        if (cardToSelect) {
          console.log(`🔄 Redirecting to first available card: ${cardToSelect.id}`);
          navigate(`/studio/${cardToSelect.id}`, { replace: true });
          toast.info(`Card not found in ${source} data. Showing ${cardToSelect.title} instead.`);
        }
      }
    } else {
      // No card ID specified - default to first card
      cardToSelect = availableCards[0];
      cardIndex = 0;
      
      if (cardToSelect) {
        console.log(`📍 No card ID specified, redirecting to: ${cardToSelect.id}`);
        navigate(`/studio/${cardToSelect.id}`, { replace: true });
      }
    }

    if (cardToSelect) {
      setSelectedCard(cardToSelect);
      setCurrentCardIndex(cardIndex >= 0 ? cardIndex : 0);
      console.log(`🎮 Selected card: ${cardToSelect.title} (${cardToSelect.id}) from ${source}`);
    } else {
      // This case happens if no cards are available at all
      console.error('💥 No cards are available to display');
      toast.error('No cards are available to display. Please create or upload some cards first.');
      setDataSource('none');
      // Don't redirect to gallery, show the empty state in Studio
    }
    
    setIsLoading(false);
  }, [cardId, navigate, cards, cardsLoading, cardsError, convertCardsToCardData]);

  // Handle card navigation
  const handleCardChange = (index: number) => {
    const newCard = allCards[index];
    if (newCard) {
      console.log(`🔄 Changing to card: ${newCard.title} (${newCard.id})`);
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
        .then(() => {
          toast.success(`Studio link copied to clipboard!`);
          console.log(`📋 Shared card: ${card.title}`);
        })
        .catch(() => toast.error('Failed to copy link'));
    } else {
      toast.error('Sharing not supported in this browser');
    }
  };

  // Handle download/export
  const handleDownload = () => {
    if (selectedCard) {
      toast.success(`Exporting ${selectedCard.title}...`);
      console.log(`💾 Exporting card: ${selectedCard.title} from ${dataSource}`);
    }
  };

  // Handle closing studio - navigate to gallery
  const handleClose = () => {
    console.log('🚪 Closing studio, navigating to gallery');
    navigate('/gallery');
  };

  return {
    selectedCard,
    currentCardIndex,
    isLoading,
    mockCards: allCards, // Pass the correct list of cards (database or mock)
    dataSource, // New: expose data source for debugging
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  };
};
