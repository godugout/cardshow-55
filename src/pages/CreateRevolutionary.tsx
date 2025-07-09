import React from 'react';
import { RevolutionaryCardCreatorWrapper } from '@/components/editor/revolutionary/RevolutionaryCardCreatorWrapper';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SubscriptionBanner } from '@/components/monetization/SubscriptionBanner';
import type { CardData } from '@/hooks/useCardEditor';

const CreateRevolutionary = () => {
  const navigate = useNavigate();

  console.log('CreateRevolutionary page loaded - Revolutionary card creator');

  const handleComplete = (cardData: CardData) => {
    console.log('Revolutionary card created successfully:', cardData);
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
        <RevolutionaryCardCreatorWrapper 
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </ErrorBoundary>
    </div>
  );
};

export default CreateRevolutionary;