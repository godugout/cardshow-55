
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CreationModeSelector } from './components/CreationModeSelector';
import { EnhancedWizard } from './components/EnhancedWizard';
import { BulkCreationFlow } from './components/BulkCreationFlow';
import { SimpleEditor } from '@/components/editor/SimpleEditor';
import type { CardData } from '@/hooks/useCardEditor';

type CreationMode = 'select' | 'quick' | 'advanced' | 'bulk' | 'editing';

interface UnifiedCardCreatorProps {
  initialCardId?: string;
  initialMode?: CreationMode;
}

export const UnifiedCardCreator = ({ 
  initialCardId, 
  initialMode = 'quick' // Changed from 'select' to 'quick'
}: UnifiedCardCreatorProps) => {
  const [mode, setMode] = useState<CreationMode>(
    initialCardId ? 'editing' : initialMode
  );
  const [cardData, setCardData] = useState<CardData | null>(null);

  const handleModeSelect = (selectedMode: CreationMode) => {
    setMode(selectedMode);
  };

  const handleWizardComplete = (data: CardData) => {
    setCardData(data);
    setMode('editing');
  };

  const handleStartOver = () => {
    setMode('select'); // Allow users to go back to mode selection if needed
    setCardData(null);
  };

  const handleGoToModeSelection = () => {
    setMode('select');
  };

  const renderContent = () => {
    switch (mode) {
      case 'select':
        return (
          <div className="min-h-screen bg-crd-darkest">
            <div className="bg-crd-darkest border-b border-crd-mediumGray/20 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Create Your Card</h1>
                <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
                  Choose how you'd like to create your card. We'll guide you through the process with AI assistance.
                </p>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <CreationModeSelector onModeSelect={handleModeSelect} />
            </div>
          </div>
        );

      case 'quick':
      case 'advanced':
        return (
          <div className="min-h-screen bg-crd-darkest">
            <div className="bg-crd-darkest border-b border-crd-mediumGray/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoToModeSelection}
                  className="text-crd-lightGray hover:text-white hover:bg-editor-border"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change Mode
                </Button>
                
                {/* Mode indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-crd-lightGray text-sm">Mode:</span>
                  <span className="text-crd-green font-medium text-sm capitalize">{mode}</span>
                </div>
              </div>
            </div>
            
            <EnhancedWizard
              mode={mode}
              onComplete={handleWizardComplete}
              onBack={handleGoToModeSelection}
            />
          </div>
        );

      case 'bulk':
        return (
          <div className="min-h-screen bg-crd-darkest">
            <div className="bg-crd-darkest border-b border-crd-mediumGray/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoToModeSelection}
                  className="text-crd-lightGray hover:text-white hover:bg-editor-border mr-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change Mode
                </Button>
                <h1 className="text-xl font-semibold text-white">Bulk Card Creation</h1>
              </div>
            </div>
            
            <BulkCreationFlow onBack={handleGoToModeSelection} />
          </div>
        );

      case 'editing':
        return cardData ? (
          <SimpleEditor 
            initialData={cardData} 
            onStartOver={handleStartOver} 
          />
        ) : null;

      default:
        return null;
    }
  };

  return renderContent();
};
