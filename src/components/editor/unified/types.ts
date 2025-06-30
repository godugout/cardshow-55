
export type CreationMode = 'quick' | 'guided' | 'advanced' | 'bulk';

export type CreationStep = 'intent' | 'upload' | 'details' | 'design' | 'publish' | 'complete';

// Simplified WorkflowStep - most users will only see 'upload' (combined with template selection)
export type WorkflowStep = 'upload' | 'psd-manager' | 'batch-processing';

export interface CreationIntent {
  mode: CreationMode;
  description?: string;
  goals?: string[];
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
}

export interface ModeConfig {
  id: CreationMode;
  title: string;
  description: string;
  icon: string;
  steps: CreationStep[];
  features: string[];
}
