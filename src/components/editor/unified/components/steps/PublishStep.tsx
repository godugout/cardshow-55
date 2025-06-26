
import React from 'react';
import { PublishingOptionsStep } from '@/components/editor/wizard/PublishingOptionsStep';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface PublishStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const PublishStep = ({ mode, cardData, onFieldUpdate }: PublishStepProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Publish Your Card</h2>
        <p className="text-crd-lightGray">
          Choose how you want to share and distribute your card
        </p>
      </div>

      <div className="bg-crd-darker rounded-xl border border-crd-mediumGray/20 p-8">
        <PublishingOptionsStep
          publishingOptions={cardData.publishing_options}
          selectedTemplate={null}
          onPublishingUpdate={(key, value) => {
            onFieldUpdate('publishing_options', {
              ...cardData.publishing_options,
              [key]: value
            });
          }}
        />
      </div>
    </div>
  );
};
