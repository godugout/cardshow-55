
import React, { useState } from 'react';
import { ArrowLeft, Upload, Sparkles, Check } from 'lucide-react';
import { CardCreationButton } from '@/components/ui/card-creation-button';
import { ModernCardWizard } from './ModernCardWizard';
import { SimpleEditor } from './SimpleEditor';
import { CardsPage } from '@/components/cards/CardsPage';
import type { CardData } from '@/hooks/useCardEditor';

type FlowType = 'select' | 'single' | 'bulk' | 'editing';

interface ModernCardCreationFlowProps {
  initialCardId?: string;
}

export const ModernCardCreationFlow = ({ initialCardId }: ModernCardCreationFlowProps) => {
  const [flowType, setFlowType] = useState<FlowType>(initialCardId ? 'editing' : 'select');
  const [wizardComplete, setWizardComplete] = useState(!!initialCardId);
  const [cardData, setCardData] = useState<CardData | null>(null);

  const handleWizardComplete = (data: CardData) => {
    setCardData(data);
    setWizardComplete(true);
    setFlowType('editing');
  };

  const handleStartOver = () => {
    setFlowType('select');
    setWizardComplete(false);
    setCardData(null);
  };

  // If we have an initial card ID, go directly to editing
  if (initialCardId && flowType === 'editing') {
    return <SimpleEditor initialData={cardData} onStartOver={handleStartOver} />;
  }

  // Bulk upload flow
  if (flowType === 'bulk') {
    return (
      <div className="min-h-screen bg-crd-darkest">
        <div className="border-b border-editor-border bg-editor-dark">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-16">
            <div className="flex items-center space-x-4">
              <CardCreationButton
                variant="card-ghost"
                size="sm"
                onClick={() => setFlowType('select')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </CardCreationButton>
              <h1 className="text-xl font-semibold text-white">Bulk Upload</h1>
            </div>
          </div>
        </div>
        <CardsPage />
      </div>
    );
  }

  // Single card creation flow (after selection)
  if (flowType === 'single' && !wizardComplete) {
    return <ModernCardWizard onComplete={handleWizardComplete} onBack={() => setFlowType('select')} />;
  }

  // Card editing after wizard completion
  if (wizardComplete && cardData) {
    return <SimpleEditor initialData={cardData} onStartOver={handleStartOver} />;
  }

  // Initial flow selection screen
  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Create Your Card</h1>
          <p className="text-crd-lightGray text-lg">Choose how you'd like to get started</p>
        </div>

        {/* Creation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Single Card Creation */}
          <div className="bg-editor-dark rounded-2xl p-8 border border-crd-mediumGray/30 hover:border-crd-green/50 transition-all group">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-crd-green/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-crd-green/30 transition-colors">
                <Sparkles className="w-8 h-8 text-crd-green" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Create Single Card</h3>
                <p className="text-crd-lightGray text-sm">Upload an image and create a custom card</p>
              </div>
              <CardCreationButton
                variant="card-primary"
                size="lg"
                onClick={() => setFlowType('single')}
                className="w-full"
                icon={<Sparkles className="w-5 h-5" />}
              >
                Start Creating
              </CardCreationButton>
            </div>
          </div>

          {/* Bulk Upload */}
          <div className="bg-editor-dark rounded-2xl p-8 border border-crd-mediumGray/30 hover:border-crd-blue/50 transition-all group">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-crd-blue/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-crd-blue/30 transition-colors">
                <Upload className="w-8 h-8 text-crd-blue" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Bulk Upload</h3>
                <p className="text-crd-lightGray text-sm">Upload multiple images and detect cards</p>
              </div>
              <CardCreationButton
                variant="card-secondary"
                size="lg"
                onClick={() => setFlowType('bulk')}
                className="w-full"
                icon={<Upload className="w-5 h-5" />}
              >
                Upload Multiple
              </CardCreationButton>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-crd-lightGray text-sm">
            Not sure which option to choose? Start with single card creation.
          </p>
        </div>
      </div>
    </div>
  );
};
