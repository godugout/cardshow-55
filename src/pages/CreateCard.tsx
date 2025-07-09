
import React from 'react';
import { SimpleCardCreator } from '@/components/editor/unified/SimpleCardCreator';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SubscriptionBanner } from '@/components/monetization/SubscriptionBanner';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Sparkles } from 'lucide-react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCard = () => {
  const navigate = useNavigate();
  const { isEnabled } = useFeatureFlags();

  console.log('CreateCard page loaded - starting directly at upload step');

  const handleComplete = (cardData: CardData) => {
    console.log('Card created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('Card creation cancelled');
    navigate('/');
  };

  const handleRevolutionaryMode = () => {
    console.log('Redirecting to revolutionary mode');
    navigate('/create/revolutionary');
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubscriptionBanner />
      </div>
      
      {/* Revolutionary Mode Banner */}
      {isEnabled('revolutionary_create_mode') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-gradient-to-r from-crd-purple/20 to-crd-green/20 border border-crd-purple/30 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 bg-crd-purple/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-crd-purple" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-crd-white">Revolutionary Mode Available!</h3>
                  <p className="text-crd-lightGray">Create living, interactive cards with advanced features</p>
                </div>
              </div>
              <CRDButton
                onClick={handleRevolutionaryMode}
                variant="primary"
                className="bg-gradient-to-r from-crd-purple to-crd-green hover:from-crd-purple/80 hover:to-crd-green/80 text-white border-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Try Revolutionary Mode
              </CRDButton>
            </div>
          </div>
        </div>
      )}
      
      <ErrorBoundary>
        <SimpleCardCreator 
          initialMode="quick"
          onComplete={handleComplete}
          onCancel={handleCancel}
          skipIntent={true}
          onRevolutionaryMode={handleRevolutionaryMode}
        />
      </ErrorBoundary>
    </div>
  );
};

export default CreateCard;
