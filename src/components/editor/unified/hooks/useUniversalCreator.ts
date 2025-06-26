import { useState, useCallback, useMemo, useEffect } from 'react';
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
    canAdvance: true,
    canGoBack: false,
    progress: 0,
    errors: {},
    isCreating: false,
    creationError: null
  });

  const cardEditor = useCardEditor({
    autoSave: false, // We'll handle saving manually
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

  // Calculate progress based on current step
  useEffect(() => {
    if (currentConfig) {
      const currentIndex = currentConfig.steps.indexOf(state.currentStep);
      const progress = currentIndex >= 0 ? (currentIndex / (currentConfig.steps.length - 1)) * 100 : 0;
      
      setState(prev => ({
        ...prev,
        progress,
        canGoBack: currentIndex > 0,
        canAdvance: currentIndex < currentConfig.steps.length - 1
      }));
    }
  }, [state.currentStep, currentConfig]);

  const updateState = useCallback((updates: Partial<CreationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setMode = useCallback((mode: CreationMode) => {
    console.log('useUniversalCreator: Setting mode to', mode);
    const config = modeConfigs.find(c => c.id === mode);
    if (config) {
      updateState({
        mode,
        currentStep: config.steps[1] || 'upload', // Skip intent step when mode is selected
        intent: { ...state.intent, mode },
        errors: {} // Clear any previous errors
      });
    }
  }, [modeConfigs, state.intent, updateState]);

  const nextStep = useCallback(() => {
    if (!currentConfig) return;
    
    const currentIndex = currentConfig.steps.indexOf(state.currentStep);
    if (currentIndex < currentConfig.steps.length - 1) {
      const nextStep = currentConfig.steps[currentIndex + 1];
      console.log('useUniversalCreator: Moving to next step:', nextStep);
      
      setState(prev => ({
        ...prev,
        currentStep: nextStep,
        errors: {} // Clear errors when advancing
      }));
    }
  }, [currentConfig, state.currentStep]);

  const previousStep = useCallback(() => {
    if (!currentConfig) return;
    
    const currentIndex = currentConfig.steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      const prevStep = currentConfig.steps[currentIndex - 1];
      console.log('useUniversalCreator: Moving to previous step:', prevStep);
      
      setState(prev => ({
        ...prev,
        currentStep: prevStep,
        errors: {} // Clear errors when going back
      }));
    }
  }, [currentConfig, state.currentStep]);

  const validateStep = useCallback(() => {
    const { currentStep } = state;
    const { cardData } = cardEditor;
    
    try {
      switch (currentStep) {
        case 'intent':
          return true; // Intent step is always valid
          
        case 'upload':
          const hasImage = !!cardData.image_url;
          if (!hasImage) {
            updateState({ 
              errors: { upload: 'Please upload an image to continue' }
            });
          }
          return hasImage;
          
        case 'details':
          const hasTitle = cardData.title && cardData.title.trim().length > 0;
          const titleValid = hasTitle && cardData.title !== 'My New Card';
          if (!titleValid) {
            updateState({ 
              errors: { details: 'Please provide a meaningful title for your card' }
            });
          }
          return titleValid;
          
        case 'design':
          return true; // Design step is optional
          
        case 'publish':
          return true; // Publish step validation happens during save
          
        default:
          return true;
      }
    } catch (error) {
      console.error('Step validation error:', error);
      return false;
    }
  }, [state.currentStep, cardEditor.cardData, updateState]);

  const completeCreation = useCallback(async () => {
    updateState({ isCreating: true, creationError: null });

    try {
      // Validate final card data
      if (!cardEditor.cardData.image_url) {
        throw new Error('Card must have an image');
      }

      if (!cardEditor.cardData.title || cardEditor.cardData.title.trim() === '') {
        throw new Error('Card must have a title');
      }

      // Save the card
      const success = await cardEditor.saveCard();
      
      if (success) {
        updateState({ currentStep: 'complete' });
        
        if (onComplete) {
          onComplete(cardEditor.cardData);
        }
        
        toast.success('Card created successfully!', {
          description: `"${cardEditor.cardData.title}" has been saved to your collection.`
        });
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
    // Reset card editor to clean state
    cardEditor.updateCardField('title', 'My New Card');
    cardEditor.updateCardField('description', '');
    cardEditor.updateCardField('image_url', undefined);
    cardEditor.updateCardField('thumbnail_url', undefined);
    
    // Reset creation state
    const config = modeConfigs.find(c => c.id === initialMode);
    updateState({ 
      mode: initialMode,
      currentStep: config?.steps[0] || 'intent',
      creationError: null,
      errors: {},
      isCreating: false
    });
  }, [cardEditor, initialMode, modeConfigs, updateState]);

  return {
    state,
    cardEditor,
    modeConfigs,
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
