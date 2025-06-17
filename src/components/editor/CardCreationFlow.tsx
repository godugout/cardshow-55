
import React from 'react';
import { UnifiedCardCreator } from '@/components/creator/UnifiedCardCreator';

interface CardCreationFlowProps {
  initialCardId?: string;
}

export const CardCreationFlow = ({ initialCardId }: CardCreationFlowProps) => {
  return (
    <UnifiedCardCreator 
      initialCardId={initialCardId}
      initialMode={initialCardId ? 'editing' : 'select'}
    />
  );
};
