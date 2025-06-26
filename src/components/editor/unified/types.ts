
export type CreationMode = 'quick' | 'guided' | 'advanced' | 'bulk';

export type CreationStep = 
  | 'intent'
  | 'upload'
  | 'details'
  | 'design'
  | 'publish'
  | 'complete';

export interface CreationIntent {
  mode: CreationMode;
  preferences?: {
    skipTutorial?: boolean;
    defaultTemplate?: string;
    autoPublish?: boolean;
  };
}

export interface CreationState {
  mode: CreationMode;
  currentStep: CreationStep;
  intent: CreationIntent;
  canAdvance: boolean;
  canGoBack: boolean;
  progress: number;
  errors: Record<string, string>;
  isCreating?: boolean;
  creationError?: string | null;
  isInitializing?: boolean;
}

export interface ModeConfig {
  id: CreationMode;
  title: string;
  description: string;
  icon: string;
  steps: CreationStep[];
  features: string[];
}
