
import React, { useState } from 'react';
import { MediaPathDetector } from './MediaPathDetector';
import { PSDLayerManager } from './PSDLayerManager';
import { CRDFrameGenerator } from '@/lib/crdmkr/crdFrameGenerator';
import { toast } from 'sonner';
import type { DesignTemplate } from '@/types/card';

interface PathSelectionStepProps {
  mediaDetection: any;
  selectedMediaPath: string;
  onPathSelect: (pathId: string) => void;
  originalFile?: File;
  userImage?: string;
  onTemplateGenerated?: (template: DesignTemplate) => void;
}

export const PathSelectionStep: React.FC<PathSelectionStepProps> = ({
  mediaDetection,
  selectedMediaPath,
  onPathSelect,
  originalFile,
  userImage,
  onTemplateGenerated
}) => {
  const [showPSDManager, setShowPSDManager] = useState(false);

  if (!mediaDetection) return null;

  const handlePathSelect = (pathId: string) => {
    if (pathId === 'psd-professional' && originalFile) {
      // Show PSD Layer Manager
      setShowPSDManager(true);
    } else {
      // Regular path selection
      onPathSelect(pathId);
    }
  };

  const handleFrameGenerated = async (frameData: any) => {
    try {
      console.log('🎯 Converting frame to template:', frameData);
      
      // Generate CRD template
      const template = await CRDFrameGenerator.generateTemplate(frameData);
      
      // Save template
      const saved = await CRDFrameGenerator.saveTemplate(template);
      
      if (saved) {
        // Notify parent component
        onTemplateGenerated?.(template);
        
        // Close PSD manager and continue with generated template
        setShowPSDManager(false);
        onPathSelect('psd-professional');
        
        toast.success('Custom CRD Frame created and ready to use!');
      } else {
        toast.error('Failed to save custom frame');
      }
    } catch (error) {
      console.error('❌ Error handling generated frame:', error);
      toast.error('Failed to process generated frame');
    }
  };

  const handleCancelPSDManager = () => {
    setShowPSDManager(false);
  };

  // Show PSD Layer Manager if PSD professional workflow is selected
  if (showPSDManager && originalFile) {
    return (
      <PSDLayerManager
        psdFile={originalFile}
        userImage={userImage}
        onFrameGenerated={handleFrameGenerated}
        onCancel={handleCancelPSDManager}
      />
    );
  }

  // Show regular path selection
  return (
    <MediaPathDetector
      detectedFormat={mediaDetection.format}
      fileSize={1024 * 1024} // Placeholder size
      fileName={mediaDetection.format}
      onPathSelect={handlePathSelect}
      selectedPath={selectedMediaPath}
    />
  );
};
