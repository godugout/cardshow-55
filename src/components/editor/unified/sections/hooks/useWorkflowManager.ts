
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { WorkflowStep } from '../../types';
import type { UnifiedAnalysisResult } from '@/services/imageAnalysis/unifiedCardAnalyzer';

interface WorkflowManagerState {
  currentStep: WorkflowStep;
  selectedMediaPath: string;
  selectedTemplate: string | null;
  mediaDetection: any;
  imageAnalysis: UnifiedAnalysisResult | null;
  generatedTemplate: any;
  showPSDManager: boolean;
  showAITools: boolean;
  workflowActivated: boolean;
  originalFile: File | null;
}

export const useWorkflowManager = (cardEditor: any) => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<WorkflowManagerState>({
    currentStep: 'upload',
    selectedMediaPath: '',
    selectedTemplate: null,
    mediaDetection: null,
    imageAnalysis: null,
    generatedTemplate: null,
    showPSDManager: false,
    showAITools: false,
    workflowActivated: false,
    originalFile: null
  });

  // Enhanced workflow activation with visual feedback
  useEffect(() => {
    const source = searchParams.get('source');
    const workflow = searchParams.get('workflow');
    
    if (source === 'crdmkr' && workflow && !state.workflowActivated) {
      console.log('🎯 Activating CRDMKR workflow:', workflow);
      setState(prev => ({ ...prev, workflowActivated: true }));
      
      // Set workflow metadata
      cardEditor.updateDesignMetadata('workflowSource', 'crdmkr');
      cardEditor.updateDesignMetadata('workflowType', workflow);
      
      // Handle different workflow types
      switch (workflow) {
        case 'psd-professional':
          setState(prev => ({ ...prev, selectedMediaPath: 'psd-professional' }));
          toast.success('🎨 PSD Professional workflow activated!', {
            description: 'Upload your PSD file to begin professional layer extraction'
          });
          break;
          
        case 'batch-processing':
          setState(prev => ({ 
            ...prev, 
            selectedMediaPath: 'batch-processing',
            currentStep: 'batch-processing'
          }));
          toast.success('⚡ Batch Processing workflow activated!', {
            description: 'Upload multiple images for efficient batch card creation'
          });
          break;
          
        case 'smart-upload':
          setState(prev => ({ ...prev, selectedMediaPath: 'smart-upload' }));
          toast.success('🤖 Smart Upload workflow activated!', {
            description: 'AI-powered image analysis and template selection'
          });
          break;
          
        case 'crd-frame-generator':
          setState(prev => ({ ...prev, selectedMediaPath: 'crd-frame-generator' }));
          toast.success('🖼️ CRD Frame Generator activated!', {
            description: 'Create custom frames from your designs'
          });
          break;
          
        default:
          console.log('🎯 Unknown workflow type:', workflow);
          toast.info(`${workflow} workflow activated`);
      }
    }
  }, [searchParams, cardEditor, state.workflowActivated]);

  const updateState = useCallback((updates: Partial<WorkflowManagerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const validateCurrentStep = useCallback(() => {
    console.log('🔍 Validating step:', state.currentStep, {
      hasImage: !!cardEditor.cardData.image_url,
      selectedMediaPath: state.selectedMediaPath,
      selectedTemplate: state.selectedTemplate,
      generatedTemplate: state.generatedTemplate,
      workflowActivated: state.workflowActivated
    });

    switch (state.currentStep) {
      case 'upload':
        return !!cardEditor.cardData.image_url;
      
      case 'combined-selection':
        // Require both path and template selection for standard workflows
        const hasPath = !!state.selectedMediaPath;
        const isStandardPath = ['standard-card', 'interactive-card', 'quick-frame'].includes(state.selectedMediaPath);
        const hasTemplate = !!state.selectedTemplate;
        
        if (isStandardPath) {
          return hasPath && hasTemplate && !!cardEditor.cardData.image_url;
        }
        return hasPath && !!cardEditor.cardData.image_url;
      
      case 'psd-manager':
        return !!state.generatedTemplate || state.showAITools;
      
      case 'batch-processing':
        return !!cardEditor.cardData.image_url;
      
      default:
        return false;
    }
  }, [state, cardEditor]);

  return {
    state,
    updateState,
    validateCurrentStep,
    searchParams
  };
};
