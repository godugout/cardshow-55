import React from 'react';
import { PreloadedCRDEditor } from '@/components/editor/crd/PreloadedCRDEditor';
import { CRDEditorProvider } from '@/contexts/CRDEditorContext';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCRD = () => {
  const navigate = useNavigate();

  console.log('CRD Collectibles page loaded - Professional card maker');

  const handleComplete = (cardData: CardData) => {
    console.log('CRD Collectible created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('CRD Collectible creation cancelled');
    navigate('/');
  };

  return (
    <CRDEditorProvider>
      <div className="fixed inset-0 bg-crd-darkest overflow-hidden">
        {/* Main Content - Full height */}
        <div className="h-full">
          <ErrorBoundary>
            <PreloadedCRDEditor 
              onComplete={handleComplete}
              onCancel={handleCancel}
              isVisible={true}
            />
          </ErrorBoundary>
        </div>
      </div>
    </CRDEditorProvider>
  );
};

export default CreateCRD;