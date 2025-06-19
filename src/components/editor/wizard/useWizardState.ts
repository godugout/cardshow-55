
import { useState } from 'react';
import { toast } from 'sonner';
import { useCardEditor, CardData } from '@/hooks/useCardEditor';
import { ADAPTIVE_TEMPLATES, convertAdaptiveToDesignTemplate } from '@/data/adaptiveTemplates';
import type { WizardState, WizardHandlers } from './types';
import type { CardAnalysisResult } from '@/services/cardAnalyzer';

export const useWizardState = (onComplete: (cardData: CardData) => void) => {
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    selectedPhoto: '',
    selectedTemplate: null,
    aiAnalysisComplete: false
  });

  const { cardData, updateCardField, saveCard, isSaving } = useCardEditor({
    initialData: {
      creator_attribution: {
        creator_name: '',
        creator_id: '',
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: {
          currency: 'USD'
        },
        distribution: {
          limited_edition: false
        }
      }
    }
  });

  // Convert adaptive templates to design templates for compatibility
  const compatibleTemplates = ADAPTIVE_TEMPLATES.map(convertAdaptiveToDesignTemplate);

  const handlers: WizardHandlers = {
    handlePhotoSelect: (photo: string) => {
      setWizardState(prev => ({ ...prev, selectedPhoto: photo }));
      updateCardField('image_url', photo);
    },

    handleAiAnalysis: (analysis: CardAnalysisResult) => {
      updateCardField('title', analysis.title);
      updateCardField('description', analysis.description);
      // Map epic to legendary for database compatibility
      const mappedRarity = analysis.rarity === 'epic' ? 'legendary' : analysis.rarity;
      updateCardField('rarity', mappedRarity as any);
      updateCardField('tags', analysis.tags);
      updateCardField('type', analysis.type);
      updateCardField('series', analysis.series);
      
      setWizardState(prev => ({ ...prev, aiAnalysisComplete: true }));
      
      // Find template based on tags using adaptive templates
      const suggestedAdaptiveTemplate = ADAPTIVE_TEMPLATES.find(t => 
        analysis.tags.some(tag => t.tags.includes(tag))
      ) || ADAPTIVE_TEMPLATES[0];
      
      const suggestedTemplate = convertAdaptiveToDesignTemplate(suggestedAdaptiveTemplate);
      
      setWizardState(prev => ({ ...prev, selectedTemplate: suggestedTemplate }));
      updateCardField('template_id', suggestedTemplate.id);
      updateCardField('design_metadata', suggestedTemplate.template_data);
      
      toast.success('All fields pre-filled with AI suggestions!');
    },

    handleTemplateSelect: (template) => {
      setWizardState(prev => ({ ...prev, selectedTemplate: template }));
      updateCardField('template_id', template.id);
      updateCardField('design_metadata', template.template_data);
    },

    handleNext: (targetStep?: number) => {
      // Updated validation for 3-step flow
      if (wizardState.currentStep === 1 && !wizardState.selectedPhoto) {
        toast.error('Please upload a photo first');
        return;
      }
      if (wizardState.currentStep === 1 && !wizardState.selectedTemplate) {
        toast.error('Please select a template');
        return;
      }
      if (wizardState.currentStep === 3 && !cardData.title.trim()) {
        toast.error('Please enter a card title');
        return;
      }
      
      if (targetStep) {
        setWizardState(prev => ({ ...prev, currentStep: targetStep }));
      } else if (wizardState.currentStep === 1 && wizardState.aiAnalysisComplete && wizardState.selectedTemplate) {
        // Skip directly to step 3 if AI analysis is complete in quick mode
        setWizardState(prev => ({ ...prev, currentStep: 3 }));
      } else {
        // Normal progression: max step is now 3
        setWizardState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 3) }));
      }
    },

    handleBack: () => {
      setWizardState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
    },

    handleComplete: async () => {
      try {
        const success = await saveCard();
        if (success) {
          onComplete(cardData);
          toast.success('Card created successfully!');
        }
      } catch (error) {
        toast.error('Failed to create card');
      }
    },

    updatePublishingOptions: (updates) => {
      updateCardField('publishing_options', {
        ...cardData.publishing_options,
        ...updates
      });
    },

    updateCreatorAttribution: (updates) => {
      updateCardField('creator_attribution', {
        ...cardData.creator_attribution,
        ...updates
      });
    },

    updateCardField: updateCardField
  };

  return {
    wizardState,
    cardData,
    handlers,
    isSaving,
    templates: compatibleTemplates,
    updateCardField
  };
};
