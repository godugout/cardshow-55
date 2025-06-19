
import React from 'react';
import { UnifiedCardWizard } from '@/components/editor/wizard/UnifiedCardWizard';
import type { CardData } from '@/hooks/useCardEditor';
import type { WizardMode } from '@/components/editor/wizard/UnifiedCardWizard';

interface EnhancedWizardProps {
  mode: 'quick' | 'advanced';
  onComplete: (cardData: CardData) => void;
  onBack: () => void;
}

export const EnhancedWizard = ({ mode, onComplete, onBack }: EnhancedWizardProps) => {
  return (
    <UnifiedCardWizard
      mode={mode as WizardMode}
      onComplete={onComplete}
      onCancel={onBack}
    />
  );
};
