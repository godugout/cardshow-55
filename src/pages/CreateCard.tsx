
import React from 'react';
import { UniversalCardCreator } from '@/components/editor/unified/UniversalCardCreator';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCard = () => {
  const navigate = useNavigate();

  console.log('CreateCard page loaded - initializing UniversalCardCreator');

  const handleComplete = (cardData: CardData) => {
    console.log('Card created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('Card creation cancelled');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <ErrorBoundary>
        <UniversalCardCreator 
          initialMode="quick"
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </ErrorBoundary>
    </div>
  );
};

export default CreateCard;
