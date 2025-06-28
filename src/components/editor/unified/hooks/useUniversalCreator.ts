import { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import type { CreationMode, CreationStep } from '../types';

interface UseUniversalCreatorProps {
  initialMode?: CreationMode;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

// Move MODE_CONFIGS outside to prevent re-creation
const MODE_CONFIGS = [
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

export const useUniversalCreator = ({
  initialMode = 'quick',
  onComplete,
  onCancel
}: UseUniversalCreatorProps = {}) => {
  console.log('🎯 useUniversalCreator: Hook initialized with mode:', initialMode);
  
  const navigate = useNavigate();
  
  // Stable refs to prevent unnecessary re-renders
  const onCompleteRef = useRef(onComplete);
  const onCancelRef = useRef(onCancel);
  onCompleteRef.current = onComplete;
  onCancelRef.current = onCancel;
  
  // Simple state management - no nested objects
  const [mode, setMode] = useState<CreationMode>(initialMode);
  const [currentStep, setCurrentStep] = useState<CreationStep>('intent');
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize card editor with minimal config - DON'T auto-save during creation
  const cardEditor = useCardEditor({
    autoSave: false,
    autoSaveInterval: 0
  });

  // Memoized current config - stable reference
  const currentConfig = useMemo(() => {
    const config = MODE_CONFIGS.find(config => config.id === mode);
    console.log('🎯 useUniversalCreator: Current config found:', !!config, 'for mode:', mode);
    return config;
  }, [mode]);

  // Memoized progress calculation
  const progress = useMemo(() => {
    if (!currentConfig) return 0;
    const currentIndex = currentConfig.steps.indexOf(currentStep);
    return currentIndex >= 0 ? (currentIndex / (currentConfig.steps.length - 1)) * 100 : 0;
  }, [currentConfig, currentStep]);

  // Memoized navigation state
  const navigationState = useMemo(() => {
    if (!currentConfig) {
      return { canGoBack: false, canAdvance: false };
    }
    const currentIndex = currentConfig.steps.indexOf(currentStep);
    return {
      canGoBack: currentIndex > 0,
      canAdvance: currentIndex < currentConfig.steps.length - 1
    };
  }, [currentConfig, currentStep]);

  // Stable callback functions
  const handleSetMode = useCallback((newMode: CreationMode) => {
    console.log('🎯 useUniversalCreator: Setting mode to', newMode);
    const config = MODE_CONFIGS.find(c => c.id === newMode);
    if (config) {
      setMode(newMode);
      // Move to first step after intent
      const nextStep = config.steps.length > 1 ? config.steps[1] : 'upload';
      setCurrentStep(nextStep);
      setErrors({});
      setCreationError(null);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (!currentConfig) {
      console.warn('⚠️ useUniversalCreator: Cannot advance - no config');
      return;
    }
    
    const currentIndex = currentConfig.steps.indexOf(currentStep);
    if (currentIndex < currentConfig.steps.length - 1) {
      const nextStep = currentConfig.steps[currentIndex + 1];
      console.log('➡️ useUniversalCreator: Moving to next step:', nextStep);
      setCurrentStep(nextStep);
      setErrors({});
    }
  }, [currentConfig, currentStep]);

  const previousStep = useCallback(() => {
    if (!currentConfig) {
      console.warn('⚠️ useUniversalCreator: Cannot go back - no config');
      return;
    }
    
    const currentIndex = currentConfig.steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = currentConfig.steps[currentIndex - 1];
      console.log('⬅️ useUniversalCreator: Moving to previous step:', prevStep);
      setCurrentStep(prevStep);
      setErrors({});
    }
  }, [currentConfig, currentStep]);

  const validateStep = useCallback(() => {
    if (!cardEditor?.cardData) {
      console.warn('⚠️ useUniversalCreator: No card data for validation');
      return false;
    }
    
    const { cardData } = cardEditor;
    
    switch (currentStep) {
      case 'intent':
        return true;
        
      case 'upload':
        const hasImage = !!cardData.image_url;
        if (!hasImage) {
          setErrors({ upload: 'Please upload an image to continue' });
        } else {
          setErrors({});
        }
        return hasImage;
        
      case 'details':
        const hasTitle = cardData.title && cardData.title.trim().length > 0;
        const titleValid = hasTitle && cardData.title !== 'My New Card';
        if (!titleValid) {
          setErrors({ details: 'Please provide a meaningful title for your card' });
        } else {
          setErrors({});
        }
        return titleValid;
        
      case 'design':
      case 'publish':
      default:
        return true;
    }
  }, [currentStep, cardEditor?.cardData]);

  const completeCreation = useCallback(async () => {
    console.log('🚀 useUniversalCreator: Starting card creation');
    setIsCreating(true);
    setCreationError(null);

    try {
      if (!cardEditor?.cardData) {
        throw new Error('No card data available');
      }

      // Ensure we have the required data
      if (!cardEditor.cardData.image_url) {
        throw new Error('Card must have an image');
      }

      if (!cardEditor.cardData.title || cardEditor.cardData.title.trim() === '' || cardEditor.cardData.title === 'My New Card') {
        throw new Error('Card must have a meaningful title');
      }

      // Save the card
      const success = await cardEditor.saveCard();
      
      if (success) {
        setCurrentStep('complete');
        
        if (onCompleteRef.current) {
          onCompleteRef.current(cardEditor.cardData);
        }
        
        console.log('✅ useUniversalCreator: Card created successfully');
      } else {
        throw new Error('Failed to save card');
      }
    } catch (error) {
      console.error('❌ useUniversalCreator: Error creating card:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create card';
      setCreationError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, [cardEditor]);

  const goToGallery = useCallback(() => {
    console.log('🏠 useUniversalCreator: Navigating to gallery');
    navigate('/gallery');
  }, [navigate]);

  const startOver = useCallback(() => {
    console.log('🔄 useUniversalCreator: Starting over');
    if (!cardEditor) {
      console.warn('⚠️ useUniversalCreator: No card editor for reset');
      return;
    }
    
    // Reset card data to initial state
    cardEditor.updateCardField('title', 'My New Card');
    cardEditor.updateCardField('description', '');
    cardEditor.updateCardField('image_url', undefined);
    cardEditor.updateCardField('thumbnail_url', undefined);
    
    // Reset UI state
    setMode(initialMode);
    setCurrentStep('intent');
    setCreationError(null);
    setErrors({});
    setIsCreating(false);
  }, [cardEditor, initialMode]);

  const updateState = useCallback((updates: Partial<{ currentStep: CreationStep; errors: Record<string, string> }>) => {
    console.log('🔄 useUniversalCreator: State update:', updates);
    if (updates.currentStep) setCurrentStep(updates.currentStep);
    if (updates.errors) setErrors(updates.errors);
  }, []);

  // Stable state object
  const state = useMemo(() => ({
    mode,
    currentStep,
    intent: { mode },
    canAdvance: navigationState.canAdvance,
    canGoBack: navigationState.canGoBack,
    progress,
    errors,
    isCreating,
    creationError,
    isInitializing: false
  }), [mode, currentStep, navigationState, progress, errors, isCreating, creationError]);

  console.log('✅ useUniversalCreator: Hook setup complete, current step:', currentStep);

  return {
    state,
    cardEditor,
    modeConfigs: MODE_CONFIGS,
    currentConfig,
    actions: {
      setMode: handleSetMode,
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
