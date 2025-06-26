
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
  console.log('🎯 useUniversalCreator: Hook called with:', { initialMode, onComplete, onCancel });
  
  const navigate = useNavigate();
  
  try {
    console.log('🔧 useUniversalCreator: Initializing state');
    
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

    console.log('📝 useUniversalCreator: Initializing cardEditor');
    
    const cardEditor = useCardEditor({
      autoSave: false,
      autoSaveInterval: 30000
    });

    console.log('⚙️ useUniversalCreator: Setting up mode configs');

    const modeConfigs = useMemo(() => {
      const configs = [
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
      ];
      
      console.log('📋 useUniversalCreator: Mode configs created:', configs.map(c => c.id));
      return configs;
    }, []);

    const currentConfig = useMemo(() => {
      const config = modeConfigs.find(config => config.id === state.mode);
      console.log('🎛️ useUniversalCreator: Current config:', config?.id || 'none');
      return config;
    }, [modeConfigs, state.mode]);

    const updateState = useCallback((updates: Partial<CreationState>) => {
      console.log('🔄 useUniversalCreator: State update:', updates);
      setState(prev => ({ ...prev, ...updates }));
    }, []);

    const setMode = useCallback((mode: CreationMode) => {
      console.log('🎯 useUniversalCreator: Setting mode to', mode);
      const config = modeConfigs.find(c => c.id === mode);
      if (config) {
        setState(prev => ({
          ...prev,
          mode,
          currentStep: config.steps[1] || 'upload',
          intent: { ...prev.intent, mode },
          errors: {}
        }));
      } else {
        console.error('❌ useUniversalCreator: Config not found for mode:', mode);
      }
    }, [modeConfigs]);

    const nextStep = useCallback(() => {
      if (!currentConfig) {
        console.error('❌ useUniversalCreator: No current config for nextStep');
        return;
      }
      
      const currentIndex = currentConfig.steps.indexOf(state.currentStep);
      if (currentIndex < currentConfig.steps.length - 1) {
        const nextStep = currentConfig.steps[currentIndex + 1];
        console.log('➡️ useUniversalCreator: Moving to next step:', nextStep);
        
        setState(prev => ({
          ...prev,
          currentStep: nextStep,
          errors: {}
        }));
      }
    }, [currentConfig, state.currentStep]);

    const previousStep = useCallback(() => {
      if (!currentConfig) {
        console.error('❌ useUniversalCreator: No current config for previousStep');
        return;
      }
      
      const currentIndex = currentConfig.steps.indexOf(state.currentStep);
      if (currentIndex > 0) {
        const prevStep = currentConfig.steps[currentIndex - 1];
        console.log('⬅️ useUniversalCreator: Moving to previous step:', prevStep);
        
        setState(prev => ({
          ...prev,
          currentStep: prevStep,
          errors: {}
        }));
      }
    }, [currentConfig, state.currentStep]);

    const validateStep = useCallback(() => {
      const { currentStep } = state;
      const { cardData } = cardEditor;
      
      try {
        switch (currentStep) {
          case 'intent':
            return true;
            
          case 'upload':
            const hasImage = !!cardData.image_url;
            if (!hasImage) {
              setState(prev => ({
                ...prev,
                errors: { upload: 'Please upload an image to continue' }
              }));
            }
            return hasImage;
            
          case 'details':
            const hasTitle = cardData.title && cardData.title.trim().length > 0;
            const titleValid = hasTitle && cardData.title !== 'My New Card';
            if (!titleValid) {
              setState(prev => ({
                ...prev,
                errors: { details: 'Please provide a meaningful title for your card' }
              }));
            }
            return titleValid;
            
          case 'design':
            return true;
            
          case 'publish':
            return true;
            
          default:
            return true;
        }
      } catch (error) {
        console.error('❌ useUniversalCreator: Step validation error:', error);
        return false;
      }
    }, [state.currentStep, cardEditor.cardData]);

    const completeCreation = useCallback(async () => {
      console.log('🚀 useUniversalCreator: Starting card creation');
      setState(prev => ({ ...prev, isCreating: true, creationError: null }));

      try {
        if (!cardEditor.cardData.image_url) {
          throw new Error('Card must have an image');
        }

        if (!cardEditor.cardData.title || cardEditor.cardData.title.trim() === '') {
          throw new Error('Card must have a title');
        }

        const success = await cardEditor.saveCard();
        
        if (success) {
          setState(prev => ({ ...prev, currentStep: 'complete' }));
          
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
        console.error('❌ useUniversalCreator: Error creating card:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create card';
        setState(prev => ({ ...prev, creationError: errorMessage }));
        toast.error('Failed to create card', {
          description: errorMessage
        });
      } finally {
        setState(prev => ({ ...prev, isCreating: false }));
      }
    }, [cardEditor, onComplete]);

    const goToGallery = useCallback(() => {
      console.log('🏠 useUniversalCreator: Navigating to gallery');
      navigate('/gallery');
    }, [navigate]);

    const startOver = useCallback(() => {
      console.log('🔄 useUniversalCreator: Starting over');
      cardEditor.updateCardField('title', 'My New Card');
      cardEditor.updateCardField('description', '');
      cardEditor.updateCardField('image_url', undefined);
      cardEditor.updateCardField('thumbnail_url', undefined);
      
      const config = modeConfigs.find(c => c.id === initialMode);
      setState(prev => ({ 
        ...prev,
        mode: initialMode,
        currentStep: config?.steps[0] || 'intent',
        creationError: null,
        errors: {},
        isCreating: false
      }));
    }, [cardEditor, initialMode, modeConfigs]);

    // Calculate progress and navigation state based on current step and config
    const calculatedState = useMemo(() => {
      if (!currentConfig) {
        return {
          progress: 0,
          canGoBack: false,
          canAdvance: false
        };
      }

      const currentIndex = currentConfig.steps.indexOf(state.currentStep);
      const progress = currentIndex >= 0 ? (currentIndex / (currentConfig.steps.length - 1)) * 100 : 0;
      
      return {
        progress,
        canGoBack: currentIndex > 0,
        canAdvance: currentIndex < currentConfig.steps.length - 1
      };
    }, [currentConfig, state.currentStep]);

    console.log('✅ useUniversalCreator: Hook setup complete, returning state and actions');

    return {
      state: {
        ...state,
        ...calculatedState
      },
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
  } catch (error) {
    console.error('💥 useUniversalCreator: Critical error in hook:', error);
    throw error;
  }
};
