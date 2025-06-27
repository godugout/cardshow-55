
import React from 'react';
import { useWizardContext } from './WizardContext';
import { AdvancedTemplateSelection } from './steps/AdvancedTemplateSelection';
import { PhotoUploadStep } from './steps/PhotoUploadStep';
import { CardDetailsStep } from './CardDetailsStep';

// Placeholder step components for other steps
const VisualEffectsStep = () => (
  <div className="text-center space-y-6">
    <h2 className="text-3xl font-bold text-white">Visual Effects</h2>
    <p className="text-crd-lightGray text-lg">Add special effects to make your card unique</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {['Holographic', 'Foil', 'Glitter', 'Chrome', 'Rainbow', 'Vintage', 'Neon', 'Crystal'].map((effect) => (
        <div key={effect} className="bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg p-4 hover:border-crd-green/50 transition-colors cursor-pointer">
          <div className="aspect-square bg-crd-mediumGray rounded-lg mb-3"></div>
          <p className="text-white text-center text-sm">{effect}</p>
        </div>
      ))}
    </div>
  </div>
);

const PreviewPublishStep = () => (
  <div className="text-center space-y-6">
    <h2 className="text-3xl font-bold text-white">Preview & Publish</h2>
    <p className="text-crd-lightGray text-lg">Review your card and publish it to the community</p>
    <div className="max-w-md mx-auto">
      <div className="bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg p-6">
        <div className="aspect-[3/4] bg-crd-mediumGray rounded-lg mb-4"></div>
        <h3 className="text-white font-semibold text-lg">Your Card Preview</h3>
        <p className="text-crd-lightGray text-sm">Final card will appear here</p>
      </div>
    </div>
  </div>
);

export const WizardStepRenderer: React.FC = () => {
  const { state, dispatch } = useWizardContext();

  const handleFieldUpdate = <K extends keyof typeof state.cardData>(field: K, value: typeof state.cardData[K]) => {
    dispatch({
      type: 'UPDATE_CARD_DATA',
      payload: { [field]: value }
    });
  };

  const handleCreatorAttributionUpdate = (key: string, value: any) => {
    const currentAttribution = state.cardData.creator_attribution || {
      creator_name: '',
      creator_id: '',
      collaboration_type: 'solo'
    };
    
    dispatch({
      type: 'UPDATE_CARD_DATA',
      payload: {
        creator_attribution: {
          ...currentAttribution,
          [key]: value
        }
      }
    });
  };

  const renderStep = () => {
    switch (state.currentStepId) {
      case 'template':
        return <AdvancedTemplateSelection />;
      case 'upload':
        return <PhotoUploadStep />;
      case 'details':
        return (
          <CardDetailsStep
            cardData={state.cardData}
            onFieldUpdate={handleFieldUpdate}
            onCreatorAttributionUpdate={handleCreatorAttributionUpdate}
          />
        );
      case 'effects':
        return <VisualEffectsStep />;
      case 'publish':
        return <PreviewPublishStep />;
      default:
        return <div className="text-center text-white">Step not found</div>;
    }
  };

  return (
    <div className="animate-fade-in">
      {renderStep()}
    </div>
  );
};
