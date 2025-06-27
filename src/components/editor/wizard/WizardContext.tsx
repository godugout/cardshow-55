
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { CardData } from '@/hooks/useCardEditor';

export interface WizardStep {
  id: string;
  number: number;
  title: string;
  icon: string;
  completed: boolean;
  valid: boolean;
}

export interface WizardState {
  currentStepId: string;
  steps: WizardStep[];
  cardData: Partial<CardData>;
  isLoading: boolean;
  lastSaved: Date | null;
}

export type WizardAction =
  | { type: 'SET_CURRENT_STEP'; payload: string }
  | { type: 'UPDATE_CARD_DATA'; payload: Partial<CardData> }
  | { type: 'MARK_STEP_COMPLETED'; payload: string }
  | { type: 'SET_STEP_VALIDITY'; payload: { stepId: string; valid: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESTORE_FROM_STORAGE'; payload: WizardState }
  | { type: 'MARK_SAVED' };

const WIZARD_STEPS: WizardStep[] = [
  { id: 'template', number: 1, title: 'Template Selection', icon: 'Layout', completed: false, valid: false },
  { id: 'upload', number: 2, title: 'Photo Upload', icon: 'Upload', completed: false, valid: false },
  { id: 'details', number: 3, title: 'Card Details', icon: 'Edit', completed: false, valid: false },
  { id: 'effects', number: 4, title: 'Visual Effects', icon: 'Sparkles', completed: false, valid: true },
  { id: 'publish', number: 5, title: 'Preview & Publish', icon: 'Check', completed: false, valid: false }
];

const initialState: WizardState = {
  currentStepId: 'template',
  steps: WIZARD_STEPS,
  cardData: {
    title: '',
    description: '',
    image_url: undefined,
    template_id: undefined,
    rarity: 'common',
    tags: [],
    type: 'character',
    series: ''
  },
  isLoading: false,
  lastSaved: null
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStepId: action.payload };
    
    case 'UPDATE_CARD_DATA':
      return { 
        ...state, 
        cardData: { ...state.cardData, ...action.payload }
      };
    
    case 'MARK_STEP_COMPLETED':
      return {
        ...state,
        steps: state.steps.map(step =>
          step.id === action.payload ? { ...step, completed: true } : step
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
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'RESTORE_FROM_STORAGE':
      return action.payload;
    
    case 'MARK_SAVED':
      return { ...state, lastSaved: new Date() };
    
    default:
      return state;
  }
}

interface WizardContextType {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

const WizardContext = createContext<WizardContextType | null>(null);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  // Throttled auto-save functionality
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const saveState = () => {
      if (state.cardData && Object.keys(state.cardData).length > 0) {
        localStorage.setItem('cardshow-wizard-state', JSON.stringify(state));
        dispatch({ type: 'MARK_SAVED' });
      }
    };

    // Debounce saves to prevent too frequent localStorage writes
    timeoutId = setTimeout(saveState, 1000);

    return () => clearTimeout(timeoutId);
  }, [state.cardData]);

  // Restore from localStorage on mount (only once)
  useEffect(() => {
    const savedState = localStorage.getItem('cardshow-wizard-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Only restore if it's a valid state
        if (parsedState.currentStepId && parsedState.steps) {
          dispatch({ type: 'RESTORE_FROM_STORAGE', payload: parsedState });
        }
      } catch (error) {
        console.error('Failed to restore wizard state:', error);
      }
    }
  }, []); // Empty dependency array - run only once

  const contextValue = React.useMemo(() => ({
    state,
    dispatch
  }), [state, dispatch]);

  return (
    <WizardContext.Provider value={contextValue}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within WizardProvider');
  }
  return context;
};
