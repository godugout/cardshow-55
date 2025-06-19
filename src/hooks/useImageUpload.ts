
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ImageProcessor, type ProcessedImageResult } from '@/lib/imageProcessor';
import { analyzeCardImage, type CardAnalysis } from '@/services/cardAnalyzer';
import { useFileUpload } from './useFileUpload';

export interface ImageUploadOptions {
  enableAnalysis?: boolean;
  bucket?: 'card-images' | 'user-uploads';
  folder?: string;
  processingOptions?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  };
  onSuccess?: (result: ProcessedImageResult) => void;
  onAnalysisComplete?: (analysis: CardAnalysis) => void;
  onError?: (error: string) => void;
}

export interface ImageUploadState {
  isProcessing: boolean;
  isAnalyzing: boolean;
  processedImage: ProcessedImageResult | null;
  analysis: CardAnalysis | null;
  error: string | null;
}

export const useImageUpload = (options: ImageUploadOptions = {}) => {
  const {
    enableAnalysis = false,
    bucket = 'card-images',
    folder = 'uploads',
    processingOptions = {},
    onSuccess,
    onAnalysisComplete,
    onError
  } = options;

  const [state, setState] = useState<ImageUploadState>({
    isProcessing: false,
    isAnalyzing: false,
    processedImage: null,
    analysis: null,
    error: null
  });

  const fileUpload = useFileUpload({
    bucket,
    folder,
    generateThumbnail: true,
    onSuccess: (uploadResult) => {
      console.log('✅ File uploaded to storage:', uploadResult);
    },
    onError: (error) => {
      console.error('❌ Upload to storage failed:', error);
      onError?.(error);
    }
  });

  const uploadImage = useCallback(async (file: File) => {
    console.log('🚀 useImageUpload.uploadImage called:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      enableAnalysis,
      bucket,
      folder
    });
    
    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
      processedImage: null,
      analysis: null
    }));

    try {
      console.log('📋 Starting image processing...');
      const processingToast = toast.loading('Processing image...', {
        description: 'Reading and optimizing your image'
      });

      // Process image with simplified approach
      console.log('🔄 Starting simplified image processing...');
      const result = await ImageProcessor.processFile(file, {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.9,
        format: 'jpeg',
        ...processingOptions
      });

      console.log('✅ Image processing completed successfully:', {
        dimensions: result.dimensions,
        fileSize: result.fileSize,
        dataUrlLength: result.dataUrl.length
      });

      setState(prev => ({
        ...prev,
        isProcessing: false,
        processedImage: result
      }));

      toast.dismiss(processingToast);
      toast.success('Image processed successfully!');
      onSuccess?.(result);

      // Upload to Supabase storage
      try {
        const uploadFile = new File([result.blob], file.name, { type: file.type });
        await fileUpload.uploadFile(uploadFile);
      } catch (uploadError) {
        console.error('Upload error (non-blocking):', uploadError);
      }

      // Optional AI analysis
      if (enableAnalysis && onAnalysisComplete) {
        console.log('🤖 Starting AI analysis...');
        setState(prev => ({ ...prev, isAnalyzing: true }));
        
        const analysisToast = toast.loading('Analyzing image with AI...', {
          description: 'Generating card details from your image'
        });

        try {
          const analysis = await analyzeCardImage(file);
          console.log('✅ AI analysis completed:', analysis);
          
          setState(prev => ({
            ...prev,
            isAnalyzing: false,
            analysis
          }));

          toast.dismiss(analysisToast);
          toast.success('AI analysis complete!', {
            description: 'Card details have been generated'
          });
          onAnalysisComplete(analysis);
        } catch (analysisError) {
          console.error('❌ AI analysis failed:', analysisError);
          setState(prev => ({
            ...prev,
            isAnalyzing: false,
            error: 'AI analysis failed, but image upload succeeded'
          }));
          
          toast.dismiss(analysisToast);
          toast.warning('AI analysis failed', {
            description: 'Image uploaded successfully, but analysis could not be completed'
          });
        }
      }

    } catch (error) {
      console.error('❌ Image upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Image processing failed';
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        isAnalyzing: false,
        error: errorMessage
      }));

      toast.error('Image upload failed', {
        description: errorMessage
      });
      onError?.(errorMessage);
    }
  }, [enableAnalysis, bucket, folder, processingOptions, onSuccess, onAnalysisComplete, onError, fileUpload]);

  return {
    ...state,
    isLoading: state.isProcessing || state.isAnalyzing || fileUpload.isUploading,
    uploadProgress: fileUpload.progress,
    uploadImage
  };
};
