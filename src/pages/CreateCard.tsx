
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useCardEditor } from '@/hooks/useCardEditor';
import { PhotoUploadSection } from '@/components/editor/unified/sections/PhotoUploadSection';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowLeft } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cardEditor = useCardEditor();

  // Handle URL parameters for workflow activation
  useEffect(() => {
    const source = searchParams.get('source');
    const workflow = searchParams.get('workflow');
    
    if (source === 'crdmkr' && workflow === 'psd-professional') {
      console.log('🎯 Auto-activating PSD Professional workflow from URL parameters');
      // Set workflow metadata
      cardEditor.updateDesignMetadata('workflowSource', 'crdmkr');
      cardEditor.updateDesignMetadata('workflowType', 'psd-professional');
    }
  }, [searchParams, cardEditor]);

  console.log('CreateCard page loaded - enhanced PSD workflow ready');

  const handleComplete = (cardData: CardData) => {
    console.log('Card created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('Card creation cancelled');
    navigate('/');
  };

  const handleNext = () => {
    console.log('Moving to next step - effects and finalization');
    // Navigate to next step or continue workflow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkGray">
      <ErrorBoundary>
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-crd-darker via-crd-darkGray to-crd-darker border-b border-crd-green/20 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-crd-green to-crd-blue bg-clip-text text-transparent">
                Professional Card Creator
              </h1>
              <div className="hidden md:block h-8 w-px bg-crd-mediumGray/30"></div>
              <div className="hidden md:flex items-center gap-2 text-crd-lightGray">
                <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Advanced PSD Workflow</span>
              </div>
            </div>

            <CRDButton
              variant="outline"
              onClick={handleCancel}
              className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white hover:border-crd-green/50 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </CRDButton>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PhotoUploadSection
            cardEditor={cardEditor}
            onNext={handleNext}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default CreateCard;
