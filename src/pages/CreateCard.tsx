
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useCardEditor } from '@/hooks/useCardEditor';
import { PhotoUploadSection } from '@/components/editor/unified/sections/PhotoUploadSection';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowLeft } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCard = () => {
  const navigate = useNavigate();
  const cardEditor = useCardEditor();

  console.log('CreateCard page loaded - using enhanced photo upload with media path detection');

  const handleComplete = (cardData: CardData) => {
    console.log('Card created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('Card creation cancelled');
    navigate('/');
  };

  const handleNext = () => {
    console.log('Moving to next step - details and design');
    // For now, just log that we're ready to proceed
    // Later we can navigate to the next step in the flow
  };

  // Get current workflow step from PhotoUploadSection
  const getWorkflowTitle = () => {
    // For now, default to "Choose your workflow" since we're in the creation flow
    // This could be made more dynamic by lifting state up if needed
    return 'Choose your workflow';
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <ErrorBoundary>
        {/* Header */}
        <div className="bg-crd-darker border-b border-crd-mediumGray/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-crd-white">
                {getWorkflowTitle()}
              </h1>
            </div>

            <CRDButton
              variant="outline"
              onClick={handleCancel}
              className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
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
