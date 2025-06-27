
import React from 'react';
import { useWizardContext } from './WizardContext';

// Placeholder step components - will be implemented in subsequent prompts
const TemplateSelectionStep = () => (
  <div className="text-center space-y-6">
    <h2 className="text-3xl font-bold text-white">Choose Your Template</h2>
    <p className="text-crd-lightGray text-lg">Select a template to get started with your card design</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg p-6 hover:border-crd-green/50 transition-colors cursor-pointer">
          <div className="aspect-[3/4] bg-crd-mediumGray rounded-lg mb-3"></div>
          <p className="text-white text-center">Template {i + 1}</p>
        </div>
      ))}
    </div>
  </div>
);

const PhotoUploadStep = () => (
  <div className="text-center space-y-6">
    <h2 className="text-3xl font-bold text-white">Upload Your Photo</h2>
    <p className="text-crd-lightGray text-lg">Add the main image for your trading card</p>
    <div className="max-w-md mx-auto">
      <div className="bg-crd-darkGray border-2 border-dashed border-crd-mediumGray/50 rounded-lg p-12 hover:border-crd-green/50 transition-colors">
        <div className="text-crd-lightGray">
          <div className="text-4xl mb-4">📁</div>
          <p className="text-lg mb-2">Drop your image here</p>
          <p className="text-sm">or click to browse</p>
        </div>
      </div>
    </div>
  </div>
);

const CardDetailsStep = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white">Card Details</h2>
      <p className="text-crd-lightGray text-lg">Add information about your trading card</p>
    </div>
    <div className="space-y-4">
      <div>
        <label className="block text-white font-medium mb-2">Card Title</label>
        <input 
          type="text" 
          className="w-full bg-crd-darkGray border border-crd-mediumGray text-white rounded-lg px-4 py-3 focus:border-crd-green focus:outline-none"
          placeholder="Enter card title..."
        />
      </div>
      <div>
        <label className="block text-white font-medium mb-2">Description</label>
        <textarea 
          className="w-full bg-crd-darkGray border border-crd-mediumGray text-white rounded-lg px-4 py-3 h-24 focus:border-crd-green focus:outline-none resize-none"
          placeholder="Describe your card..."
        />
      </div>
    </div>
  </div>
);

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
  const { state } = useWizardContext();

  const renderStep = () => {
    switch (state.currentStepId) {
      case 'template':
        return <TemplateSelectionStep />;
      case 'upload':
        return <PhotoUploadStep />;
      case 'details':
        return <CardDetailsStep />;
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
