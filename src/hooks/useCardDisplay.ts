
import { useMemo } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import type { Card } from '@/types/card';

interface UseCardDisplayProps {
  allCards: Card[];
  userCards: Card[];
}

export const useCardDisplay = ({ allCards, userCards }: UseCardDisplayProps) => {
  const { user } = useAuth();

  // Filter cards to show user's own cards plus public cards from others
  const displayedCards = useMemo(() => {
    if (!user) {
      // Not authenticated - show only public cards
      return allCards.filter(card => card.is_public);
    }
    
    // Authenticated - show user's cards (regardless of public status) plus others' public cards
    return allCards.filter(card => 
      card.creator_id === user.id || card.is_public
    );
  }, [allCards, user]);

  // Get user's private cards count
  const privateCardsCount = useMemo(() => {
    if (!user) return 0;
    return userCards.filter(card => !card.is_public).length;
  }, [userCards, user]);

  // Get featured cards (mix of popular public cards and user's cards)
  const featuredCards = useMemo(() => {
    const publicCards = allCards.filter(card => card.is_public);
    const myCards = user ? userCards.slice(0, 2) : []; // Include up to 2 user cards
    
    // Mix public and user cards, prioritizing diversity
    const mixed = [...myCards, ...publicCards.slice(0, 6 - myCards.length)];
    return mixed.slice(0, 6);
  }, [allCards, userCards, user]);

  return {
    displayedCards,
    privateCardsCount,
    featuredCards,
    isAuthenticated: !!user
  };
};
