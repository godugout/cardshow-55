
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
  console.log('🎨 ProfessionalWizard: Rendering with web scraping functionality');
  
  return (
    <WizardContainer 
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
};
