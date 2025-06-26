
import React from 'react';
import { UniversalCardCreator } from './unified/UniversalCardCreator';
import type { CardData } from '@/hooks/useCardEditor';

interface CardCreationFlowProps {
  initialCardId?: string;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const CardCreationFlow = ({ 
  initialCardId, 
  onComplete, 
  onCancel 
}: CardCreationFlowProps) => {
  // Determine initial mode based on context
  const initialMode = initialCardId ? 'advanced' : 'quick';

  return (
    <UniversalCardCreator
      initialMode={initialMode}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
};
