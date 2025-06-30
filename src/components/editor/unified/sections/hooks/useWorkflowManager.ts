
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { WorkflowStep } from '../../types';
import type { UnifiedAnalysisResult } from '@/services/imageAnalysis/unifiedCardAnalyzer';

interface SimplifiedWorkflowState {
  currentStep: WorkflowStep;
  selectedTemplate: string | null;
  imageAnalysis: UnifiedAnalysisResult | null;
  generatedTemplate: any;
  showPSDManager: boolean;
  workflowActivated: boolean;
  originalFile: File | null;
}

export const useWorkflowManager = (cardEditor: any) => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<SimplifiedWorkflowState>({
    currentStep: 'upload',
    selectedTemplate: null,
    imageAnalysis: null,
    generatedTemplate: null,
    showPSDManager: false,
    workflowActivated: false,
    originalFile: null
  });

  // Handle special workflow activation (PSD, batch, etc.)
  useEffect(() => {
    const source = searchParams.get('source');
    const workflow = searchParams.get('workflow');
    
    if (source === 'crdmkr' && workflow && !state.workflowActivated) {
      console.log('🎯 Activating CRDMKR workflow:', workflow);
      setState(prev => ({ ...prev, workflowActivated: true }));
      
      cardEditor.updateDesignMetadata('workflowSource', 'crdmkr');
      cardEditor.updateDesignMetadata('workflowType', workflow);
      
      switch (workflow) {
        case 'psd-professional':
          toast.success('🎨 PSD Professional workflow activated!', {
            description: 'Upload your PSD file to begin professional layer extraction'
          });
          break;
          
        case 'batch-processing':
          setState(prev => ({ ...prev, currentStep: 'batch-processing' }));
          toast.success('⚡ Batch Processing workflow activated!', {
            description: 'Upload multiple images for efficient batch card creation'
          });
          break;
          
        default:
          toast.info(`${workflow} workflow activated`);
      }
    }
  }, [searchParams, cardEditor, state.workflowActivated]);

  const updateState = useCallback((updates: Partial<SimplifiedWorkflowState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const validateCurrentStep = useCallback(() => {
    const hasImage = !!cardEditor.cardData.image_url;
    const hasTemplate = !!state.selectedTemplate;

    console.log('🔍 Validating step:', state.currentStep, {
      hasImage,
      selectedTemplate: state.selectedTemplate,
      generatedTemplate: state.generatedTemplate
    });

    switch (state.currentStep) {
      case 'upload':
        // For simplified workflow, we need both image and template
        return hasImage && hasTemplate;
      
      case 'psd-manager':
        return !!state.generatedTemplate;
      
      case 'batch-processing':
        return hasImage;
      
      default:
        return hasImage;
    }
  }, [state, cardEditor]);

  return {
    state,
    updateState,
    validateCurrentStep,
    searchParams
  };
};
