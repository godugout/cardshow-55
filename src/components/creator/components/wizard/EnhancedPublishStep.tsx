
import React from 'react';
import { Rocket, Shield } from 'lucide-react';
import { PublishingOptionsStep } from '@/components/editor/wizard/PublishingOptionsStep';
import type { CardData, DesignTemplate } from '@/hooks/useCardEditor';

interface EnhancedPublishStepProps {
  mode: 'quick' | 'advanced';
  publishingOptions: CardData['publishing_options'];
  selectedTemplate: DesignTemplate | null;
  onPublishingUpdate: (updates: Partial<CardData['publishing_options']>) => void;
}

export const EnhancedPublishStep = ({
  mode,
  publishingOptions,
  selectedTemplate,
  onPublishingUpdate
}: EnhancedPublishStepProps) => {
  return (
    <div className="space-y-6">
      {/* Mode-specific header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {mode === 'quick' ? 'Publish Your Card' : 'Publishing & Distribution'}
        </h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Choose how you want to share your new card'
            : 'Configure advanced publishing and distribution options'
          }
        </p>
      </div>

      {/* Quick Mode Simplified Options */}
      {mode === 'quick' && (
        <div className="bg-gradient-to-r from-crd-green/20 to-crd-blue/20 rounded-lg p-4 border border-crd-green/30">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-5 h-5 text-crd-green" />
            <span className="text-white font-medium">Almost Ready!</span>
          </div>
          <p className="text-sm text-crd-lightGray">
            Your card is ready to be created. You can always change these settings later.
          </p>
        </div>
      )}

      {/* Publishing Options Form */}
      <PublishingOptionsStep
        publishingOptions={publishingOptions}
        selectedTemplate={selectedTemplate}
        onPublishingUpdate={onPublishingUpdate}
      />

      {/* Privacy Notice */}
      <div className="text-center p-4 bg-crd-mediumGray/20 rounded-lg border border-crd-mediumGray/30">
        <div className="flex items-center justify-center gap-2 text-crd-lightGray mb-2">
          <Shield className="w-4 h-4" />
          <span className="font-medium">Privacy Protected</span>
        </div>
        <p className="text-sm text-crd-lightGray">
          Your card data is secure and only shared according to your preferences
        </p>
      </div>
    </div>
  );
};
