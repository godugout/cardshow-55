
import { useState, useCallback } from 'react';
import type { CreationMode, CreationStep } from '../types';

interface SimpleCreatorState {
  mode: CreationMode;
  currentStep: CreationStep;
  progress: number;
  canGoBack: boolean;
  canAdvance: boolean;
}

const MODE_CONFIGS = {
  quick: {
    id: 'quick' as CreationMode,
    title: 'Quick Create',
    description: 'Simple form-based card creation',
    icon: 'Zap',
    steps: ['intent', 'upload', 'details', 'publish', 'complete'] as CreationStep[],
    features: ['AI assistance', 'Smart defaults', 'One-click publish']
  },
  guided: {
    id: 'guided' as CreationMode,
    title: 'Guided Create',
    description: 'Step-by-step wizard with help',
    icon: 'Navigation',
    steps: ['intent', 'upload', 'details', 'design', 'publish', 'complete'] as CreationStep[],
    features: ['Progressive guidance', 'Templates', 'Live preview']
  },
  advanced: {
    id: 'advanced' as CreationMode,
    title: 'Advanced Create',
    description: 'Full editor with all features',
    icon: 'Settings',
    steps: ['intent', 'upload', 'design', 'details', 'publish', 'complete'] as CreationStep[],
    features: ['Advanced cropping', 'Custom effects', 'Collaboration']
  },
  bulk: {
    id: 'bulk' as CreationMode,
    title: 'Bulk Create',
    description: 'Create multiple cards at once',
    icon: 'Copy',
    steps: ['intent', 'upload', 'details', 'publish', 'complete'] as CreationStep[],
    features: ['Batch processing', 'Template application']
  }
};

export const useSimpleCreator = (initialMode: CreationMode = 'quick') => {
  const [state, setState] = useState<SimpleCreatorState>({
    mode: initialMode,
    currentStep: 'intent',
    progress: 0,
    canGoBack: false,
    canAdvance: true
  });

  const currentConfig = MODE_CONFIGS[state.mode];
  const currentIndex = currentConfig.steps.indexOf(state.currentStep);

  const setMode = useCallback((mode: CreationMode) => {
    console.log('🎯 useSimpleCreator: Setting mode to', mode);
    const config = MODE_CONFIGS[mode];
    setState({
      mode,
      currentStep: config.steps[1], // Skip intent, go to upload
      progress: (1 / (config.steps.length - 1)) * 100,
      canGoBack: false,
      canAdvance: true
    });
  }, []);

  const nextStep = useCallback(() => {
    const config = MODE_CONFIGS[state.mode];
    const currentIndex = config.steps.indexOf(state.currentStep);
    
    if (currentIndex < config.steps.length - 1) {
      const nextStep = config.steps[currentIndex + 1];
      console.log('➡️ useSimpleCreator: Moving to next step:', nextStep);
      
      setState(prev => ({
        ...prev,
        currentStep: nextStep,
        progress: ((currentIndex + 1) / (config.steps.length - 1)) * 100,
        canGoBack: currentIndex + 1 > 1,
        canAdvance: currentIndex + 1 < config.steps.length - 1
      }));
    }
  }, [state.mode, state.currentStep]);

  const previousStep = useCallback(() => {
    const config = MODE_CONFIGS[state.mode];
    const currentIndex = config.steps.indexOf(state.currentStep);
    
    if (currentIndex > 1) { // Can't go back to intent
      const prevStep = config.steps[currentIndex - 1];
      console.log('⬅️ useSimpleCreator: Moving to previous step:', prevStep);
      
      setState(prev => ({
        ...prev,
        currentStep: prevStep,
        progress: ((currentIndex - 1) / (config.steps.length - 1)) * 100,
        canGoBack: currentIndex - 1 > 1,
        canAdvance: true
      }));
    }
  }, [state.mode, state.currentStep]);

  const validateStep = useCallback(() => {
    // Always return true - no validation dependencies
    return true;
  }, []);

  const completeCreation = useCallback(() => {
    console.log('🚀 useSimpleCreator: Completing creation');
    setState(prev => ({
      ...prev,
      currentStep: 'complete',
      progress: 100,
      canGoBack: false,
      canAdvance: false
    }));
  }, []);

  const goToGallery = useCallback(() => {
    console.log('🏠 useSimpleCreator: Going to gallery');
    // Simple navigation without router dependencies
    window.location.href = '/gallery';
  }, []);

  const startOver = useCallback(() => {
    console.log('🔄 useSimpleCreator: Starting over');
    setState({
      mode: initialMode,
      currentStep: 'intent',
      progress: 0,
      canGoBack: false,
      canAdvance: true
    });
  }, [initialMode]);

  return {
    state,
    currentConfig,
    modeConfigs: Object.values(MODE_CONFIGS),
    actions: {
      setMode,
      nextStep,
      previousStep,
      validateStep,
      completeCreation,
      goToGallery,
      startOver
    }
  };
};
