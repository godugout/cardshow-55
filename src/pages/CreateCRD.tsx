
import React from 'react';
import { CRDCardCreatorWrapper } from '@/components/editor/crd/CRDCardCreatorWrapper';
import { CRDOverlayHeader } from '@/components/editor/crd/CRDOverlayHeader';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NavbarAwareContainer } from '@/components/layout/NavbarAwareContainer';
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
    <NavbarAwareContainer className="fixed inset-0 bg-crd-darkest overflow-hidden">
      {/* Main Content - Full height */}
      <div className="h-full">
        <ErrorBoundary>
          <CRDCardCreatorWrapper 
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        </ErrorBoundary>
      </div>
    </NavbarAwareContainer>
  );
};

export default CreateCRD;
