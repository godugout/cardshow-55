
import React from 'react';
import { WizardContainer } from './WizardContainer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import type { CardData } from '@/hooks/useCardEditor';

interface ProfessionalWizardProps {
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const ProfessionalWizard: React.FC<ProfessionalWizardProps> = ({
  onComplete,
  onCancel
}) => {
  console.log('ProfessionalWizard loaded');

  const handleComplete = (cardData: any) => {
    console.log('Card creation completed:', cardData);
    if (onComplete) {
      onComplete(cardData as CardData);
    }
  };

  const handleCancel = () => {
    console.log('Card creation cancelled');
    // Clear saved state on cancel
    localStorage.removeItem('cardshow-wizard-state');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <ErrorBoundary>
      <WizardContainer 
        onComplete={handleComplete} 
        onCancel={handleCancel} 
      />
    </ErrorBoundary>
  );
};
