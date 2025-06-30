
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface TemplateAwareCroppingState {
  showTemplateAwareCropper: boolean;
  selectedTemplate: any;
  cropResults: { main?: string; frame?: string; elements?: string[]; };
}

export const useTemplateAwareCropping = () => {
  const [state, setState] = useState<TemplateAwareCroppingState>({
    showTemplateAwareCropper: false,
    selectedTemplate: null,
    cropResults: {}
  });

  const openTemplateAwareCropper = useCallback((template: any) => {
    setState(prev => ({
      ...prev,
      showTemplateAwareCropper: true,
      selectedTemplate: template
    }));
  }, []);

  const closeTemplateAwareCropper = useCallback(() => {
    setState(prev => ({
      ...prev,
      showTemplateAwareCropper: false,
      selectedTemplate: null
    }));
  }, []);

  const handleCropComplete = useCallback((crops: { main?: string; frame?: string; elements?: string[]; }) => {
    setState(prev => ({
      ...prev,
      cropResults: crops,
      showTemplateAwareCropper: false
    }));
    
    const cropCount = [crops.main, crops.frame, ...(crops.elements || [])].filter(Boolean).length;
    toast.success(`${cropCount} crops extracted successfully!`);
  }, []);

  const resetCropping = useCallback(() => {
    setState({
      showTemplateAwareCropper: false,
      selectedTemplate: null,
      cropResults: {}
    });
  }, []);

  return {
    ...state,
    openTemplateAwareCropper,
    closeTemplateAwareCropper,
    handleCropComplete,
    resetCropping
  };
};
