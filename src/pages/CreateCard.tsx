
import React from 'react';
import { UniversalCardCreator } from '@/components/editor/unified/UniversalCardCreator';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCard = () => {
  const navigate = useNavigate();

  console.log('CreateCard page loaded - using UniversalCardCreator');

  const handleComplete = (cardData: CardData) => {
    console.log('Card created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('Card creation cancelled');
    navigate('/');
  };

  return (
    <ErrorBoundary>
      <UniversalCardCreator 
        initialMode="quick"
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </ErrorBoundary>
  );
};

export default CreateCard;
