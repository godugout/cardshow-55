
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';
import type { CreationState } from '../types';

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
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const cardEditor = useCardEditor({
    autoSave: true,
    autoSaveInterval: 30000
  });

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
    setIsCreating(true);
    setCreationError(null);

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
      setCreationError(errorMessage);
      toast.error('Failed to create card', {
        description: errorMessage
      });
    } finally {
      setIsCreating(false);
    }
  }, [cardEditor, onComplete, updateState]);

  const cancelCreation = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/gallery');
    }
  }, [onCancel, navigate]);

  const startOver = useCallback(() => {
    updateState({
      currentStep: 'intent',
      mode: 'quick',
      progress: 0,
      canGoBack: false,
      canAdvance: false
    });
    setCreationError(null);
    cardEditor.updateCardField('title', 'My New Card');
    cardEditor.updateCardField('description', '');
    cardEditor.updateCardField('image_url', undefined);
  }, [updateState, cardEditor]);

  return {
    cardEditor,
    isCreating,
    creationError,
    validateStep,
    completeCreation,
    cancelCreation,
    startOver
  };
};
