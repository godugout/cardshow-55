
export type CreationMode = 'quick' | 'guided' | 'advanced' | 'bulk';

export type CreationStep = 
  | 'intent'      // Choose creation mode
  | 'upload'      // Photo upload and processing
  | 'details'     // Card information
  | 'design'      // Visual customization
  | 'publish'     // Publishing options
  | 'complete';   // Finalization

export interface CreationIntent {
  mode: CreationMode;
  cardType?: 'standard' | 'sports' | 'gaming' | 'art' | 'custom';
  complexity?: 'simple' | 'advanced';
  hasImage?: boolean;
  isBulk?: boolean;
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

export interface ModeConfig {
  id: CreationMode;
  title: string;
  description: string;
  icon: string;
  steps: CreationStep[];
  features: string[];
}
