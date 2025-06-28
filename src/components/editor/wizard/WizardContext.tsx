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

type WizardAction = 
  | { type: 'UPDATE_CARD_DATA'; payload: Partial<CardData> }
  | { type: 'SET_CURRENT_STEP'; payload: string }
  | { type: 'MARK_STEP_COMPLETED'; payload: string }
  | { type: 'SET_STEP_VALIDITY'; payload: { stepId: string; valid: boolean } }
  | { type: 'MARK_SAVED' }
  | { type: 'SET_LOADING'; payload: boolean };

interface WizardHandlers {
  handlePhotoSelect: (photo: string) => void;
  handleTemplateSelect: (template: DesignTemplate) => void;
  handleAiAnalysis: (analysisData: any) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleComplete: () => void;
  updatePublishingOptions: (options: any) => void;
  updateCreatorAttribution: (attribution: any) => void;
  updateCardField: (field: keyof CardData, value: any) => void;
}

interface WizardContextType {
  wizardState: WizardState;
  handlers: WizardHandlers;
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
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

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'UPDATE_CARD_DATA':
      return {
        ...state,
        cardData: { ...state.cardData, ...action.payload }
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStepId: action.payload
      };
    case 'MARK_STEP_COMPLETED':
      return {
        ...state,
        steps: state.steps.map(step => 
          step.id === action.payload 
            ? { ...step, completed: true }
            : step
        )
      };
    case 'SET_STEP_VALIDITY':
      return {
        ...state,
        steps: state.steps.map(step =>
          step.id === action.payload.stepId
            ? { ...step, valid: action.payload.valid }
            : step
        )
      };
    case 'MARK_SAVED':
      return {
        ...state,
        lastSaved: new Date().toISOString()
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
}

interface WizardProviderProps {
  children: ReactNode;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const cardEditor = useCardEditor();
  
  const initialState: WizardState = {
    currentStep: 1,
    selectedPhoto: null,
    selectedTemplate: null,
    aiAnalysisComplete: false,
    isProcessing: false,
    cardData: cardEditor.cardData,
    steps: initialSteps,
    currentStepId: 'upload',
    isLoading: false
  };

  const [state, dispatch] = useReducer(wizardReducer, initialState);

  // Keep legacy wizardState for backward compatibility
  const wizardState = {
    currentStep: state.currentStep,
    selectedPhoto: state.selectedPhoto,
    selectedTemplate: state.selectedTemplate,
    aiAnalysisComplete: state.aiAnalysisComplete,
    isProcessing: state.isProcessing
  };

  console.log('🧙 WizardProvider: Current state:', state);

  const handlers: WizardHandlers = {
    handlePhotoSelect: (photo: string) => {
      console.log('📸 Photo selected:', photo);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { image_url: photo } });
      cardEditor.updateCardField('image_url', photo);
    },

    handleTemplateSelect: (template: DesignTemplate) => {
      console.log('🎨 Template selected:', template);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { template_id: template.id } });
      cardEditor.updateCardField('template_id', template.id);
    },

    handleAiAnalysis: (analysisData: any) => {
      console.log('🤖 AI analysis complete:', analysisData);
      
      const updates: Partial<CardData> = {};
      if (analysisData?.title) updates.title = analysisData.title;
      if (analysisData?.description) updates.description = analysisData.description;
      if (analysisData?.rarity) updates.rarity = analysisData.rarity;
      if (analysisData?.tags) updates.tags = analysisData.tags;
      
      dispatch({ type: 'UPDATE_CARD_DATA', payload: updates });
      
      // Apply to card editor as well
      Object.entries(updates).forEach(([key, value]) => {
        cardEditor.updateCardField(key as keyof CardData, value);
      });
    },

    handleNext: () => {
      const nextStep = Math.min(state.currentStep + 1, 3);
      console.log('➡️ Moving to step:', nextStep);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { ...state.cardData, currentStep: nextStep } });
    },

    handleBack: () => {
      const prevStep = Math.max(state.currentStep - 1, 1);
      console.log('⬅️ Moving to step:', prevStep);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { ...state.cardData, currentStep: prevStep } });
    },

    handleComplete: async () => {
      console.log('✅ Completing wizard with card data:', state.cardData);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        await cardEditor.saveCard();
        console.log('✅ Card saved successfully');
      } catch (error) {
        console.error('❌ Error saving card:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    updatePublishingOptions: (options: any) => {
      console.log('📤 Publishing options updated:', options);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { publishing_options: options } });
      cardEditor.updateCardField('publishing_options', options);
    },

    updateCreatorAttribution: (attribution: any) => {
      console.log('👤 Creator attribution updated:', attribution);
      // Handle creator attribution updates
    },

    updateCardField: (field: keyof CardData, value: any) => {
      console.log(`🔄 Updating field ${field}:`, value);
      dispatch({ type: 'UPDATE_CARD_DATA', payload: { [field]: value } });
      cardEditor.updateCardField(field, value);
    }
  };

  return (
    <WizardContext.Provider value={{ wizardState, handlers, state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
};
