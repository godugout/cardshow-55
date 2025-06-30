
export type CreationMode = 'quick' | 'guided' | 'advanced' | 'bulk';

export type CreationStep = 'intent' | 'upload' | 'details' | 'design' | 'publish' | 'complete';

// Updated WorkflowStep to include batch-processing and combined-selection
export type WorkflowStep = 'upload' | 'path-selection' | 'template-selection' | 'psd-manager' | 'batch-processing' | 'combined-selection';

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
