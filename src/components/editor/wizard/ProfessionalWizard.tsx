
import React from 'react';
import { WizardContainer } from './WizardContainer';
import type { CardData } from '@/hooks/useCardEditor';

interface ProfessionalWizardProps {
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const ProfessionalWizard: React.FC<ProfessionalWizardProps> = ({
  onComplete,
  onCancel
}) => {
  const handleComplete = (cardData: any) => {
    console.log('Card creation completed:', cardData);
    if (onComplete) {
      onComplete(cardData as CardData);
    }
  };

  const handleCancel = () => {
    // Clear saved state on cancel
    localStorage.removeItem('cardshow-wizard-state');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <WizardContainer 
      onComplete={handleComplete} 
      onCancel={handleCancel} 
    />
  );
};
