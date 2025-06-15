
import { useParams, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { mockCards } from '../mockData';

// Returns [selectedCard, index]
export function useResolveStudioCard() {
  const { cardId } = useParams<{ cardId?: string }>();
  const navigate = useNavigate();

  // Returns selectedCard and its index
  const resolve = useCallback(() => {
    if (cardId) {
      const idx = mockCards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        return [mockCards[idx], idx] as const;
      } else {
        toast.error('Card not found, showing default card');
        // Redirect to default
        navigate('/studio/default-card', { replace: true });
        return [mockCards[0], 0] as const;
      }
    }
    // No cardId case: always land on /studio/default-card, never show blank
    if (window.location.pathname !== '/studio/default-card') {
      navigate('/studio/default-card', { replace: true });
    }
    return [mockCards[0], 0] as const;
  }, [cardId, navigate]);

  return resolve;
}
