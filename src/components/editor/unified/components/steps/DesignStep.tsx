
import React from 'react';
import { EffectsTab } from '@/components/editor/sidebar/EffectsTab';
import { TemplateSelectionStep } from '@/components/editor/wizard/TemplateSelectionStep';
import { DEFAULT_TEMPLATES } from '@/components/editor/wizard/wizardConfig';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface DesignStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const DesignStep = ({ mode, cardData, onFieldUpdate }: DesignStepProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Design Your Card</h2>
        <p className="text-crd-lightGray">
          Choose a template and apply visual effects to make your card unique
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template Selection */}
        <div className="bg-crd-darker rounded-xl border border-crd-mediumGray/20 p-8">
          <h3 className="text-xl font-semibold text-crd-white mb-4">Choose Template</h3>
          <TemplateSelectionStep
            templates={DEFAULT_TEMPLATES}
            selectedTemplate={null}
            onTemplateSelect={(template) => {
              onFieldUpdate('template_id', template.id);
              onFieldUpdate('design_metadata', template.template_data);
            }}
          />
        </div>

        {/* Effects */}
        <div className="bg-crd-darker rounded-xl border border-crd-mediumGray/20 p-8">
          <h3 className="text-xl font-semibold text-crd-white mb-4">Visual Effects</h3>
          <EffectsTab />
        </div>
      </div>
    </div>
  );
};
