
import React from 'react';
import { SimpleCardCreator } from '@/components/editor/unified/SimpleCardCreator';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SubscriptionBanner } from '@/components/monetization/SubscriptionBanner';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCard = () => {
  const navigate = useNavigate();

  console.log('CreateCard page loaded - starting directly at upload step');

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubscriptionBanner />
      </div>
      
      <ErrorBoundary>
        <SimpleCardCreator 
          initialMode="quick"
          onComplete={handleComplete}
          onCancel={handleCancel}
          skipIntent={true}
        />
      </ErrorBoundary>
    </div>
  );
};

export default CreateCard;
