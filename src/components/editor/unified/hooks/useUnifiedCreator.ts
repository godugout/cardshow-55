import { useState, useCallback, useMemo, useRef } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import type { CreationMode, CreationStep, ModeConfig } from '../types';

interface UseUnifiedCreatorParams {
  initialMode?: CreationMode;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

interface UnifiedCreatorState {
  currentStep: CreationStep;
  mode: CreationMode;
  progress: number;
  canGoBack: boolean;
  isCreating: boolean;
  creationError: string | null;
}

export const useUnifiedCreator = ({
  initialMode,
  onComplete,
  onCancel
}: UseUnifiedCreatorParams) => {
  const cardEditor = useCardEditor();
  const router = useRouter();

  const [state, updateState] = useState<UnifiedCreatorState>({
    currentStep: 'intent',
    mode: initialMode || 'quick',
    progress: 0,
    canGoBack: false,
    isCreating: false,
    creationError: null
  });

  const modeConfigs: Record<CreationMode, ModeConfig> = useMemo(() => ({
    quick: {
      title: 'Quick Creation',
      description: 'Create a card in a few simple steps',
      steps: ['upload', 'details', 'publish']
    },
    detailed: {
      title: 'Detailed Creation',
      description: 'Customize every aspect of your card',
      steps: ['upload', 'details', 'design', 'publish']
    },
    bulk: {
      title: 'Bulk Creation',
      description: 'Create multiple cards from a spreadsheet',
      steps: ['upload', 'details', 'publish']
    }
  }), []);

  const currentConfig = modeConfigs[state.mode];

  const galleryFallbackRef = useRef<string>('/gallery');

  const actions = useMemo(() => ({
    updateState,

    setMode: (mode: CreationMode) => {
      console.log('🎯 useUnifiedCreator: Setting mode to:', mode);
      updateState({
        ...state,
        mode,
        currentStep: 'upload',
        progress: 25
      });
    },

    previousStep: () => {
      console.log('🎯 useUnifiedCreator: previousStep called, current step:', state.currentStep);
      const config = modeConfigs[state.mode];
      const currentIndex = config.steps.indexOf(state.currentStep);

      if (currentIndex > 0) {
        const previousStep = config.steps[currentIndex - 1];
        console.log('🎯 useUnifiedCreator: Moving to previous step:', previousStep);
        updateState({
          ...state,
          currentStep: previousStep,
          progress: Math.round((currentIndex / config.steps.length) * 100),
          canGoBack: currentIndex > 1
        });
      } else {
        console.log('🎯 useUnifiedCreator: Already at the first step');
        updateState({ ...state, canGoBack: false });
      }
    },

    nextStep: () => {
      console.log('🎯 useUnifiedCreator: nextStep called, current step:', state.currentStep);
      
      const config = modeConfigs[state.mode];
      const currentIndex = config.steps.indexOf(state.currentStep);
      
      if (currentIndex < config.steps.length - 1) {
        const nextStep = config.steps[currentIndex + 1];
        console.log('🎯 useUnifiedCreator: Moving to next step:', nextStep);
        
        updateState({ 
          currentStep: nextStep,
          progress: Math.round(((currentIndex + 2) / config.steps.length) * 100)
        });
      } else {
        console.log('🎯 useUnifiedCreator: At final step, completing creation');
        actions.completeCreation();
      }
    },

    validateStep: (step: CreationStep): boolean => {
      console.log('🎯 useUnifiedCreator: Validating step:', step);
      switch (step) {
        case 'upload':
          return !!cardEditor.cardData.image_url;
        case 'details':
          return !!cardEditor.cardData.title && !!cardEditor.cardData.description;
        case 'design':
          return true;
        case 'publish':
          return true;
        default:
          return false;
      }
    },

    completeCreation: async () => {
      console.log('🎯 useUnifiedCreator: Completing card creation');
      updateState({ ...state, isCreating: true, creationError: null });

      try {
        await cardEditor.saveCard();
        updateState({ ...state, isCreating: false });
        toast.success('Card created successfully!');
        onComplete?.(cardEditor.cardData);
        router.push('/gallery');
      } catch (error: any) {
        console.error('🎯 useUnifiedCreator: Error completing card creation:', error);
        updateState({ ...state, isCreating: false, creationError: error.message || 'Failed to create card' });
        toast.error('Failed to create card: ' + error.message);
      }
    },

    startOver: () => {
      console.log('🎯 useUnifiedCreator: Starting over, resetting card data');
      cardEditor.resetCard();
      updateState({
        ...state,
        currentStep: 'intent',
        progress: 0,
        canGoBack: false
      });
      router.push('/');
    },

    goToGallery: () => {
      console.log('🎯 useUnifiedCreator: Navigating to gallery');
      router.push(galleryFallbackRef.current);
    }
  }), [state, cardEditor, modeConfigs, onComplete, onCancel, router]);

  return {
    state,
    cardEditor,
    modeConfigs,
    currentConfig,
    actions
  };
};
