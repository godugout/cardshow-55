
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CardRepository } from '@/repositories/cardRepository';
import { migrateMockDataToDatabase, checkMigrationStatus } from '@/services/migrations/mockDataMigration';
import { convertCardToCardData } from '@/utils/cardAdapter';
import type { CardData } from '@/hooks/useCardEditor';

export const useStudioState = () => {
  const { cardId } = useParams<{ cardId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<CardData[]>([]);

  // Load cards from database and handle migration if needed
  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      
      try {
        // Check if migration is needed and user is available
        if (user) {
          const isMigrated = await checkMigrationStatus();
          
          if (!isMigrated) {
            console.log('🔄 Running mock data migration...');
            toast.info('Setting up your card collection...');
            
            const migrationResult = await migrateMockDataToDatabase(user.id);
            
            if (migrationResult.success) {
              toast.success(`Successfully migrated ${migrationResult.migratedCount} cards to your collection!`);
            } else {
              toast.error('Migration had some issues, but continuing...');
              console.error('Migration errors:', migrationResult.errors);
            }
          }
        }
        
        // Fetch cards from database
        const dbCards = await CardRepository.getStudioCards(20);
        const convertedCards = dbCards.map(convertCardToCardData);
        setCards(convertedCards);
        
        if (cardId) {
          // Find the specific card
          const card = convertedCards.find(c => c.id === cardId);
          if (card) {
            setSelectedCard(card);
            const index = convertedCards.findIndex(c => c.id === cardId);
            setCurrentCardIndex(index);
          } else {
            toast.error('Card not found');
            navigate('/studio');
            return;
          }
        } else {
          // Default to first card if no ID specified
          if (convertedCards.length > 0) {
            setSelectedCard(convertedCards[0]);
            setCurrentCardIndex(0);
          }
        }
        
      } catch (error) {
        console.error('Error loading cards:', error);
        toast.error('Failed to load cards');
        // Fallback to empty state
        setCards([]);
        setSelectedCard(null);
      }
      
      setIsLoading(false);
    };

    loadCards();
  }, [cardId, navigate, user]);

  // Handle card navigation
  const handleCardChange = (index: number) => {
    const newCard = cards[index];
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
    mockCards: cards, // Keep same property name for compatibility
    handleCardChange,
    handleShare,
    handleDownload,
    handleClose
  };
};
