
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowRight } from 'lucide-react';

import { PhotoDropzone } from './components/PhotoDropzone';
import { PhotoPreview } from './components/PhotoPreview';
import { UploadProgress } from './components/UploadProgress';
import { AIToolsPanel } from './components/AIToolsPanel';

interface PhotoUploadSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onNext: () => void;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  cardEditor,
  onNext
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAITools, setShowAITools] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);

  const processFile = useCallback(async (file: File) => {
    console.log('📁 Processing file:', file.name);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create object URL for preview  
      const imageUrl = URL.createObjectURL(file);
      cardEditor.updateCardField('image_url', imageUrl);

      // Simulate AI analysis
      setTimeout(() => {
        setImageAnalysis({
          dominantColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
          suggestedRarity: 'rare',
          contentType: 'character',
          tags: ['fantasy', 'magical', 'warrior'],
          quality: 95,
          detectedText: file.name.includes('card') ? 'Trading Card Detected' : null,
          suggestedTemplate: 'classic-gold'
        });
        setUploadProgress(100);
        setShowAITools(true);
        clearInterval(progressInterval);
        toast.success('Image uploaded and analyzed!');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsProcessing(false);
    }
  }, [cardEditor]);

  const handleAIEnhance = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Image enhanced with AI!');
    }, 1500);
  };

  const handleCreateFromPSD = () => {
    // This will be handled by AIToolsPanel
  };

  const canProceed = cardEditor.cardData.image_url && !isProcessing;

  return (
    <div className="space-y-6 relative z-10">
      <div className="space-y-4">
        <div className="relative">
          {isProcessing ? (
            <div className="border-2 border-dashed border-crd-green/50 rounded-xl p-6 text-center min-h-[280px] flex flex-col items-center justify-center">
              <UploadProgress progress={uploadProgress} />
            </div>
          ) : cardEditor.cardData.image_url ? (
            <div className="border-2 border-dashed border-crd-green rounded-xl p-6 text-center bg-crd-green/5 min-h-[280px] flex flex-col items-center justify-center">
              <PhotoPreview 
                imageUrl={cardEditor.cardData.image_url}
                onReplace={() => processFile}
              />
            </div>
          ) : (
            <PhotoDropzone 
              onFileSelect={processFile}
              disabled={isProcessing}
            />
          )}
        </div>

        {showAITools && cardEditor.cardData.image_url && (
          <AIToolsPanel
            analysisData={imageAnalysis}
            onEnhance={handleAIEnhance}
            onCreateFromPSD={handleCreateFromPSD}
          />
        )}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-crd-mediumGray/20">
        <div className="text-sm text-crd-lightGray">
          Step 1 of 5 - Upload complete
        </div>
        
        <CRDButton 
          onClick={onNext} 
          disabled={!canProceed}
          className="min-w-[120px] bg-crd-green hover:bg-crd-green/90 text-black"
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </CRDButton>
      </div>
    </div>
  );
};
