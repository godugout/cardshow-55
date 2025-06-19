
import type { CardAnalysisResult } from '@/services/cardAnalyzer';
import type { CardData, PublishingOptions, CreatorAttribution } from '@/types/card';
import type { DesignTemplate } from '@/hooks/useCardEditor';

export interface WizardStep {
  number: number;
  title: string;
  description: string;
}

export interface WizardState {
  currentStep: number;
  selectedPhoto: string;
  selectedTemplate: DesignTemplate | null;
  aiAnalysisComplete: boolean;
}

export interface WizardHandlers {
  handlePhotoSelect: (photo: string) => void;
  handleAiAnalysis: (analysis: CardAnalysisResult) => void;
  handleTemplateSelect: (template: DesignTemplate) => void;
  handleNext: (targetStep?: number) => void;
  handleBack: () => void;
  handleComplete: () => Promise<void>;
  updatePublishingOptions: (updates: Partial<PublishingOptions>) => void;
  updateCreatorAttribution: (updates: Partial<CreatorAttribution>) => void;
  updateCardField: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
}

export interface EnhancedCardWizardProps {
  onComplete: (cardData: CardData) => void;
  onCancel: () => void;
}
