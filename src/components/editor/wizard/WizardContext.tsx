
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import type { CardData, DesignTemplate } from '@/hooks/useCardEditor';

interface WizardState {
  currentStep: number;
  selectedPhoto: string | null;
  selectedTemplate: DesignTemplate | null;
  aiAnalysisComplete: boolean;
  isProcessing: boolean;
}

interface WizardHandlers {
  handlePhotoSelect: (photo: string) => void;
  handleTemplateSelect: (template: DesignTemplate) => void;
  handleAiAnalysis: (analysisData: any) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleComplete: () => void;
  updatePublishingOptions: (options: any) => void;
  updateCreatorAttribution: (attribution: any) => void;
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

interface WizardProviderProps {
  children: ReactNode;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const cardEditor = useCardEditor();
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    selectedPhoto: null,
    selectedTemplate: null,
    aiAnalysisComplete: false,
    isProcessing: false
  });

  console.log('🧙 WizardProvider: Current state:', wizardState);

  const handlers: WizardHandlers = {
    handlePhotoSelect: (photo: string) => {
      console.log('📸 Photo selected:', photo);
      setWizardState(prev => ({ ...prev, selectedPhoto: photo, isProcessing: true }));
      cardEditor.updateCardField('image_url', photo);
    },

    handleTemplateSelect: (template: DesignTemplate) => {
      console.log('🎨 Template selected:', template);
      setWizardState(prev => ({ ...prev, selectedTemplate: template }));
      cardEditor.updateCardField('template_id', template.id);
    },

    handleAiAnalysis: (analysisData: any) => {
      console.log('🤖 AI analysis complete:', analysisData);
      setWizardState(prev => ({ 
        ...prev, 
        aiAnalysisComplete: true, 
        isProcessing: false 
      }));
      
      // Apply analysis results to card data
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
    },

    handleNext: () => {
      const nextStep = Math.min(wizardState.currentStep + 1, 3);
      console.log('➡️ Moving to step:', nextStep);
      setWizardState(prev => ({ ...prev, currentStep: nextStep }));
    },

    handleBack: () => {
      const prevStep = Math.max(wizardState.currentStep - 1, 1);
      console.log('⬅️ Moving to step:', prevStep);
      setWizardState(prev => ({ ...prev, currentStep: prevStep }));
    },

    handleComplete: async () => {
      console.log('✅ Completing wizard with card data:', cardEditor.cardData);
      setWizardState(prev => ({ ...prev, isProcessing: true }));
      
      try {
        await cardEditor.saveCard();
        console.log('✅ Card saved successfully');
      } catch (error) {
        console.error('❌ Error saving card:', error);
      } finally {
        setWizardState(prev => ({ ...prev, isProcessing: false }));
      }
    },

    updatePublishingOptions: (options: any) => {
      console.log('📤 Publishing options updated:', options);
      cardEditor.updateCardField('publishing_options', options);
    },

    updateCreatorAttribution: (attribution: any) => {
      console.log('👤 Creator attribution updated:', attribution);
      // Handle creator attribution updates
    }
  };

  return (
    <WizardContext.Provider value={{ wizardState, handlers }}>
      {children}
    </WizardContext.Provider>
  );
};
