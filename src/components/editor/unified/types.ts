
export type CreationMode = 'quick' | 'guided' | 'advanced' | 'bulk';
export type CreationStep = 'intent' | 'upload' | 'details' | 'design' | 'publish' | 'complete';

export interface CreationIntent {
  mode: CreationMode;
  description?: string;
}

export interface ModeConfig {
  id: CreationMode;
  title: string;
  description: string;
  icon: string;
  steps: CreationStep[];
  features: string[];
}

export interface CreationState {
  mode: CreationMode;
  currentStep: CreationStep;
  intent: CreationIntent;
  canAdvance: boolean;
  canGoBack: boolean;
  progress: number;
  errors: Record<string, string>;
}
