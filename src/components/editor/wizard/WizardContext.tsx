
import React, { createContext, useContext, useState, ReactNode, useReducer } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import type { CardData, DesignTemplate } from '@/hooks/useCardEditor';

interface WizardState {
  currentStep: number;
  selectedPhoto: string | null;
  selectedTemplate: DesignTemplate | null;
  aiAnalysisComplete: boolean;
  isProcessing: boolean;
  cardData: CardData;
  steps: Array<{
    id: string;
    title: string;
    number: number;
    completed: boolean;
    valid: boolean;
  }>;
  currentStepId: string;
  isLoading: boolean;
  lastSaved?: string;
}

interface WizardHandlers {
  handlePhotoSelect: (photo: string) => void;
  handleTemplateSelect: (template: DesignTemplate) => void;
  handleAiAnalysis: (analysisData: any) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleComplete: () => Promise<void>;
  updatePublishingOptions: (options: any) => void;
  updateCreatorAttribution: (attribution: any) => void;
  updateCardField: (field: keyof CardData, value: any) => void;
}

interface WizardContextType {
  wizardState: WizardState;
  handlers: WizardHandlers;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within a WizardProvider');
  }
  return context;
};

const initialSteps = [
  { id: 'upload', title: 'Upload & Frames', number: 1, completed: false, valid: false },
  { id: 'effects', title: 'Effects & Lighting', number: 2, completed: false, valid: true },
  { id: 'publish', title: 'Publish & Share', number: 3, completed: false, valid: false }
];

interface WizardProviderProps {
  children: ReactNode;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const cardEditor = useCardEditor();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const wizardState: WizardState = {
    currentStep,
    selectedPhoto,
    selectedTemplate,
    aiAnalysisComplete,
    isProcessing,
    cardData: cardEditor.cardData,
    steps: initialSteps,
    currentStepId: 'upload',
    isLoading
  };

  const handlers: WizardHandlers = {
    handlePhotoSelect: (photo: string) => {
      console.log('📸 Photo selected:', photo);
      setSelectedPhoto(photo);
      cardEditor.updateCardField('image_url', photo);
    },

    handleTemplateSelect: (template: DesignTemplate) => {
      console.log('🎨 Template selected:', template);
      setSelectedTemplate(template);
      cardEditor.updateCardField('template_id', template.id);
    },

    handleAiAnalysis: (analysisData: any) => {
      console.log('🤖 AI analysis complete:', analysisData);
      
      if (analysisData?.title) {
        cardEditor.updateCardField('title', analysisData.title);
      }
      if (analysisData?.description) {
        cardEditor.updateCardField('description', analysisData.description);
      }
      if (analysisData?.rarity) {
        cardEditor.updateCardField('rarity', analysisData.rarity);
      }
      if (analysisData?.tags) {
        cardEditor.updateCardField('tags', analysisData.tags);
      }
      
      setAiAnalysisComplete(true);
    },

    handleNext: () => {
      const nextStep = Math.min(currentStep + 1, 3);
      console.log('➡️ Moving to step:', nextStep);
      setCurrentStep(nextStep);
    },

    handleBack: () => {
      const prevStep = Math.max(currentStep - 1, 1);
      console.log('⬅️ Moving to step:', prevStep);
      setCurrentStep(prevStep);
    },

    handleComplete: async () => {
      console.log('✅ Completing wizard with card data:', cardEditor.cardData);
      setIsLoading(true);
      
      try {
        await cardEditor.saveCard();
        console.log('✅ Card saved successfully');
      } catch (error) {
        console.error('❌ Error saving card:', error);
      } finally {
        setIsLoading(false);
      }
    },

    updatePublishingOptions: (options: any) => {
      console.log('📤 Publishing options updated:', options);
      cardEditor.updateCardField('publishing_options', options);
    },

    updateCreatorAttribution: (attribution: any) => {
      console.log('👤 Creator attribution updated:', attribution);
      cardEditor.updateCardField('creator_attribution', attribution);
    },

    updateCardField: (field: keyof CardData, value: any) => {
      console.log(`🔄 Updating field ${field}:`, value);
      cardEditor.updateCardField(field, value);
    }
  };

  console.log('🧙 WizardProvider: Rendering with state:', wizardState);

  return (
    <WizardContext.Provider value={{ wizardState, handlers }}>
      {children}
    </WizardContext.Provider>
  );
};
