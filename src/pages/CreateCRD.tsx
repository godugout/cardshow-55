import React from 'react';
import { CRDCardCreatorWrapper } from '@/components/editor/crd/CRDCardCreatorWrapper';
import { CRDOverlayHeader } from '@/components/editor/crd/CRDOverlayHeader';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCRD = () => {
  const navigate = useNavigate();

  console.log('CRDMKR page loaded - Professional card maker');

  const handleComplete = (cardData: CardData) => {
    console.log('CRDMKR card created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('CRDMKR card creation cancelled');
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-crd-darkest overflow-hidden">
      {/* Overlay Header */}
      <CRDOverlayHeader />
      
      {/* Main Content with top padding for header */}
      <div className="pt-16 h-full">
        <ErrorBoundary>
          <CRDCardCreatorWrapper 
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default CreateCRD;