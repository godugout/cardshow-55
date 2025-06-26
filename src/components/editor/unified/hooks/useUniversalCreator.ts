
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import type { CreationMode, CreationStep, CreationState } from '../types';

interface UseUniversalCreatorProps {
  initialMode?: CreationMode;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const useUniversalCreator = ({
  initialMode = 'quick',
  onComplete,
  onCancel
}: UseUniversalCreatorProps = {}) => {
  const navigate = useNavigate();
  const [state, setState] = useState<CreationState>({
    mode: initialMode,
    currentStep: 'intent',
    intent: { mode: initialMode },
    canAdvance: false,
    canGoBack: false,
    progress: 0,
    errors: {},
    isCreating: false,
    creationError: null
  });

  const cardEditor = useCardEditor({
    autoSave: true,
    autoSaveInterval: 30000
  });

  const modeConfigs = useMemo(() => [
    {
      id: 'quick' as CreationMode,
      title: 'Quick Create',
      description: 'Simple form-based card creation',
      icon: 'Zap',
      steps: ['intent', 'upload', 'details', 'publish'] as CreationStep[],
      features: ['AI assistance', 'Smart defaults', 'One-click publish']
    },
    {
      id: 'guided' as CreationMode,
      title: 'Guided Create',
      description: 'Step-by-step wizard with help',
      icon: 'Navigation',
      steps: ['intent', 'upload', 'details', 'design', 'publish'] as CreationStep[],
      features: ['Progressive guidance', 'Templates', 'Live preview']
    },
    {
      id: 'advanced' as CreationMode,
      title: 'Advanced Create',
      description: 'Full editor with all features',
      icon: 'Settings',
      steps: ['intent', 'upload', 'design', 'details', 'publish'] as CreationStep[],
      features: ['Advanced cropping', 'Custom effects', 'Collaboration']
    },
    {
      id: 'bulk' as CreationMode,
      title: 'Bulk Create',
      description: 'Create multiple cards at once',
      icon: 'Copy',
      steps: ['intent', 'upload', 'complete'] as CreationStep[],
      features: ['Batch processing', 'AI analysis', 'Template application']
    }
  ], []);

  const currentConfig = useMemo(() => 
    modeConfigs.find(config => config.id === state.mode),
    [modeConfigs, state.mode]
  );

  const updateState = useCallback((updates: Partial<CreationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setMode = useCallback((mode: CreationMode) => {
    const config = modeConfigs.find(c => c.id === mode);
    if (config) {
      updateState({
        mode,
        currentStep: config.steps[0],
        intent: { ...state.intent, mode },
        progress: 0
      });
    }
  }, [modeConfigs, state.intent, updateState]);

  const nextStep = useCallback(() => {
    if (!currentConfig) return;
    
    const currentIndex = currentConfig.steps.indexOf(state.currentStep);
    const nextIndex = Math.min(currentIndex + 1, currentConfig.steps.length - 1);
    const nextStep = currentConfig.steps[nextIndex];
    
    updateState({
      currentStep: nextStep,
      progress: (nextIndex / (currentConfig.steps.length - 1)) * 100,
      canGoBack: nextIndex > 0,
      canAdvance: nextIndex < currentConfig.steps.length - 1
    });
  }, [currentConfig, state.currentStep, updateState]);

  const previousStep = useCallback(() => {
    if (!currentConfig) return;
    
    const currentIndex = currentConfig.steps.indexOf(state.currentStep);
    const prevIndex = Math.max(currentIndex - 1, 0);
    const prevStep = currentConfig.steps[prevIndex];
    
    updateState({
      currentStep: prevStep,
      progress: (prevIndex / (currentConfig.steps.length - 1)) * 100,
      canGoBack: prevIndex > 0,
      canAdvance: true
    });
  }, [currentConfig, state.currentStep, updateState]);

  const validateStep = useCallback(() => {
    const { currentStep } = state;
    const { cardData } = cardEditor;
    
    switch (currentStep) {
      case 'details':
        return cardData.title.trim().length > 0;
      case 'upload':
        return !!cardData.image_url;
      default:
        return true;
    }
  }, [state.currentStep, cardEditor.cardData]);

  const completeCreation = useCallback(async () => {
    updateState({ isCreating: true, creationError: null });

    try {
      const success = await cardEditor.saveCard();
      
      if (success) {
        updateState({ currentStep: 'complete' });
        
        if (onComplete) {
          onComplete(cardEditor.cardData);
        }
        
        toast.success('Card created successfully!');
      } else {
        throw new Error('Failed to save card');
      }
    } catch (error) {
      console.error('Error creating card:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create card';
      updateState({ creationError: errorMessage });
      toast.error('Failed to create card', {
        description: errorMessage
      });
    } finally {
      updateState({ isCreating: false });
    }
  }, [cardEditor, onComplete, updateState]);

  const goToGallery = useCallback(() => {
    navigate('/gallery');
  }, [navigate]);

  const startOver = useCallback(() => {
    setMode(initialMode);
    updateState({ creationError: null });
    cardEditor.updateCardField('title', 'My New Card');
    cardEditor.updateCardField('description', '');
    cardEditor.updateCardField('image_url', undefined);
  }, [setMode, initialMode, cardEditor, updateState]);

  return {
    state,
    cardEditor,
    currentConfig,
    actions: {
      setMode,
      nextStep,
      previousStep,
      validateStep,
      completeCreation,
      updateState,
      goToGallery,
      startOver
    }
  };
};
