
export type CreationMode = 'quick' | 'guided' | 'advanced';
export type CreationStep = 'intent' | 'upload' | 'details' | 'design' | 'publish' | 'complete';

export interface ModeConfig {
  steps: CreationStep[];
  title: string;
}

export interface CreationState {
  currentStep: CreationStep;
  errors: Record<string, string>;
}
