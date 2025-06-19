
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ImageProcessor, type ProcessedImageResult } from '@/lib/imageProcessor';
import { analyzeCardImage, type CardAnalysis } from '@/services/cardAnalyzer';

export interface ImageUploadOptions {
  enableAnalysis?: boolean;
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

  const uploadImage = useCallback(async (file: File) => {
    console.log('🚀 useImageUpload.uploadImage called:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      enableAnalysis,
      userAgent: navigator.userAgent,
      fileReaderSupported: typeof FileReader !== 'undefined'
    });
    
    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
      processedImage: null,
      analysis: null
    }));

    try {
      console.log('📋 Starting comprehensive file processing...');
      const processingToast = toast.loading('Processing image...', {
        description: 'Reading and optimizing your image'
      });

      // Process image with comprehensive error handling
      console.log('🔄 Starting image processing with enhanced debugging...');
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
      toast.success('Image processed successfully!', {
        description: `${result.dimensions.width}×${result.dimensions.height} • ${ImageProcessor.formatFileSize(result.fileSize)}`
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }

      // Start AI analysis if enabled
      if (enableAnalysis) {
        console.log('🤖 Starting AI analysis...');
        setState(prev => ({ ...prev, isAnalyzing: true }));
        
        const analysisToast = toast.loading('AI analyzing image...', {
          description: 'Generating card details'
        });

        try {
          const analysis = await analyzeCardImage(result.dataUrl);
          
          console.log('✅ AI analysis completed:', analysis);
          setState(prev => ({
            ...prev,
            isAnalyzing: false,
            analysis
          }));

          toast.dismiss(analysisToast);
          toast.success('AI analysis complete!');

          if (onAnalysisComplete) {
            onAnalysisComplete(analysis);
          }
        } catch (analysisError) {
          console.warn('⚠️ AI analysis failed:', analysisError);
          setState(prev => ({ ...prev, isAnalyzing: false }));
          
          toast.dismiss(analysisToast);
          toast.warning('Analysis had issues', {
            description: 'Using smart defaults instead'
          });
        }
      }

    } catch (error) {
      console.error('💥 Image upload failed with detailed context:', {
        error,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        browserInfo: {
          userAgent: navigator.userAgent,
          fileReaderSupported: typeof FileReader !== 'undefined',
          canvasSupported: typeof document.createElement === 'function',
          blobSupported: typeof Blob !== 'undefined'
        }
      });

      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        isAnalyzing: false,
        error: errorMessage
      }));

      toast.error('Upload failed', {
        description: errorMessage
      });

      if (onError) {
        onError(errorMessage);
      }
    }
  }, [enableAnalysis, processingOptions, onSuccess, onAnalysisComplete, onError]);

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      isAnalyzing: false,
      processedImage: null,
      analysis: null,
      error: null
    });
  }, []);

  return {
    ...state,
    uploadImage,
    reset,
    isLoading: state.isProcessing || state.isAnalyzing
  };
};
