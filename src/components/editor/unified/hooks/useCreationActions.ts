
import { useCallback } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import type { CreationState, CreationStep } from '../types';
import type { CardData } from '@/hooks/useCardEditor';

interface UseCreationActionsProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const useCreationActions = ({
  state,
  updateState,
  onComplete,
  onCancel
}: UseCreationActionsProps) => {
  const cardEditor = useCardEditor();

  const validateStep = useCallback((step: CreationStep): boolean => {
    switch (step) {
      case 'intent':
        return !!state.intent?.mode;
      case 'upload':
        return !!cardEditor.cardData.image_url;
      case 'details':
        return !!cardEditor.cardData.title;
      case 'design':
        return true; // Design step is always valid
      case 'publish':
        return !!cardEditor.cardData.title;
      case 'complete':
        return true;
      default:
        return false;
    }
  }, [state.intent, cardEditor.cardData]);

  const completeCreation = useCallback(async () => {
    try {
      updateState({ isCreating: true, creationError: null });
      
      // Save the card
      await cardEditor.saveCard();
      
      // Call completion callback
      if (onComplete) {
        onComplete(cardEditor.cardData);
      }
      
      updateState({ isCreating: false });
    } catch (error) {
      console.error('Creation error:', error);
      updateState({ 
        isCreating: false, 
        creationError: error instanceof Error ? error.message : 'Failed to create card'
      });
    }
  }, [cardEditor, onComplete, updateState]);

  const cancelCreation = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const startOver = useCallback(() => {
    cardEditor.resetCard();
    updateState({
      currentStep: 'intent',
      progress: 0,
      canGoBack: false,
      canAdvance: true,
      errors: {}
    });
  }, [cardEditor, updateState]);

  return {
    cardEditor,
    isCreating: state.isCreating || false,
    creationError: state.creationError || null,
    validateStep,
    completeCreation,
    cancelCreation,
    startOver
  };
};
