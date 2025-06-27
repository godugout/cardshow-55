
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AdvancedCropper } from '../AdvancedCropper';
import { BulkUploadOption } from '../BulkUploadOption';
import { PhotoPreview } from './components/PhotoPreview';
import { UploadActions } from './components/UploadActions';
import { ReadySection } from './components/ReadySection';
import { AnalysisReviewPrompt } from './components/AnalysisReviewPrompt';
import { usePhotoUpload } from './hooks/usePhotoUpload';

interface PhotoUploadStepProps {
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
  onBulkUpload?: () => void;
}

export const PhotoUploadStep = ({ 
  selectedPhoto, 
  onPhotoSelect, 
  onAnalysisComplete, 
  onBulkUpload 
}: PhotoUploadStepProps) => {
  const [showAdvancedCrop, setShowAdvancedCrop] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  const { isAnalyzing, imageDetails, handleFileUpload } = usePhotoUpload(
    onPhotoSelect, 
    (analysis) => {
      setAnalysisResult(analysis);
      onAnalysisComplete?.(analysis);
    }
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setAnalysisResult(null);
      setShowManualEntry(false);
      await handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAnalysisResult(null);
      setShowManualEntry(false);
      await handleFileUpload(file);
    }
    event.target.value = '';
  };

  const handleAdvancedCropComplete = (crops: { main?: string; frame?: string; elements?: string[] }) => {
    if (crops.main) {
      onPhotoSelect(crops.main);
      toast.success('Advanced crop applied to card!');
      // Re-analyze the cropped image
      setAnalysisResult(null);
      handleFileUpload(new File([crops.main], 'cropped.jpg'));
    }
    setShowAdvancedCrop(false);
  };

  const handleRetryAnalysis = async () => {
    if (selectedPhoto) {
      setAnalysisResult(null);
      // Create a mock file from the selected photo for re-analysis
      try {
        const response = await fetch(selectedPhoto);
        const blob = await response.blob();
        const file = new File([blob], 'retry.jpg');
        await handleFileUpload(file);
      } catch (error) {
        toast.error('Failed to retry analysis');
      }
    }
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
    // Clear analysis result to allow manual input
    const manualAnalysis = {
      title: null,
      description: null,
      rarity: null,
      confidence: 0,
      requiresManualReview: true,
      message: 'Manual entry mode activated'
    };
    setAnalysisResult(manualAnalysis);
    onAnalysisComplete?.(manualAnalysis);
  };

  const handleProceedAnyway = () => {
    if (analysisResult) {
      toast.info('Proceeding with current analysis results');
      onAnalysisComplete?.(analysisResult);
    }
  };

  // Show advanced cropper if active
  if (showAdvancedCrop && selectedPhoto) {
    return (
      <div className="h-[600px]">
        <AdvancedCropper
          imageUrl={selectedPhoto}
          onCropComplete={handleAdvancedCropComplete}
          onCancel={() => setShowAdvancedCrop(false)}
          aspectRatio={2.5 / 3.5}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isAnalyzing && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-crd-green">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">AI is analyzing your image with multiple methods...</span>
          </div>
        </div>
      )}
      
      <PhotoPreview selectedPhoto={selectedPhoto} imageDetails={imageDetails} />

      {/* Show analysis review prompt if analysis completed with issues */}
      {analysisResult && (analysisResult.requiresManualReview || analysisResult.error || analysisResult.confidence < 0.5) && (
        <AnalysisReviewPrompt
          confidence={analysisResult.confidence || 0}
          detectionMethod={analysisResult.detectionMethod || 'unknown'}
          requiresManualReview={analysisResult.requiresManualReview}
          error={analysisResult.error}
          message={analysisResult.message}
          onRetryAnalysis={handleRetryAnalysis}
          onManualEntry={handleManualEntry}
          onProceedAnyway={analysisResult.confidence > 0.2 ? handleProceedAnyway : undefined}
        />
      )}

      <UploadActions
        selectedPhoto={selectedPhoto}
        isAnalyzing={isAnalyzing}
        onChooseFile={() => document.getElementById('photo-input')?.click()}
        onAdvancedCrop={() => setShowAdvancedCrop(true)}
      />

      {/* Bulk Upload Option - Secondary placement */}
      {onBulkUpload && (
        <div className="mb-8">
          <BulkUploadOption onSelectBulkUpload={onBulkUpload} />
        </div>
      )}

      <ReadySection 
        selectedPhoto={selectedPhoto} 
        isAnalyzing={isAnalyzing}
        analysisComplete={!!analysisResult}
        analysisSuccessful={analysisResult && !analysisResult.error && !analysisResult.requiresManualReview}
      />

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </div>
  );
};
