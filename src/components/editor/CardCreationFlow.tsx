
import React from 'react';
import { ModernCardCreationFlow } from './ModernCardCreationFlow';

interface CardCreationFlowProps {
  initialCardId?: string;
}

export const CardCreationFlow = ({ initialCardId }: CardCreationFlowProps) => {
  return <ModernCardCreationFlow initialCardId={initialCardId} />;
};
