
import React from 'react';
import { CardsPage } from '@/components/cards/CardsPage';

interface BulkCreationFlowProps {
  onBack: () => void;
}

export const BulkCreationFlow = ({ onBack }: BulkCreationFlowProps) => {
  return <CardsPage />;
};
