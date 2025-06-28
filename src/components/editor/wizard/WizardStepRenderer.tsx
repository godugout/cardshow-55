
import React from 'react';
import { useWizardContext } from './WizardContext';
import { WizardStepContent } from './WizardStepContent';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useWizardTemplates } from './hooks/useWizardTemplates';

export const WizardStepRenderer: React.FC = () => {
  const { wizardState, handlers } = useWizardContext();
  const cardEditor = useCardEditor();
  const { templates } = useWizardTemplates();

  console.log('🔄 WizardStepRenderer: Current step:', wizardState.currentStep);

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <WizardStepContent
          currentStep={wizardState.currentStep}
          wizardState={wizardState}
          cardData={cardEditor.cardData}
          templates={templates}
          handlers={{
            ...handlers,
            onBulkUpload: () => {
              console.log('🔄 Bulk upload requested');
              // Navigate to bulk upload or show bulk upload modal
            }
          }}
          cardEditor={cardEditor}
        />
      </div>
    </div>
  );
};
