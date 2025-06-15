
import { useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { mockCards } from '../mockData';

// Returns [selectedCard, index]
export function useResolveStudioCard() {
  const { cardId } = useParams<{ cardId?: string }>();

  // Returns selectedCard and its index without navigation side-effects
  const resolve = useCallback(() => {
    if (cardId) {
      const idx = mockCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        return [mockCards[idx], idx] as const;
      } else {
        toast.error('Card not found, showing default card');
        // Fallback to default card but do not navigate
        return [mockCards[0], 0] as const;
      }
    }
    // No cardId case: just return the default card.
    return [mockCards[0], 0] as const;
  }, [cardId]);

  return resolve;
}
